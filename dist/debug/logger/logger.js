"use strict";
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
(function (LogLevel) {
    /**
     * Logs all levels
     */
    LogLevel[LogLevel["info"] = 0] = "info";
    /**
     * Logs debug, error and critical levels
     */
    LogLevel[LogLevel["debug"] = 1] = "debug";
    /**
     * Only logs error and critical levels
     */
    LogLevel[LogLevel["error"] = 2] = "error";
    /**
     * Only logs critical levels
     */
    LogLevel[LogLevel["critical"] = 3] = "critical";
    /**
     * Logs nothing
     */
    LogLevel[LogLevel["none"] = 4] = "none";
})(exports.LogLevel || (exports.LogLevel = {}));
var LogLevel = exports.LogLevel;
/**
 * Specifies the type of the log message (equal to the console log functions)
 *
 * @export
 * @enum {number}
 */
(function (LogType) {
    /**
     * Like console.log
     */
    LogType[LogType["log"] = 0] = "log";
    /**
     * Like console.info
     */
    LogType[LogType["info"] = 1] = "info";
    /**
     * Like console.debug
     */
    LogType[LogType["debug"] = 2] = "debug";
    /**
     * Like console.warn
     */
    LogType[LogType["warn"] = 3] = "warn";
    /**
     * Like console.error
     */
    LogType[LogType["error"] = 4] = "error";
})(exports.LogType || (exports.LogType = {}));
var LogType = exports.LogType;
/**
 * Handles logging, checks if log levels match, allowes global loggin
 * or creating a logger instance for specific case.
 *
 * @export
 * @class Logger
 */
var Logger = (function () {
    /**
     * Creates an instance of Logger with a specific private {@link LogLevel}.
     *
     * @param {LogLevel} level Specified LogLevel
     */
    function Logger(level) {
        this.privatelevel = LogLevel.debug;
        this.privatelevel = level;
    }
    Logger.prototype.log = function (level, message, type) {
        if (level < this.privatelevel || this.privatelevel === LogLevel.none) {
            return;
        }
        var method = '';
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
        if (!!console && typeof console[method] === 'function') {
            console[method](typeof message === 'function' ? message() : message);
        }
    };
    Logger.log = function (level, message, type) {
        if (!Logger.globalLoggerInstance) {
            Logger.globalLoggerInstance = new Logger(Logger.globalLevel);
        }
        Logger.globalLoggerInstance.log.apply(Logger.globalLoggerInstance, arguments);
    };
    /**
     * Sets the global {@link LogLevel}
     *
     * @static
     * @param {LogLevel} level The {@link LogLevel} which will be set.
     */
    Logger.setGlobalLevel = function (level) {
        Logger.globalLoggerInstance.privatelevel = level;
    };
    Logger.globalLevel = LogLevel.debug;
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map