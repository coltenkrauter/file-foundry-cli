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
 * Determines the plural form of a word based on the provided index.
 *
 * @param index - The count or index used to determine if the plural form ('s') is needed.
 * @returns An empty string if the index equals 1, otherwise returns 's'.
 */
export function plural(index: number): string {
  return index === 1 ? '' : 's'
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