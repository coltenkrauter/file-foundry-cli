export interface FileDetails {
	filename: string
	baseFilename: string
	filePath: string
	extension: string
	additionalExtensions: string[]
	isKit: boolean
}

export interface VideoDetails {
	width?: number
	height?: number
	codec?: string
	frameRate?: string
	durationSeconds?: number
	scanType?: string
	format?: string
}

export interface VideoResult {
	fileDetails: FileDetails
	videoDetails: VideoDetails
}