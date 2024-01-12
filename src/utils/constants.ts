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

export const movieExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.mpeg']
