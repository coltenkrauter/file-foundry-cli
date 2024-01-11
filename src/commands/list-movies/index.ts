import {Args, Command, Flags} from '@oclif/core'

// eslint-disable-next-line no-restricted-imports
import * as colors from 'colors'

import {MovieResult, listMovies} from '../../utils/files'

export default class ListMovies extends Command {
  static description = 'Say hello'

  static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {
    depth: Flags.integer({aliases: ['d'], description: 'How many directories should be recursed (default: infinite)?', required: false, default: Number.POSITIVE_INFINITY}),
    includePath: Flags.boolean({aliases: ['p'], description: 'Include the path (default: false)?', required: false, default: false}),
    includeExt: Flags.boolean({aliases: ['e'], description: 'Include the extension (default: false)?', required: false, default: false}),
    omitPrefix: Flags.string({aliases: ['op'], description: 'Omit files with the given prefix (default: _)?', required: false, default: '.'}),
  }

  static args = {
    path: Args.string({description: 'List all movies in the given directory. (default: ./)', required: false, default: './'}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(ListMovies)

    // eslint-disable-next-line func-call-spacing
    console.log(colors.blue.bold(`Listing all movies in the given path [${args.path}]...`))

    const results: MovieResult[] = [];

    // eslint-disable-next-line no-unexpected-multiline
    (async () => {
      for await (const result of listMovies(args.path, flags.depth, [], flags.omitPrefix)) {
        results.push(result)
        if (result.resolution?.error) {
          console.log(colors.red('✘ ') + colors.white(result.path) + colors.red(String(result.resolution.format)))
          console.log(colors.red('✘ - Undefined resolution'))
        } else if (Number(result.resolution?.height) < 720) {
          console.log(colors.red('✘ ') + colors.white(result.path) + colors.red(String(result.resolution.format)))
          console.log(colors.red('✘ - Low resolution'))
        } else {
          console.log(colors.green('✔ ') + colors.white(result.path) + colors.gray(String(result.resolution.format)))
        }
      }
    })()

    const paths = results.map(result => result.path)
    console.log('Total:' + paths.length)
    console.log('Deduped total:' + new Set(paths).size)
  }
}
