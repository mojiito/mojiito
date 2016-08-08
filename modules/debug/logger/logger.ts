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
export enum LogLevel {
    /**
     * Logs all levels
     */
    info,
    /**
     * Logs debug, error and critical levels
     */
    debug,
    /**
     * Only logs error and critical levels
     */
    error,
    /**
     * Only logs critical levels
     */
    critical,
    /**
     * Logs nothing
     */
    none
}

/**
 * Specifies the type of the log message (equal to the console log functions)
 * 
 * @export
 * @enum {number}
 */
export enum LogType {
    /**
     * Like console.log
     */
    log,
    /**
     * Like console.info
     */
    info,
    /**
     * Like console.debug
     */
    debug,
    /**
     * Like console.warn
     */
    warn,
    /**
     * Like console.error
     */
    error
}

/**
 * Handles logging, checks if log levels match, allowes global loggin
 * or creating a logger instance for specific case.
 * 
 * @export
 * @class Logger
 */
export class Logger {

    static globalLevel = LogLevel.debug;  
    static globalLoggerInstance: Logger;

    private privatelevel = LogLevel.debug;

    /**
     * Creates an instance of Logger with a specific private {@link LogLevel}.
     * 
     * @param {LogLevel} level Specified LogLevel
     */
    constructor(level: LogLevel) {
        this.privatelevel = level;
    }

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
    log(level: LogLevel, message: any, type?: LogType): void {
        if (level < this.privatelevel || this.privatelevel === LogLevel.none) {
            return;
        }
        let method = '';
        switch (type) {
            case LogType.log:
                method = 'log';
                break;
            case LogType.info:
                method = 'info';
                break;
            case LogType.warn:
                method = 'warn';
                break;
            case LogType.error:
                method = 'error';
                break;
            default:
                method = 'log';
        }
        if (!!console && typeof (<any>console)[method] === 'function') {
            (<any>console)[method](typeof message === 'function' ? message() : message)
        }
    }

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
    static log(level: LogLevel, message: any, type?: LogType): void {
        if (!Logger.globalLoggerInstance) {
            Logger.globalLoggerInstance = new Logger(Logger.globalLevel);
        }
        Logger.globalLoggerInstance.log.apply(Logger.globalLoggerInstance, arguments);
    }

    /**
     * Sets the global {@link LogLevel}
     * 
     * @static
     * @param {LogLevel} level The {@link LogLevel} which will be set.
     */
    static setGlobalLevel(level: LogLevel) {
        Logger.globalLoggerInstance.privatelevel = level;
    }
}