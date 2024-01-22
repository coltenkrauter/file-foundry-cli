import {VideoResult} from './interfaces.js'

export interface ListMoviesResult {
	concerns: VideoResult[]
	results: VideoResult[]
	total: number
}
