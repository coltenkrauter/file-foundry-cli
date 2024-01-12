import colors from 'colors'
import ora from 'ora'
import {Args, Command, Flags} from '@oclif/core'

import {MovieResult, listVideos, plural, removeWhitespace} from '../../utils/index.js'
import {LogMessages, movieExtensions} from '../../utils/constants.js'

interface ListMoviesResult {
  results: MovieResult[]
  total: number
  concerns: MovieResult[]
}
export default class ListMovies extends Command {
  public static enableJsonFlag = true
  public static description = 'List all movies in the given directory'

  public static examples = [
    `$ ff list-movies ./path/to/movies --depth 3`,
    `$ ff list-movies ./path/to/movies --omitPrefix .`,
    `$ ff list-movies ./path/to/movies --extensions mp4,mov`,
    `$ ff list-movies ./path/to/movies --minAcceptableHeight 720`,
  ]

  public static flags = {
    depth: Flags.integer({
      aliases: ['d'],
      description: 'How many directories should be recursed (default: infinite)?',
      required: false,
      default: Number.POSITIVE_INFINITY,
    }),
    omitPrefix: Flags.string({
      aliases: ['op'],
      description: 'Omit files with the given prefix (default: .)?',
      required: false,
      default: '.',
    }),
    extensions: Flags.string({
      aliases: ['e'],
      description: `Replace the default movie file extensions used during the scan. (default: ${movieExtensions.join(',')})?`,
      required: false,
      default: movieExtensions.join(','),
    }),
    minAcceptableHeight: Flags.integer({
      aliases: ['d'],
      description: 'How many directories should be recursed (default: 720)?',
      required: false,
      default: 720,
    }),
  }

  public static args = {
    path: Args.string({
      description: 'List all movies in the given directory. (default: ./)',
      required: false,
      default: './',
    }),
  }

  async run(): Promise<ListMoviesResult> {
    const {args, flags} = await this.parse(ListMovies)

    console.log(colors.blue.bold(`Listing all movies in the given path [${args.path}]`))
    const spinner = ora(LogMessages.WarmUp).start()

    // Collect all promises from the async generator into an array
    const results: MovieResult[] = []
    const extensions = removeWhitespace(flags.extensions).split(',')
    const extensionCount: {[key: string]: number} = {}
    const resolutionCount: {[key: string]: number} = {}
    let index = 0
    for await (const result of listVideos(args.path, flags.depth, extensions, flags.omitPrefix)) {
      index++
      results.push(result)
      spinner.text = `Scanned ${colors.white.bold(String(index))} movie file${plural(index)}`

      // Counting extensions
      const ext = result.extension.toLowerCase()
      extensionCount[ext] = (extensionCount[ext] || 0) + 1

      // Counting resolutions
      if (result.resolution.format) {
        resolutionCount[result.resolution.format] = (resolutionCount[result.resolution.format] || 0) + 1
      }
    }
    spinner.stop()

    // Generate Report
    const concerns = results.filter(result => Number(result.resolution.height) < flags.minAcceptableHeight).length
    console.log(colors.green.bold(`\n${LogMessages.ReportSummary}`))
    console.log(`Total Movie Files: ${results.length}`)
    console.log(colors.red(`Total Concerns (Resolution < ${flags.minAcceptableHeight}): ${concerns}`))
    console.log(`Unique Filenames: ${new Set(results.map(r => r.filename)).size}`)
    console.log('Movies by File Extension:')
    Object.entries(extensionCount).forEach(([ext, count]) => console.log(` ${ext.toLowerCase()}: ${count}`))
    console.log('Movies by Resolution:')
    Object.entries(resolutionCount)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .forEach(([res, count]) => console.log(` ${res}: ${count}`))

    return {
      results,
      total: results.length,
      concerns: results.filter(result => Number(result.resolution.height) < flags.minAcceptableHeight),
    } 
  }
}
