import ffmpeg, { FfprobeStream } from 'fluent-ffmpeg'

import {
	VideoDetails,
	VideoResult,
	basename,
	extname,
	getGroup,
	getLowerFirstChar,
	isKit,
	listFiles,
} from './index.js'

/**
 * Recursively lists movie files in a specified directory and its subdirectories up to a given depth,
 * filtering by a set of movie file extensions. Additional file extensions may be provided.
 *
 * @param {string} path - The directory path to scan.
 * @param {number} depth - The depth of subdirectories to traverse. 0 for the current directory,
 * 1 for its immediate subdirectories, etc. Negative depth returns an empty array.
 * @param {string[]} extensions - Optional. Replace file extensions used during the scan.
 * @param {string[]} omitPrefixes - Optional. List of prefixes of files to ignore.
 * @param {string[]} omitSuffixes - Optional. List of suffixes of files to ignore.
 * @returns {MovieListResult} An object containing `paths` (an array of file paths that match the
 * movie extensions) and `extensions` (a set of the extensions used for filtering).
 */
// eslint-disable-next-line max-params
export async function * listVideos(
	path: string,
	depth: number,
	extensions: string[] = [],
	omitPrefixes: string[] = [],
	omitSuffixes: string[] = [],
): AsyncGenerator<VideoResult> {
	for await (const resultPath of listFiles(path, depth, omitPrefixes, omitSuffixes)) {
		const lowerExtensions = new Set([...extensions].map(ext => ext.toLowerCase()))
		if (lowerExtensions.has(extname(resultPath).toLowerCase())) {
			yield getVideoResult(resultPath)
		}
	}
}

export async function getVideoDetails(filePath: string): Promise<VideoDetails> {
	return new Promise(resolve => {
		// eslint-disable-next-line import/no-named-as-default-member
		ffmpeg.ffprobe(filePath, (error: string, metadata: { streams: FfprobeStream[] }) => {
			if (error) {
				console.error(filePath, error)
				resolve({})
			} else {
				const videoStream = metadata.streams.find(s => s.codec_type === 'video')
				if (videoStream) {
					// eslint-disable-next-line camelcase
					const {avg_frame_rate, codec_name, duration, field_order, height, width} = videoStream
					let scanType = 'interlaced' // The interlaced values for field_order are tt, bb, tb, and bt.
					// eslint-disable-next-line camelcase
					if (field_order && ['progressive', 'undefined', 'unknown'].includes(field_order)) {
						scanType = 'progressive' // Assumption – Choosing to default to progressive
					}

					resolve({
						// eslint-disable-next-line camelcase
						codec: codec_name,
						durationSeconds: duration,
						format: height + getLowerFirstChar(scanType),
						// eslint-disable-next-line camelcase
						frameRate: avg_frame_rate,
						height,
						scanType,
						width,
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
	const year = match?.[2] ? Number.parseInt(match[2], 10) : undefined
	return {
		fileDetails: {
			additionalExtensions: parts.map(ext => `.${ext}`),
			baseFilename,
			extension,
			filePath,
			filename,
			group: await getGroup(filePath),
			isKit: await isKit(filePath),
		},
		videoDetails: {
			...await getVideoDetails(filePath),
			name,
			year,
		},
	}
}
