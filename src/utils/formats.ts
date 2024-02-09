import {format} from 'winston'

import {isObject} from './index.js'

export const formatIsoDate = format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }) // ISO 8601
export const formatTime = format.timestamp({ format: 'HH:mm:ss.SSSZ' }) // ISO 8601
export const formatRemoveLeadingNewline = format((info) => ({
    ...info,
    // Remove leading newline
    message: String(info?.message)?.startsWith('\n') ? info.message.slice(1) : info?.message,
}))()

export const formatRemoveAsciiColors = format((info) => ({
    ...info,
    // Remove ascii colors
    // eslint-disable-next-line unicorn/no-hex-escape, no-control-regex
    message: String(info?.message).replaceAll(/\x1B\[\d+m/g, ''),
}))()

// Create a custom log format function
export const formatColorFunctions = format((info) => {
    if (info.color && typeof info.color === 'function') {
        info.message = info.color(info.message)
    }

    return info
})()
