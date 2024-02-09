 
// eslint-disable-next-line no-restricted-imports
import colors from 'colors'
import {homedir} from 'node:os'
import {Logger, createLogger, format, transports} from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import {formatColorFunctions, formatRemoveAsciiColors, formatRemoveLeadingNewline, formatTime} from './formats.js'
import {ExtendedLogger, LogLevel} from './interfaces.js'

export const {blue, gray, green, red, yellow} = colors

const logDir = `${homedir()}/.file-foundry-cli/logs/`

export let logger: ExtendedLogger

const levels = {
    [LogLevel.debug]: 4,
    [LogLevel.error]: 1,
    [LogLevel.important]: 0,
    [LogLevel.info]: 3,
    [LogLevel.warn]: 2,
}

export function initializeLogger(
    level: LogLevel = LogLevel.info,
    runId: string,
): Logger {
    if (level === LogLevel.superDebug) {
        level = LogLevel.debug
    }

    // Let's only create a logger once.
	if (!logger) {
		logger = createLogger({
            level: LogLevel.debug,
            levels,
			transports: [
				new transports.Console({
					format: format.combine(
                        formatColorFunctions,
                        format.printf(({ message }) => message),
                    ),
					level,
				}),
				new DailyRotateFile({
                    datePattern: 'YYYY-MM-DD',
					filename: `${logDir}/%DATE%.log`,
					format: format.combine(
                        // Order matters
                        formatRemoveAsciiColors,
                        formatRemoveLeadingNewline,
                        formatTime,
                        format.printf(({ level, message, timestamp }) => `[${timestamp}] [${runId}] [${level.toUpperCase()}] ${message}`)
                    ),
					maxFiles: '30d', // 30 days of files will be retained
					maxSize: '20m', // 20 megabytes
					zippedArchive: true,
				}),
			],
		}) as ExtendedLogger
	}

    logger.info('Winston Logger Instantiated', {color: blue})
    logger.important(`Log Level: ${level.toUpperCase()}`, {color: blue})
    logger.important(`Run ID: ${runId}`, {color: blue})
    logger.important(`Log Directory: ${logDir}`, {color: blue})
    logger.important()
    logger.important('–'.repeat(92), {color: blue})
    logger.important()
	return logger
}
