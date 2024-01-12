import {readdirSync, statSync} from 'node:fs'
import {basename, dirname, join} from 'node:path'

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

/**
 * Returns the filename without its extension(s).
 * 
 * @param filePath The full path of the file.
 * @returns The filename without extension(s).
 */
export function getFilenameWithoutExt(filePath: string): string {
	const base = basename(filePath)
	const firstDotIndex = base.indexOf('.')
	return firstDotIndex === -1 ? base : base.substring(0, firstDotIndex)
}

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
