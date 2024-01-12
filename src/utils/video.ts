import ffmpeg from 'fluent-ffmpeg'
import {VideoResult, VideoDetails, getLowerFirstChar, listFiles, isKit, capitalize} from './index.js'
import {basename, extname} from 'node:path'

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
): AsyncGenerator<VideoResult> {
	for await (const resultPath of listFiles(path, depth, omitPrefix)) {
		const lowerExtensions = new Set([...extensions].map(ext => ext.toLowerCase()))
		if (lowerExtensions.has(extname(resultPath).toLowerCase())) {
			yield getVideoResult(resultPath)
		}
	}
}

export async function getVideoDetails(filePath: string): Promise<VideoDetails> {
	return new Promise(resolve => {
		ffmpeg.ffprobe(filePath, (error: string, metadata: { streams: any[] }) => {
			if (error) {
				console.error(filePath, error)
				resolve({})
			} else {
				const videoStream = metadata.streams.find(s => s.codec_type === 'video')
				if (videoStream) {
					const {width, height, codec_name, avg_frame_rate, duration, field_order} = videoStream
					let scanType = 'interlaced' // The interlaced values for field_order are tt, bb, tb, and bt.
					if (field_order && ['progressive', 'unknown', 'undefined'].includes(field_order)) {
						scanType = 'progressive' // Assumption – Choosing to default to progressive
					}
					resolve({
						width,
						height,
						codec: codec_name,
						frameRate: avg_frame_rate,
						durationSeconds: duration,
						scanType,
						format: height + getLowerFirstChar(scanType),
					})
				} else {
					resolve({})
				}
			}
		})
	})
}

export async function getVideoResult(filePath: string): Promise<VideoResult> {
	const filename = basename(filePath)
	const extension = extname(filename)
	const filenameWithoutExtension = filename.replace(extension, '')

	const parts = filenameWithoutExtension.split('.')
	const baseFilename = parts.shift() || ''
	
	const match = baseFilename.match(/(.+?)(?:\s\((\d{4})\))?$/)
	const name = match?.[1].trim()
    const year = match?.[2] ? parseInt(match[2], 10) : undefined
	return {
		fileDetails: {
			filename,
			baseFilename,
			filePath,
			extension,
			additionalExtensions: parts.map(ext => `.${ext}`),
			isKit: await isKit(filePath),
		},
		videoDetails: {
			...await getVideoDetails(filePath),
			name,
			year,
		},
	}
}
