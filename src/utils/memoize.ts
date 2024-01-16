/**
 * Memoization is best used for functions with expensive computations or
 * frequent calls with the same inputs.
 */

import _memoize from 'memoize-one'

export const memoize = _memoize as unknown as typeof _memoize.default
