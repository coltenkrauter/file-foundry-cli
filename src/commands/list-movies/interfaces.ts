import { VideoResult } from "../../utils/interfaces.js"

export interface ListMoviesResult {
	concerns: VideoResult[]
	results: VideoResult[]
	total: number
}
