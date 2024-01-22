// eslint-disable-next-line no-restricted-imports
import colors from 'colors'
import {homedir} from 'node:os'
import {Logger, createLogger, format, transports} from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import {LogLevel} from './interfaces.js'

const logDir = `${homedir()}/.file-foundry-cli/logs/`

let logger: Logger

const levels = {
    [LogLevel.debug]: 3,
    [LogLevel.error]: 0,
    [LogLevel.info]: 2,
    [LogLevel.warn]: 1,
};

const formatIsoDate = format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }) // ISO 8601
const formatRemoveLeadingNewline = format((info) => ({
    ...info,
    // Remove leading newline
    message: info?.message?.startsWith('\n') ? info.message.slice(2) : info?.message,
}))()

const formatRemoveAsciiColors = format((info) => ({
    ...info,
    // Remove ascii colors
    // eslint-disable-next-line unicorn/no-hex-escape, no-control-regex
    message: info?.message?.replace(/\x1B\[\d+m/g, ''),
}))()

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
					format: format.printf(({ message }) => message),
					level,
				}),
				new DailyRotateFile({
                    datePattern: 'YYYY-MM',
					filename: `${logDir}/%DATE%.log`,
					format: format.combine(
                        // Order matters
                        formatRemoveAsciiColors,
                        formatRemoveLeadingNewline,
                        formatIsoDate,
                        format.printf(({ level, message, timestamp }) => `[${timestamp}] [${runId}] [${level.toUpperCase()}] [${message}]`)
                    ),
					maxFiles: '30d', // 30 days of files will be retained
					maxSize: '20m', // 20 megabytes
					zippedArchive: true,
				}),
			],
		})
	}

    console.log(colors.yellow.bold('Winston Logger Instantiated'))
    console.log(colors.yellow.bold(`Log Level: ${level.toUpperCase()}`))
    console.log(colors.yellow.bold(`Run ID: ${runId}`))
    console.log(colors.yellow.bold(`Log Directory: ${logDir}`))
	return logger
}
