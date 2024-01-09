import {Args, Command, Flags} from '@oclif/core'
import {readdirSync, statSync} from 'node:fs'
import {join, extname, basename} from 'node:path'
// eslint-disable-next-line no-restricted-imports
import * as colors from 'colors'

const movieExtensions = new Set(['.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.mpeg'])

export default class ListMovies extends Command {
  static description = 'Say hello'

  static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {
    depth: Flags.integer({aliases: ['d'], description: 'How many directories should be recursed (default: infinite)?', required: false}),
    includePath: Flags.boolean({aliases: ['p'], description: 'Include the path (default: false)?', required: false}),
    includeExt: Flags.boolean({aliases: ['e'], description: 'Include the extension (default: false)?', required: false}),
  }

  static args = {
    path: Args.string({description: 'List all movies in the given directory. (default: ./)', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(ListMovies)

    this.log(colors.blue.bold(`Listing all movies in the given path [${args.path}]...`))

    const movieFiles = ListMovies.getMovieFiles(args.path, flags.depth, flags.includePath, flags.includeExt)

    for (const file of movieFiles) {
      console.log(colors.green('✔ ') + colors.white(file))
    }

    this.log(colors.blue.bold(`Found ${movieFiles.length} movie files.`))
  }

  static getMovieFiles(
    dirPath: string | undefined,
    depth = Number.POSITIVE_INFINITY,
    includePath = false,
    includeExtension = false,
  ): string[] {
    if (dirPath === undefined) {
      dirPath = './'
    }

    const movieFiles: string[] = []

    function scanDirectory(currentPath: string, currentDepth: number) {
      if (currentDepth < 0) {
        return
      }

      const files = readdirSync(currentPath)
      for (const file of files) {
        const filePath = join(currentPath, file)
        if (statSync(filePath).isDirectory()) {
          scanDirectory(filePath, currentDepth - 1)
        } else {
          const fileExt = extname(file).toLowerCase()
          if (movieExtensions.has(fileExt)) {
            let fileName = includePath ? filePath : basename(file)
            if (!includeExtension) {
              fileName = fileName.replace(fileExt, '')
            }

            movieFiles.push(fileName)
          }
        }
      }
    }

    scanDirectory(dirPath, depth)
    return movieFiles
  }
}
