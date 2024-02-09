import {readdirSync, statSync} from 'node:fs'
import {basename as _basename, dirname as _dirname, extname as _extname, join, sep} from 'node:path'
import { fileURLToPath } from 'node:url'

import {memoize} from './memoize.js'

export const basename = memoize(_basename)
export const dirname = memoize(_dirname)
export const extname = memoize(_extname)

/**
 * Recursively lists files in a directory and its subdirectories up to a given depth.
 *
 * @param {string} path - The directory path to scan.
 * @param {number} depth - The depth of subdirectories to traverse. 0 for the current directory,
 * 1 for its immediate subdirectories, etc. Negative depth returns an empty array.
 * @param {string[]} omitPrefixes - Optional. List of prefixes of files to ignore.
 * @param {string[]} omitSuffixes - Optional. List of suffixes of files to ignore.
 * @returns {string[]} An array of file paths.
 *
 * This function reads the directory contents using readdirSync. For each item, if it's a directory,
 * it recursively calls itself with decremented depth. If it's a file, its path is added to the results.
 */
export function * listFiles(path: string, depth: number, omitPrefixes?: string[], omitSuffixes?: string[]): Generator<string> {
	if (depth < 0) {
		return
	}

	const files = readdirSync(path)
	for (const file of files) {
		const filePath = join(path, file)
		const filename = basename(filePath)
		if (statSync(filePath).isDirectory()) {
			yield * listFiles(filePath, depth - 1, omitPrefixes, omitSuffixes)
		} else if (!startsWithOmittedPrefix(filename, omitPrefixes) && !endsWithOmmitedSuffix(filename, omitSuffixes)) {
			yield filePath
		}
	}
}

/**
 * Returns the filename without its extension(s).
 * 
 * @param {string} filePath - The full path of the file.
 * @returns {string} The memoized filename without extension(s).
 */
const getFilenameWithoutExt = memoize((filePath: string): string => {
	const base = basename(filePath)
	const firstDotIndex = base.indexOf('.')
	return firstDotIndex === -1 ? base : base.slice(0, Math.max(0, firstDotIndex))
})

/**
 * Checks if a file is part of a kit, meaning it's in a directory with the same base name.
 * 
 * @param filePath The full path of the file.
 * @returns true if the file is part of a kit, false otherwise.
 */
export async function isKit(filePath: string): Promise<boolean> {
	const directoryName = basename(dirname(filePath))
	const fileNameWithoutExt = getFilenameWithoutExt(filePath)

	return directoryName === fileNameWithoutExt
}

/**
 * Returns the group which is the the parent directory name of the kit or file.
 * 
 * @param filePath The full path of the file.
 * @returns The group which is the the parent directory name of the kit or file.
 */
export async function getGroup(filePath: string): Promise<string> {
	const directory = dirname(filePath)
	if (await isKit(filePath)) {
		const parentDirectory = dirname(directory)
		return basename(parentDirectory)
	}

	return basename(directory)
}

/**
 * Check if a filename (ignoring extensions) ends with one of the omited suffixes.
 *
 * @param {string} filename - The filename to check.
 * @param {string[]} omitSuffixes - Optional. List of suffixes of files to ignore.
 * @returns {boolean} True if the filename (without extensions) ends with an omitted suffix, false otherwise.
 */
export function endsWithOmmitedSuffix(filename: string, omitSuffixes?: string[]): boolean {
	if (!omitSuffixes) {
		return false
	}

	return omitSuffixes.some((suffix) => getFilenameWithoutExt(filename).endsWith(suffix))
}

/**
 * Check if a filename starts with one of the omitted prefixes.
 *
 * @param {string} filename - The filename to check.
 * @param {string[]} omitPrefixes - Optional. List of prefixes of files to ignore.
 * @returns {boolean} True if the filename starts with an omitted prefix, false otherwise.
 */
export function startsWithOmittedPrefix(filename: string, omitPrefixes?: string[]): boolean {
	if (!omitPrefixes) {
		return false
	}

	return omitPrefixes.some((prefix) => filename.startsWith(prefix))
}

/**
 * Derives the command name based on the directory structure of the caller's source code file,
 * enabling dynamic generation of a command name that reflects the command files' hierarchical organization.
 * 
 * @param {string} callerUrl - The URL of the caller file, typically obtained from `import.meta.url`.
 * @returns {string} The derived command name, with directory names concatenated using spaces.
 * If the file is located at or above the 'commands' directory in the path, an empty string is returned.
 */
export const getCommandName = (callerUrl: string): string => {
	const commandNameParts = []
	const currentFileDir = dirname(fileURLToPath(callerUrl))
	const baseDir = `${sep}commands${sep}`
	const startIndex = currentFileDir.indexOf(baseDir)

	if (startIndex !== -1) {
		const relevantPath = currentFileDir.slice(Math.max(0, startIndex + baseDir.length))
		const pathSegments = relevantPath.split(sep)

		for (const segment of pathSegments) {
			if (segment !== '..' && segment !== '.') {
				commandNameParts.unshift(segment)
			}
		}
	}

	return commandNameParts.reverse().join(' ')
}
