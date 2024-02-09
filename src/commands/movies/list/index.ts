import {Args, Flags} from '@oclif/core'
// eslint-disable-next-line no-restricted-imports
import colors from 'colors'
import ora from 'ora'

import {BaseCommand} from '../../../base.js'
import {LogMessages, plexExtrasSuffixes, videoExtensions} from '../../../utils/constants.js'
import {getCommandName, listVideos, plural} from '../../../utils/index.js'
import {ListMoviesResult} from '../../../utils/list-movies.interfaces.js'

export default class ListMovies extends BaseCommand<typeof ListMovies> {
	public static args = {
		path: Args.string({
			default: './',
			description: 'The directory to traverse',
			required: false,
		}),
	}

	public static commandName = getCommandName(import.meta.url)
	public static description = 'List all movies in the given directory'
	public static enableJsonFlag = true

	public static examples = [
		`$ ff ${this.commandName} ./path/to/movies --depth 3`,
		`$ ff ${this.commandName} ./path/to/movies --omitPrefix .`,
		`$ ff ${this.commandName} ./path/to/movies --extensions mp4,mov`,
		`$ ff ${this.commandName} ./path/to/movies --minAcceptableHeight 720`,
		`$ ff ${this.commandName} /Volumes/TrueNAS-Phantom/Media/movies --depth 3 --json`,
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
			default: videoExtensions,
			delimiter: ',',
			description: 'Replace the default movie file extensions used during the scan.',
			multiple: true,
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
			default: ['.'],
			delimiter: ',',
			description: 'Omit files that match one of the given prefixes.',
			multiple: true,
			required: false,
		}),
		omitSuffixes: Flags.string({
			aliases: ['os'],
			default: plexExtrasSuffixes,
			delimiter: ',',
			description: 'Omit files that match one of the given suffixes (extensions ignored).',
			multiple: true,
			required: false,
		}),
	}

	async run(): Promise<ListMoviesResult> {
		const {args, flags} = await this.parse(ListMovies)

		this.logger.info(colors.blue.bold(`Listing all movies in the given path [${args.path}]`))
		const spinner = ora(LogMessages.WarmUp).start()

		// Collect all promises from the async generator into an array
		const results = []
		const extensions: {[key: string]: number} = {}
		const resolutions: {[key: string]: number} = {}
		const groups: {[key: string]: number} = {}
		let index = 0
		for await (const result of listVideos(
			args.path,
			flags.depth,
			flags.extensions,
			flags.omitPrefixes,
			flags.omitSuffixes,
		)) {
			index++
			results.push(result)
			const {fileDetails, videoDetails} = result
			spinner.text = `Scanned ${colors.white.bold(String(index))} movie file${plural(index)}`

			// Counting extensions for report
			const ext = fileDetails.extension.toLowerCase()
			extensions[ext] = (extensions[ext] || 0) + 1

			// Counting resolutions for report
			if (videoDetails.format) {
				resolutions[videoDetails.format] = (resolutions[videoDetails.format] || 0) + 1
			}

			// Counting groups for report
			if (fileDetails.group) {
				groups[fileDetails.group] = (groups[fileDetails.group] || 0) + 1
			}
		}

		spinner.stop()

		const report = {
			concerns: results
				.filter(r => Number(r.videoDetails.height) < flags.minAcceptableHeight).length,
			extensions,
			groups,
			resolutions,
			total: {
				files: results.length,
				kits: results.filter(r => r.fileDetails.isKit).length,
				uniquefiles: new Set(results.map(r => r.fileDetails.filename)).size,
			},
		}
		// .sort((a, b) => Number.parseInt(b[0], 10) - Number.parseInt(a[0], 10))
		console.log(report)
		return {
			concerns: results.filter(r => Number(r.videoDetails.height) < flags.minAcceptableHeight),
			report,
			results,
			total: results.length,
		} 
	}
}
