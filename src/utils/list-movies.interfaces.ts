import {VideoResult} from './interfaces.js'

export interface ListMoviesResult {
	concerns: VideoResult[]
	report: unknown
	results: VideoResult[]
	total: number
}
