/**
 * Different levels of logging.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export enum LogLevel {
    WARNING = 4,
    ERROR = 5,
    SUCCESS = 2,
    DEBUG = 1,
    INFO = 3,
}

// tslint:disable-next-line:no-namespace
export namespace LogLevel {

    /**
     * Formats the LogLevel to a string.
     *
     * @param logLevel Loglevel to be formated.
     */
    export function toString(logLevel: LogLevel): string {
        switch (logLevel) {
            case LogLevel.DEBUG: {
                return "Debug";
            }
            case LogLevel.ERROR: {
                return "Error";
            }
            case LogLevel.WARNING: {
                return "Warning";
            }
            case LogLevel.INFO: {
                return "Info";
            }
            case LogLevel.SUCCESS: {
                return "Success";
            }
        }
        return "Unknown";
    }
}