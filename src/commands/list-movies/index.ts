import {Args, Command, Flags} from '@oclif/core'
import ora from 'ora';

import colors from 'colors';

import {MovieResult, listMovies, movieExtensions, plural, removeWhitespace} from '../../utils/files.js'

interface ListMoviesResult {
  results: MovieResult[]
  total: number
  concerns: MovieResult[]
}
export default class ListMovies extends Command {
  public static enableJsonFlag = true
  static description = 'List all movies in the given directory'

  static examples = [
    `$ ff hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {
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

  static args = {
    path: Args.string({
      description: 'List all movies in the given directory. (default: ./)',
      required: false,
      default: './',
    }),
  }

  async run(): Promise<ListMoviesResult> {
    const {args, flags} = await this.parse(ListMovies)

    // eslint-disable-next-line func-call-spacing
    console.log(colors.blue.bold(`Listing all movies in the given path [${args.path}]`))
    const spinner = ora('Warming up the engine...').start();

    // Collect all promises from the async generator into an array
    const results: MovieResult[] = []
    const extensions = removeWhitespace(flags.extensions).split(',')
    let index = 0;
    for await (const result of listMovies(args.path, flags.depth, extensions, flags.omitPrefix)) {
      index++
      results.push(result)
      spinner.text = `Scanned ${colors.white.bold(String(index))} movie file${plural(index)}`
    }
    spinner.stop();

    const response = {
      results,
      total: results.length,
      concerns: results.filter(result => Number(result.resolution.height) < flags.minAcceptableHeight),
    }

    return response 
  }
}
