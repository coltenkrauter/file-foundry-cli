export interface VideoResolution {
	width?: number
	height?: number
	codec?: string
	frameRate?: string
	durationSeconds?: number
	scanType?: string
	format?: string
	error?: string
}

export interface VideoResult {
	altExtension: string
	baseFilename: string
	coreFilename: string
	extension: string
	filename: string
	filePath: string
	resolution: VideoResolution
	isKit: boolean
}
