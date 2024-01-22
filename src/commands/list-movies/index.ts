import {Args, Flags} from '@oclif/core'
// eslint-disable-next-line no-restricted-imports
import colors from 'colors'
import ora from 'ora'

import {BaseCommand} from '../../base.js'
import {LogMessages, plexExtrasSuffixes, videoExtensions} from '../../utils/constants.js'
import {listVideos, parseList, plural} from '../../utils/index.js'
import {ListMoviesResult} from '../../utils/list-movies.interfaces.js'

export default class ListMovies extends BaseCommand<typeof ListMovies> {
	public static args = {
		path: Args.string({
			default: './',
			description: 'List all movies in the given directory.',
			required: false,
		}),
	}

	public static description = 'List all movies in the given directory'
	public static enableJsonFlag = true

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
			default: Number.POSITIVE_INFINITY,
			description: 'How many directories should be recursed?',
			required: false,
		}),
		extensions: Flags.string({
			aliases: ['e'],
			default: videoExtensions.join(','),
			description: 'Replace the default movie file extensions used during the scan.',
			required: false,
		}),
		minAcceptableHeight: Flags.integer({
			aliases: ['d'],
			default: 720,
			description: 'What is the minimum acceptable height in pixels?',
			required: false,
		}),
		omitPrefixes: Flags.string({
			aliases: ['op'],
			default: '.',
			description: 'Omit files that match one of the given prefixes.',
			required: false,
		}),
		omitSuffixes: Flags.string({
			aliases: ['os'],
			default: plexExtrasSuffixes.join(','),
			description: 'Omit files that match one of the given suffixes (extensions ignored).',
			required: false,
		}),
	}

	async run(): Promise<ListMoviesResult> {
		const {args, flags} = await this.parse(ListMovies)

		this.logger.info(colors.blue.bold(`Listing all movies in the given path [${args.path}]`))
		const spinner = ora(LogMessages.WarmUp).start()

		// Collect all promises from the async generator into an array
		const results = []
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

			this.debug(result)
		}

		spinner.stop()

		// Generate Report
		const concerns = results
			.filter(r => Number(r.videoDetails.height) < flags.minAcceptableHeight).length
		this.logger.info(colors.green.bold(`\n${LogMessages.ReportSummary}`))
		this.logger.info(`Total Movie Files: ${results.length}`)
		this.logger.info(colors.red(`Total Concerns (Resolution < ${flags.minAcceptableHeight}): ${concerns}`))
		this.logger.info(`Unique Filenames: ${new Set(results.map(r => r.fileDetails.filename)).size}`)
		this.logger.info(`Movies in Kits: ${results.filter(r => r.fileDetails.isKit).length}`)
		this.logger.info('Movies by File Extension:')
		for (const [ext, count] of Object.entries(extensionCount)) this.logger.info(` ${ext.toLowerCase()}: ${count}`)
		this.logger.info('Movies by File Group:')
		for (const [grp, count] of Object.entries(groupCount)) this.logger.info(` ${grp}: ${count}`)
		this.logger.info('Movies by Resolution:')
		for (const [res, count] of Object.entries(resolutionCount)
			.sort((a, b) => Number.parseInt(b[0], 10) - Number.parseInt(a[0], 10))) this.logger.info(` ${res}: ${count}`)
		return {
			concerns: results.filter(r => Number(r.videoDetails.height) < flags.minAcceptableHeight),
			results,
			total: results.length,
		} 
	}
}
