/**
 * Enum for console symbols to visually differentiate log message types.
 */
export enum Symbol {
	Success = '✔',
	Failure = '✘',
	Warning = '⚠',
	Info = 'ℹ',
}

/**
 * Enum for common log messages used across the application.
 */
export enum LogMessages {
	WarmUp = 'System is warming up...',
	SomethingWentWrong = 'Something went wrong. Please try again later.',
	OperationSuccessful = 'Operation completed successfully.',
	InvalidInput = 'Invalid input provided.',
	ConnectionError = 'Failed to connect to the server.',
	DataRetrieved = 'Data retrieved successfully.',
	ReportSummary = 'Report Summary',
}

/**
 * Common video file extensions.
 * @enum {string}
 */
export const videoExtensions = [
	'.3gp',
	'.avi',
	'.divx',
	'.flv',
	'.m4v',
	'.mkv',
	'.mov',
	'.mp4',
	'.mpeg',
	'.ogv',
	'.ts',
	'.vob',
	'.webm',
	'.wmv',
];

/**
 * Plex movie modifier types for local inline extras.
 * These modifiers are used to categorize different types of extras.
 * @enum {string}
 */
export const plexExtrasSuffixes: string[] = [
	'-behindthescenes',
	'-deleted',
	'-featurette',
	'-interview',
	'-scene',
	'-short',
	'-trailer',
	'-other',
];
