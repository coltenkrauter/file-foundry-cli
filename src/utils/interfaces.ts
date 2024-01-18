export interface FileDetails {
	additionalExtensions: string[]
	baseFilename: string
	extension: string
	filePath: string
	filename: string
	group: string
	isKit: boolean
}

export interface VideoDetails {
	codec?: string
	durationSeconds?: string
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

export interface KeyToStringMapping {
	[key: string]: string
}

export interface MovieDetails {
    backgroundURL: string
    genres: string[]
    movieName: string
    posterURL: string
    releaseDate: string
    releaseYear: string
}

export interface TMDBMovie {
    adult: boolean
    backdrop_path: null | string
    genre_ids: number[]
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: null | string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}
