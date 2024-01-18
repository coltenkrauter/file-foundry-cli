import axios from 'axios'

import { KeyToStringMapping, MovieDetails, TMDBMovie } from './index.js'

/**
 * The Movie Database (TMDb) API URL.
 * @constant
 * @type {string}
 */
const TMDB_API_URL = 'https://api.themoviedb.org/3'

const apiKey = String(process.env.TMDB_API_KEY)
const TMDB = 'TMDB'

/**
 * Fetch the genre list from The Movie Database (TMDb) API.
 *
 * @returns {Promise<KeyToStringMapping>} - A promise that resolves with a mapping of genre IDs to genre titles.
 */
export async function fetchGenreList(): Promise<KeyToStringMapping> {
	const apiUrl = `${TMDB_API_URL}/genre/movie/list`
	const params = {
		// eslint-disable-next-line camelcase
		api_key: apiKey,
	}

	const response = await axios.get(apiUrl, { params })
	const { genres } = response.data
	const genreMap: { [key: string]: string } = {}

	for (const genre of genres) {
		genreMap[genre.id.toString()] = genre.name
	}

	return genreMap
}

/**
 * Search for a movie by title and optionally by release year using The Movie Database (TMDb) API.
 *
 * @param {string} title - The title of the movie to search for.
 * @param {string} [releaseYear] - The release year of the movie (optional).
 * @returns {Promise<MovieDetails[]>} - A promise that resolves with a list of movie details or an error.
 * @async
 */
export async function searchMovieByTitle(title: string, releaseYear?: string): Promise<MovieDetails[]> {
	const apiUrl = `${TMDB_API_URL}/search/movie`
	const params: { [key: string]: string } = {
		// eslint-disable-next-line camelcase
		api_key: apiKey,
		query: title,
	}

	if (releaseYear) {
		params.year = releaseYear
	}

	try {
		const response = await axios.get(apiUrl, { params })
		const movieResults = response.data.results
        const genreMap = await fetchGenreList()
		
        return movieResults.map((movie: TMDBMovie) => {
			const movieName = movie.title
			const releaseDate = movie.release_date
			const extractedYear = releaseDate.split('-')[0]
			const releaseYear = extractedYear
			const genreIds = movie.genre_ids

			const genres = genreIds.map((genreId: number) => genreMap[genreId])

			const posterURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
			const backgroundURL = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`

			return { backgroundURL, genres, movieName, posterURL, releaseDate, releaseYear }
		})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errorMessage = error.message || (error.data && error.data.status_message) || 'An error occurred.'
		throw new Error(`${TMDB} – ${errorMessage}`)
	}
}
