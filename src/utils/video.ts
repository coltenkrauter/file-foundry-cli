import ffmpeg from 'fluent-ffmpeg'
import {MovieResult, VideoResolution, firstCharLowercased, getFilenameWithoutExt, listFiles} from './index.js'
import {basename, dirname, extname} from 'node:path'

/**
 * Recursively lists movie files in a specified directory and its subdirectories up to a given depth,
 * filtering by a set of movie file extensions. Additional file extensions may be provided.
 *
 * @param {string} path - The directory path to scan.
 * @param {number} depth - The depth of subdirectories to traverse. 0 for the current directory,
 * 1 for its immediate subdirectories, etc. Negative depth returns an empty array.
 * @param {string[]} extensions - Optional. Replace file extensions used during the scan.
 * @param {string} omitPrefix - Optional. Prefix of files to ignore.
 * @returns {MovieListResult} An object containing `paths` (an array of file paths that match the
 * movie extensions) and `extensions` (a set of the extensions used for filtering).
 */
export async function * listVideos(
	path: string,
	depth: number,
	extensions: string[] = [],
	omitPrefix = '.',
): AsyncGenerator<MovieResult> {
	for await (const resultPath of listFiles(path, depth, omitPrefix)) {
		const lowerExtensions = new Set([...extensions].map(ext => ext.toLowerCase()))
		if (lowerExtensions.has(extname(resultPath).toLowerCase())) {
			yield generateMovieResults(resultPath)
		}
	}
}

export async function getVideoResolution(path: string): Promise<VideoResolution> {
	return new Promise(resolve => {
		ffmpeg.ffprobe(path, (error: string, metadata: { streams: any[] }) => {
			if (error) {
				resolve({error})
			} else {
				const videoStream = metadata.streams.find(s => s.codec_type === 'video')
				const scanType = videoStream.field_order || 'progressive' // Assumption
				if (videoStream) {
					resolve({
						width: videoStream.width,
						height: videoStream.height,
						codec: videoStream.codec_name,
						frameRate: videoStream.avg_frame_rate,
						durationSeconds: videoStream.duration,
						scanType,
						format: videoStream.height + firstCharLowercased(scanType),
					})
				} else {
					resolve({})
				}
			}
		})
	})
}
  
  
/**
 * Checks if a movie file is part of a kit, meaning it's in a directory with the same base name.
 * 
 * @param filePath The full path of the file.
 * @returns true if the file is part of a kit, false otherwise.
 */
async function isKit(filePath: string): Promise<boolean> {
	const directoryName = basename(dirname(filePath))
	const fileNameWithoutExt = getFilenameWithoutExt(filePath)

	return directoryName === fileNameWithoutExt
}

export async function generateMovieResults(path: string) {
	const resolution = await getVideoResolution(path)
	const filename = basename(path)
	const extension = extname(filename)
	const baseFilename = filename.replace(extension, '')
	const altExtension = extname(baseFilename)
	const coreFilename = baseFilename.replace(altExtension, '')
	return {
		altExtension,
		baseFilename,
		coreFilename,
		extension,
		filename,
		path,
		resolution,
	}
}
  
  