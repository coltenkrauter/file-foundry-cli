export interface FileDetails {
	additionalExtensions: string[]
	baseFilename: string
	extension: string
	filePath: string
	filename: string
	isKit: boolean
}

export interface VideoDetails {
	codec?: string
	durationSeconds?: number
	format?: string
	frameRate?: string
	height?: number
	name?: string
	scanType?: string
	width?: number
	year?: number
}

export interface VideoResult {
	fileDetails: FileDetails
	videoDetails: VideoDetails
}