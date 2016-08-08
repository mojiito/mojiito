/**
 * Specifies the different log levels for the logger.
 * From low to high level, these are:
 * - info
 * - debug
 * - error
 * - critical
 * - none
 *
 * @export
 * @enum {number}
 */
export declare enum LogLevel {
    /**
     * Logs all levels
     */
    info = 0,
    /**
     * Logs debug, error and critical levels
     */
    debug = 1,
    /**
     * Only logs error and critical levels
     */
    error = 2,
    /**
     * Only logs critical levels
     */
    critical = 3,
    /**
     * Logs nothing
     */
    none = 4,
}
/**
 * Specifies the type of the log message (equal to the console log functions)
 *
 * @export
 * @enum {number}
 */
export declare enum LogType {
    /**
     * Like console.log
     */
    log = 0,
    /**
     * Like console.info
     */
    info = 1,
    /**
     * Like console.debug
     */
    debug = 2,
    /**
     * Like console.warn
     */
    warn = 3,
    /**
     * Like console.error
     */
    error = 4,
}
/**
 * Handles logging, checks if log levels match, allowes global loggin
 * or creating a logger instance for specific case.
 *
 * @export
 * @class Logger
 */
export declare class Logger {
    static globalLevel: LogLevel;
    static globalLoggerInstance: Logger;
    private privatelevel;
    /**
     * Creates an instance of Logger with a specific private {@link LogLevel}.
     *
     * @param {LogLevel} level Specified LogLevel
     */
    constructor(level: LogLevel);
    /**
     * Logs a message string to the console,
     * taking care of private log levels and log types.
     *
     * @param {LogLevel} level The {@link LogLevel} of the message
     * @param {string} message The message as a string
     * @param {LogType} [type] The {@link LogType} of  the message
     */
    log(level: LogLevel, message: string, type?: LogType): void;
    /**
     * Logs a string returned by a message function to the console,
     * taking care of private log levels and log types.
     *
     * @param {LogLevel} level The {@link LogLevel} of the message
     * @param {() => string} message The message as a function which has to return a string
     * @param {LogType} [type] The {@link LogType} of  the message
     */
    log(level: LogLevel, message: () => string, type?: LogType): void;
    /**
     * Global log function.
     * Logs a message string to the console,
     * taking care of global log levels and log types.
     *
     * @static
     * @param {LogLevel} level The {@link LogLevel} of the message
     * @param {string} message The message as a string
     * @param {LogType} [type] The {@link LogType} of  the message
     */
    static log(level: LogLevel, message: string, type?: LogType): void;
    /**
     * Global log function.
     * Logs a string returned by a message function to the console,
     * taking care of global log levels and log types.
     *
     * @static
     * @param {LogLevel} level The {@link LogLevel} of the message
     * @param {() => string} message The message as a function which has to return a string
     * @param {LogType} [type] The {@link LogType} of  the message
     */
    static log(level: LogLevel, message: () => string, type?: LogType): void;
    /**
     * Sets the global {@link LogLevel}
     *
     * @static
     * @param {LogLevel} level The {@link LogLevel} which will be set.
     */
    static setGlobalLevel(level: LogLevel): void;
}
