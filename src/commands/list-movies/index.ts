import colors from 'colors'
import ora from 'ora'
import {Args, Command, Flags} from '@oclif/core'

import {VideoResult, listVideos, parseList, plural, removeWhitespace} from '../../utils/index.js'
import {LogMessages, plexExtrasSuffixes, videoExtensions} from '../../utils/constants.js'

interface ListMoviesResult {
	results: VideoResult[]
	total: number
	concerns: VideoResult[]
}
export default class ListMovies extends Command {
	public static enableJsonFlag = true
	public static description = 'List all movies in the given directory'

	public static examples = [
		`$ ff list-movies ./path/to/movies --depth 3`,
		`$ ff list-movies ./path/to/movies --omitPrefix .`,
		`$ ff list-movies ./path/to/movies --extensions mp4,mov`,
		`$ ff list-movies ./path/to/movies --minAcceptableHeight 720`,
		`$ ff list-movies /Volumes/TrueNAS-Phantom/Media/movies --depth 3 --json`,
	]

	public static flags = {
		depth: Flags.integer({
			aliases: ['d'],
			description: 'How many directories should be recursed?',
			required: false,
			default: Number.POSITIVE_INFINITY,
		}),
		omitPrefixes: Flags.string({
			aliases: ['op'],
			description: 'Omit files that match one of the given prefixes.',
			required: false,
			default: '.',
		}),
		extensions: Flags.string({
			aliases: ['e'],
			description: 'Replace the default movie file extensions used during the scan.',
			required: false,
			default: videoExtensions.join(','),
		}),
		omitSuffixes: Flags.string({
			aliases: ['os'],
			description: 'Omit files that match one of the given suffixes (extensions ignored).',
			required: false,
			default: plexExtrasSuffixes.join(','),
		}),
		minAcceptableHeight: Flags.integer({
			aliases: ['d'],
			description: 'What is the minimum acceptable height in pixels?',
			required: false,
			default: 720,
		}),
	}

	public static args = {
		path: Args.string({
			description: 'List all movies in the given directory.',
			required: false,
			default: './',
		}),
	}

	async run(): Promise<ListMoviesResult> {
		const {args, flags} = await this.parse(ListMovies)

		console.log(colors.blue.bold(`Listing all movies in the given path [${args.path}]`))
		const spinner = ora(LogMessages.WarmUp).start()

		// Collect all promises from the async generator into an array
		const results: VideoResult[] = []
		const extensionCount: {[key: string]: number} = {}
		const resolutionCount: {[key: string]: number} = {}
		const groupCount: {[key: string]: number} = {}
		let index = 0
		for await (const result of listVideos(
			args.path,
			flags.depth,
			parseList(flags.extensions),
			parseList(flags.omitPrefixes),
			parseList(flags.omitSuffixes),
		)) {
			index++
			results.push(result)
			const {fileDetails, videoDetails} = result
			spinner.text = `Scanned ${colors.white.bold(String(index))} movie file${plural(index)}`

			// Counting extensions for report
			const ext = fileDetails.extension.toLowerCase()
			extensionCount[ext] = (extensionCount[ext] || 0) + 1

			// Counting resolutions for report
			if (videoDetails.format) {
				resolutionCount[videoDetails.format] = (resolutionCount[videoDetails.format] || 0) + 1
			}

			// Counting groups for report
			if (fileDetails.group) {
				groupCount[fileDetails.group] = (groupCount[fileDetails.group] || 0) + 1
			}
		}
		spinner.stop()

		console.log(results.map(r => r.fileDetails.filePath))

		// Generate Report
		const concerns = results
			.filter(r => Number(r.videoDetails.height) < flags.minAcceptableHeight).length
		console.log(colors.green.bold(`\n${LogMessages.ReportSummary}`))
		console.log(`Total Movie Files: ${results.length}`)
		console.log(colors.red(`Total Concerns (Resolution < ${flags.minAcceptableHeight}): ${concerns}`))
		console.log(`Unique Filenames: ${new Set(results.map(r => r.fileDetails.filename)).size}`)
		console.log(`Movies in Kits: ${results.filter(r => r.fileDetails.isKit).length}`)
		console.log('Movies by File Extension:')
		Object.entries(extensionCount)
			.forEach(([ext, count]) => console.log(` ${ext.toLowerCase()}: ${count}`))
		console.log('Movies by File Group:')
		Object.entries(groupCount)
			.forEach(([grp, count]) => console.log(` ${grp}: ${count}`))
		console.log('Movies by Resolution:')
		Object.entries(resolutionCount)
			.sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
			.forEach(([res, count]) => console.log(` ${res}: ${count}`))

		return {
			results,
			total: results.length,
			concerns: results.filter(r => Number(r.videoDetails.height) < flags.minAcceptableHeight),
		} 
	}
}
