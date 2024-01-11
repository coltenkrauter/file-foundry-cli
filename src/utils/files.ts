import {readdirSync, statSync} from 'node:fs'
import {basename, extname, join} from 'node:path'
import ffmpeg = require('fluent-ffmpeg')

export const movieExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.mpeg']

/**
 * Removes all whitespace from the given string.
 *
 * @param {string} str - The string from which to remove whitespace.
 * @returns {string} The string with all whitespace removed.
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '')
}

/**
 * Returns the first character of a string in lowercase.
 *
 * If the input string is empty, it returns an empty string.
 *
 * @param {string} str - The string from which the first character is extracted.
 * @returns {string} The first character of the input string in lowercase, or an empty string if the input is empty.
 */
export function firstCharLowercased(str: string): string {
  if (str.length === 0) return ''
  return str.charAt(0).toLowerCase()
}

/**
 * Recursively lists files in a directory and its subdirectories up to a given depth.
 *
 * @param {string} path - The directory path to scan.
 * @param {number} depth - The depth of subdirectories to traverse. 0 for the current directory,
 * 1 for its immediate subdirectories, etc. Negative depth returns an empty array.
 * @param {string} omitPrefix - Optional. Prefix of files to ignore.
 * @returns {string[]} An array of file paths.
 *
 * This function reads the directory contents using readdirSync. For each item, if it's a directory,
 * it recursively calls itself with decremented depth. If it's a file, its path is added to the results.
 */
export function * listFiles(path: string, depth: number, omitPrefix?: string): Generator<string> {
  if (depth < 0) {
    return
  }

  const files = readdirSync(path)
  for (const file of files) {
    const filePath = join(path, file)
    if (statSync(filePath).isDirectory()) {
      yield * listFiles(filePath, depth - 1, omitPrefix)
    } else if (!basename(filePath).startsWith(String(omitPrefix))) {
      yield filePath
    }
  }
}

export interface MovieResult {
  altExtension: string
  baseFilename: string
  coreFilename: string
  extension: string
  filename: string
  path: string
  resolution: VideoResolution
}

async function generateMovieResults(path: string) {
  const resolution = await getVideoResolution(path)
  const filename = basename(path)
  const extension = extname(filename)
  const baseFilename = filename.replace(extension, '')
  const altExtension = extname(baseFilename)
  const coreFilename = baseFilename.replace(altExtension, '')
  return {
    altExtension,
    baseFilename,
    coreFilename,
    extension,
    filename,
    path,
    resolution,
  }
}

/**
 * Recursively lists movie files in a specified directory and its subdirectories up to a given depth,
 * filtering by a set of movie file extensions. Additional file extensions may be provided.
 *
 * @param {string} path - The directory path to scan.
 * @param {number} depth - The depth of subdirectories to traverse. 0 for the current directory,
 * 1 for its immediate subdirectories, etc. Negative depth returns an empty array.
 * @param {string[]} extensions - Optional. Replace file extensions used during the scan.
 * @param {string} omitPrefix - Optional. Prefix of files to ignore.
 * @returns {MovieListResult} An object containing `paths` (an array of file paths that match the
 * movie extensions) and `extensions` (a set of the extensions used for filtering).
 */
export async function * listMovies(
  path: string,
  depth: number,
  extensions: string[] = [],
  omitPrefix = '.',
): AsyncGenerator<MovieResult> {
  for await (const resultPath of listFiles(path, depth, omitPrefix)) {
    const lowerExtensions = new Set([...extensions].map(ext => ext.toLowerCase()))
    if (lowerExtensions.has(extname(resultPath).toLowerCase())) {
      yield generateMovieResults(resultPath)
    }
  }
}

interface VideoResolution {
  width?: number
  height?: number
  codec?: string
  frameRate?: string
  durationSeconds?: number
  scanType?: string
  format?: string
  error?: string
}
async function getVideoResolution(path: string): Promise<VideoResolution> {
  return new Promise(resolve => {
    ffmpeg.ffprobe(path, (error: string, metadata: { streams: any[] }) => {
      if (error) {
        resolve({error})
      } else {
        const videoStream = metadata.streams.find(s => s.codec_type === 'video')
        const scanType = videoStream.field_order || 'progressive' // Assumption
        if (videoStream) {
          resolve({
            width: videoStream.width,
            height: videoStream.height,
            codec: videoStream.codec_name,
            frameRate: videoStream.avg_frame_rate,
            durationSeconds: videoStream.duration,
            scanType,
            format: videoStream.height + firstCharLowercased(scanType),
          })
        } else {
          resolve({})
        }
      }
    })
  })
}
