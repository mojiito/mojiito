var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
System.register("debug/assert/assert", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Writes an error message to the console if the assertion is false.
     * If the assertion is true, nothing happens.
     *
     * @param  {boolean} assertion
     * @param  {string} message
     * @returns void
     */
    function assert(assertion, message, ErrorType) {
        var CustomError = ErrorType ? ErrorType : Error;
        if (!assertion) {
            throw new CustomError('Assertion failed: ' + message);
        }
    }
    exports_1("assert", assert);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("debug/logger/logger", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var LogLevel, LogType, Logger;
    return {
        setters:[],
        execute: function() {
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
            })(LogLevel || (LogLevel = {}));
            exports_2("LogLevel", LogLevel);
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
            })(LogType || (LogType = {}));
            exports_2("LogType", LogType);
            /**
             * Handles logging, checks if log levels match, allowes global loggin
             * or creating a logger instance for specific case.
             *
             * @export
             * @class Logger
             */
            Logger = (function () {
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
            exports_2("Logger", Logger);
        }
    }
});
System.register("debug/debug", ["debug/assert/assert", "debug/logger/logger"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters:[
            function (assert_1_1) {
                exports_3({
                    "assert": assert_1_1["assert"]
                });
            },
            function (logger_1_1) {
                exports_3({
                    "Logger": logger_1_1["Logger"],
                    "LogLevel": logger_1_1["LogLevel"],
                    "LogType": logger_1_1["LogType"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("utils/class/class", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function getClassName(klass) {
        return klass.name ? klass.name : /^function\s+([\w\$]+)\s*\(/.exec(this.toString())[1];
    }
    exports_4("getClassName", getClassName);
    function isClassInstance(instance) {
        return typeof instance === 'object' && !!instance['constructor'];
    }
    exports_4("isClassInstance", isClassInstance);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("utils/lang/lang", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var _symbolIterator;
    /**
     * Check if value is an array (not object)
     *
     * @function isArray
     * @param  {any} value
     * @returns boolean
     */
    function isArray(value) {
        return Array.isArray ? Array.isArray(value) : Object.prototype.toString.call(value) === '[object Array]';
    }
    exports_5("isArray", isArray);
    /**
     * Check if value is an object (not array)
     *
     * @function isObject
     * @param  {any} value
     * @returns boolean
     */
    function isObject(value) {
        return !isArray(value) && !isNull(value) && typeof value === 'object';
    }
    exports_5("isObject", isObject);
    /**
     * Check if value is a boolean
     *
     * @function isBoolean
     * @param  {any} value
     * @returns boolean
     */
    function isBoolean(value) {
        return typeof value === 'boolean';
    }
    exports_5("isBoolean", isBoolean);
    /**
     * Check if value is a number (int or float)
     *
     * @function isNumber
     * @param  {any} value
     * @returns boolean
     */
    function isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }
    exports_5("isNumber", isNumber);
    /**
     * Check if value is a float
     *
     * isFloat(0)       // false
     * isFloat(1)       // false
     * isFloat(1.1)     // true
     * isInt(-1)        // false
     * isInt(-1.1)      // true
     *
     * @function isFloat
     * @param  {any} value
     * @returns boolean
     */
    function isFloat(value) {
        return isNumber(value) && value % 1 !== 0;
    }
    exports_5("isFloat", isFloat);
    /**
     * Check if value is a integer
     *
     * isInt(0)         // true
     * isInt(1)         // true
     * isInt(1.1)       // false
     * isInt(-1)        // true
     * isInt(-1.1)      // false
     *
     * @function isInt
     * @param  {any} value
     * @returns boolean
     */
    function isInt(value) {
        return isNumber(value) && value % 1 === 0;
    }
    exports_5("isInt", isInt);
    /**
     * Check if value is a string
     *
     * @function isString
     * @param  {any} value
     * @returns boolean
     */
    function isString(value) {
        return typeof value === 'string';
    }
    exports_5("isString", isString);
    /**
     * Check if value is a function
     *
     * @function isFunction
     * @param  {any} value
     * @returns boolean
     */
    function isFunction(value) {
        return typeof value === 'function';
    }
    exports_5("isFunction", isFunction);
    /**
     * Check if value is a symbol
     *
     * @function isSymbol
     * @param  {any} value
     * @returns boolean
     */
    function isSymbol(value) {
        return typeof value === 'symbol';
    }
    exports_5("isSymbol", isSymbol);
    /**
     * Check if value is defined
     *
     * @function isDefined
     * @param  {any} value
     * @returns boolean
     */
    function isDefined(value) {
        return typeof value !== 'undefined';
    }
    exports_5("isDefined", isDefined);
    /**
     * Check if value is `null`
     *
     * @function isNull
     * @param  {any} value
     * @returns boolean
     */
    function isNull(value) {
        return value === null;
    }
    exports_5("isNull", isNull);
    /**
     * Verifies that a value is `undefined`, `null`
     * or an empty string, empty array, or an empty object
     *
     * isEmpty();                // true
     * isEmpty(null);            // true
     * isEmpty(undefined);       // true
     * isEmpty('');              // true
     * isEmpty([]);              // true
     * isEmpty({});              // false
     * isEmpty('Adam Hawkins');  // false
     * isEmpty([0,1,2]);         // false
     *
     * @function isEmpty
     * @param  {any} value
     * @returns boolean
     */
    function isEmpty(value) {
        if (isArray(value) || isString(value)) {
            return !value.length;
        }
        else if (isNull(value) || !isDefined(value)) {
            return true;
        }
        return false;
    }
    exports_5("isEmpty", isEmpty);
    function isPresent(value) {
        return value !== undefined && value !== null;
    }
    exports_5("isPresent", isPresent);
    function isBlank(value) {
        return value === undefined || value === null;
    }
    exports_5("isBlank", isBlank);
    function getMapKey(value) {
        return value;
    }
    exports_5("getMapKey", getMapKey);
    function looseIdentical(a, b) {
        return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
    }
    exports_5("looseIdentical", looseIdentical);
    function getSymbolIterator() {
        if (isBlank(_symbolIterator)) {
            if (isPresent(window.Symbol) && isPresent(Symbol.iterator)) {
                _symbolIterator = Symbol.iterator;
            }
            else {
                // es6-shim specific logic
                var keys = Object.getOwnPropertyNames(Map.prototype);
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (key !== 'entries' && key !== 'size' &&
                        Map.prototype[key] === Map.prototype['entries']) {
                        _symbolIterator = key;
                    }
                }
            }
        }
        return _symbolIterator;
    }
    exports_5("getSymbolIterator", getSymbolIterator);
    /**
     * Check if value is a primitive
     *
     * isPrimitive(null)          // true
     * isPrimitive(undefined)     // true
     * isPrimitive('string')      // true
     * isPrimitive(1)             // true
     * isPrimitive(1.1)           // true
     * isPrimitive(true)          // true
     * isPrimitive([0,1,2])       // false
     * isPrimitive({})            // false
     * isPrimitive(function(){})  // false
     *
     * @function isPrimitive
     * @param  {any} value
     * @returns boolean
     */
    function isPrimitive(value) {
        // we use typeof value === 'number' because of NaN
        return isString(value) || isSymbol(value) || isBoolean(value) || !isDefined(value) || isNull(value) || typeof value === 'number';
    }
    exports_5("isPrimitive", isPrimitive);
    /**
     * Typeof proxy function for real array detection
     *
     * @function typeOf
     * @param  {any} value
     * @returns string
     */
    function typeOf(value) {
        if (isArray(value)) {
            return 'array';
        }
        if (isNull(value)) {
            return 'null';
        }
        return typeof value;
    }
    exports_5("typeOf", typeOf);
    return {
        setters:[],
        execute: function() {
            _symbolIterator = null;
        }
    }
});
System.register("utils/dom/dom", [], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    /**
     * Converts the array-like NodeList (NodeListOf) to a real array
     *
     * @export
     * @template T
     * @param {NodeListOf<T>} nodeList
     * @returns {Array<T>} Converted Array
     */
    function convertNodeListToArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }
    exports_6("convertNodeListToArray", convertNodeListToArray);
    /**
     * Checks if a selector matches an element.
     *
     * @export
     * @param {string} selector
     * @param {Element} element
     * @returns Returns true if selector matches, false if not
     */
    function doesSelectorMatchElement(selector, element) {
        var results = convertNodeListToArray(element.parentElement.querySelectorAll(selector));
        return results.length ? results.indexOf(element) !== -1 : false;
    }
    exports_6("doesSelectorMatchElement", doesSelectorMatchElement);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("utils/string/endswith", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    function endsWith(str, searchString, position) {
        var prototype = String.prototype;
        if (typeof prototype.endsWith === 'function') {
            return prototype.endsWith.call(str, searchString, position);
        }
        else {
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > str.length) {
                position = str.length;
            }
            position -= searchString.length;
            var lastIndex = str.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        }
    }
    exports_7("endsWith", endsWith);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("utils/string/kebab", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var KEBAB_REGEX;
    function toKebabCase(str) {
        var result = str.replace(KEBAB_REGEX, function (match) {
            return '-' + match.toLowerCase();
        });
        return result.indexOf('-') === 0 ? result.slice(1) : result;
    }
    exports_8("toKebabCase", toKebabCase);
    return {
        setters:[],
        execute: function() {
            KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;
            ;
        }
    }
});
System.register("utils/string/stringify", [], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    function stringify(token) {
        if (typeof token === 'string') {
            return token;
        }
        if (token === undefined || token === null) {
            return '' + token;
        }
        // if (typeof token === 'function') {
        //     return getClassName(token);
        // }
        if (token.name) {
            return token.name;
        }
        if (token.overriddenName) {
            return token.overriddenName;
        }
        var res = token.toString();
        var newLineIndex = res.indexOf('\n');
        return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
    }
    exports_9("stringify", stringify);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("utils/utils", ["utils/class/class", "utils/lang/lang", "utils/dom/dom", "utils/string/endswith", "utils/string/kebab", "utils/string/stringify"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_10(exports);
    }
    return {
        setters:[
            function (class_1_1) {
                exportStar_1(class_1_1);
            },
            function (lang_1_1) {
                exportStar_1(lang_1_1);
            },
            function (dom_1_1) {
                exportStar_1(dom_1_1);
            },
            function (endswith_1_1) {
                exportStar_1(endswith_1_1);
            },
            function (kebab_1_1) {
                exportStar_1(kebab_1_1);
            },
            function (stringify_1_1) {
                exportStar_1(stringify_1_1);
            }],
        execute: function() {
        }
    }
});
System.register("core/iterator/iterator", ["debug/debug"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var debug_1;
    var Iterator;
    return {
        setters:[
            function (debug_1_1) {
                debug_1 = debug_1_1;
            }],
        execute: function() {
            Iterator = (function () {
                function Iterator(source) {
                    this._nextIndex = 0;
                    debug_1.assert(arguments.length === 1, 'CoreIterator must be created with one argument; an iterable object');
                    debug_1.assert(typeof source.length === 'number', 'The source property has to be a iterable object', TypeError);
                    this._source = source;
                }
                Iterator.prototype.next = function () {
                    var source = this._source;
                    return this._nextIndex < source.length ? { value: source[this._nextIndex++], done: false } : { done: true };
                };
                return Iterator;
            }());
            exports_11("Iterator", Iterator);
        }
    }
});
System.register("core/map/map", ["core/iterator/iterator", "debug/debug"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var iterator_1, debug_2;
    var CoreMap, TypedMap;
    return {
        setters:[
            function (iterator_1_1) {
                iterator_1 = iterator_1_1;
            },
            function (debug_2_1) {
                debug_2 = debug_2_1;
            }],
        execute: function() {
            /**
             * Implementation of the ES6 Map.
             * The Map object is a simple key/value map.
             * Any value (both objects and primitive values) may be used as either a key or a value.
             *
             * @export
             * @class CoreMap
             * @implements {IIterable<any>}
             */
            CoreMap = (function () {
                function CoreMap(source) {
                    /**
                     * Internal Array where all thoses keys and values are stored.
                     *
                     * @private
                     * @type {Array<[any, any]}
                     */
                    this._source = [];
                    if (Array.isArray(source)) {
                        for (var i = 0, max = source.length; i < max; i++) {
                            var item = source[i];
                            if (item.length === 2) {
                                this._source.push([item[0], item[1]]);
                            }
                            else {
                                throw new TypeError('The items in the provided source array must have the following structure [key, value]');
                            }
                        }
                    }
                    else if (typeof source === 'object') {
                        for (var key in source) {
                            this._source.push([key, source[key]]);
                        }
                    }
                }
                Object.defineProperty(CoreMap.prototype, "size", {
                    /**
                     * Returns the number of key/value pairs in the Map object.
                     *
                     * @readonly
                     * @type {number}
                     */
                    get: function () {
                        return this._source.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CoreMap.prototype, "length", {
                    /**
                     * The value of the length property is 0.
                     * To fulfill the ES2015 specification the Map must implement
                     * a length property even if it always returns 0:
                     * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map#Properties
                     *
                     * @readonly
                     * @type {number}
                     */
                    get: function () {
                        debug_2.Logger.log(debug_2.LogLevel.debug, "Don't use length property on CoreMaps!!", debug_2.LogType.warn);
                        return 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Removes all key/value pairs from the Map object.
                 */
                CoreMap.prototype.clear = function () {
                    this._source = [];
                };
                /**
                 * Removes any value associated to the key and returns the value that Map.has(key) would have previously returned.
                 * Map.prototype.has(key) will return false afterwards.
                 *
                 * @param {*} key The key of the element to remove from the Map object.
                 */
                CoreMap.prototype.delete = function (key) {
                    var source = this._source;
                    for (var i = 0, max = source.length >>> 0; i < max; i++) {
                        if (source[i][0] === key) {
                            source.splice(i, 1);
                            break;
                        }
                    }
                };
                /**
                 * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
                 *
                 * @returns {Iterator<[any,any]>} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
                 */
                CoreMap.prototype.entries = function () {
                    return new iterator_1.Iterator(this._source);
                };
                /**
                 * Calls callbackFn once for each key-value pair present in the Map object, in insertion order.
                 * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
                 *
                 * @param {(value: any, key: any, map: CoreMap) => void} callbackFn Function to execute for each element.
                 * @param {(Object | Function)} [thisArg] Value to use as this when executing callback.
                 */
                CoreMap.prototype.forEach = function (callbackFn, thisArg) {
                    var source = this._source;
                    for (var i = 0, max = source.length >>> 0; i < max; i++) {
                        var entry = source[i];
                        callbackFn.call(thisArg, entry[1], entry[0], this);
                    }
                };
                /**
                 * Returns the value associated to the key, or undefined if there is none.
                 *
                 * @param {*} key The key of the element to return from the Map object.
                 * @returns {*} Value associated to the key, or undefined
                 */
                CoreMap.prototype.get = function (key) {
                    var source = this._source;
                    for (var i = 0, max = source.length >>> 0; i < max; i++) {
                        if (key === source[i][0]) {
                            return source[i][1];
                        }
                    }
                    return undefined;
                };
                /**
                 * Returns a boolean asserting whether a value has been associated to the key in the Map object or not.
                 *
                 * @param {*} key The key of the element to test for presence in the Map object.
                 * @returns {boolean} Value associated to the key
                 */
                CoreMap.prototype.has = function (key) {
                    return !!this.get(key);
                };
                /**
                 * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
                 *
                 * @returns {Iterator<any>} Iterator object that contains the keys for each element in the Map object in insertion order
                 */
                CoreMap.prototype.keys = function () {
                    var keys = [];
                    this.forEach(function (value, key) {
                        keys.push(key);
                    });
                    return new iterator_1.Iterator(keys);
                };
                /**
                 * Sets the value for the key in the Map object. Returns the Map object.
                 *
                 * @param {*} key The key of the element to add to the Map object.
                 * @param {*} value The value of the element to add to the Map object.
                 * @returns {CoreMap} The Map object
                 */
                CoreMap.prototype.set = function (key, value) {
                    var source = this._source;
                    for (var i = 0, max = source.length >>> 0; i < max; i++) {
                        if (key === source[i][0]) {
                            source[i][1] = value;
                            return this;
                        }
                    }
                    source.push([key, value]);
                    return this;
                };
                /**
                 * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
                 *
                 * @returns {CoreMapIterator} Iterator object that contains the values for each element in the Map object in insertion order
                 */
                CoreMap.prototype.values = function () {
                    var keys = [];
                    this.forEach(function (value, key) {
                        keys.push(value);
                    });
                    return new iterator_1.Iterator(keys);
                };
                CoreMap.create = function (source) {
                    return new CoreMap(source);
                };
                return CoreMap;
            }());
            exports_12("CoreMap", CoreMap);
            /**
             * Implementation of the ES6 Map as a typed variant.
             * The Map object is a simple key/value map.
             * Any value (both objects and primitive values) may be used as either a key or a value.
             *
             * @export
             * @class TypedMap
             * @extends {CoreMap}
             * @template K
             * @template V
             */
            TypedMap = (function (_super) {
                __extends(TypedMap, _super);
                function TypedMap(source) {
                    _super.call(this, source);
                }
                /**
                 * Removes any value associated to the key and returns the value that Map.has(key) would have previously returned.
                 * Map.prototype.has(key) will return false afterwards.
                 *
                 * @param {K} key The key of the element to remove from the Map object.
                 */
                TypedMap.prototype.delete = function (key) {
                    _super.prototype.delete.call(this, key);
                };
                /**
                 * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
                 *
                 * @returns {Iterator<[K, V]>} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
                 */
                TypedMap.prototype.entries = function () {
                    return _super.prototype.entries.call(this);
                };
                /**
                 * Calls callbackFn once for each key-value pair present in the Map object, in insertion order.
                 * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
                 *
                 * @param {(value: any, key: any, map: TypedMap) => void} callbackFn Function to execute for each element.
                 * @param {(Object | Function)} [thisArg] Value to use as this when executing callback.
                 */
                TypedMap.prototype.forEach = function (callbackFn, thisArg) {
                    _super.prototype.forEach.apply(this, arguments);
                };
                /**
                 * Returns the value associated to the key, or undefined if there is none.
                 *
                 * @param {K} key The key of the element to return from the Map object.
                 * @returns {V} Value associated to the key, or undefined
                 */
                TypedMap.prototype.get = function (key) {
                    return _super.prototype.get.call(this, key);
                };
                /**
                 * Returns a boolean asserting whether a value has been associated to the key in the Map object or not.
                 *
                 * @param {*} key The key of the element to test for presence in the Map object.
                 * @returns {boolean} Value associated to the key
                 */
                TypedMap.prototype.has = function (key) {
                    return _super.prototype.has.call(this, key);
                };
                /**
                 * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
                 *
                 * @returns {Iterator<any>} Iterator object that contains the keys for each element in the Map object in insertion order
                 */
                TypedMap.prototype.keys = function () {
                    return _super.prototype.keys.call(this);
                };
                /**
                 * Sets the value for the key in the Map object. Returns the Map object.
                 *
                 * @param {K} key The key of the element to add to the Map object.
                 * @param {V} value The value of the element to add to the Map object.
                 * @returns {TypedMap<K,V>} The Map object
                 */
                TypedMap.prototype.set = function (key, value) {
                    return _super.prototype.set.call(this, key, value);
                };
                /**
                 * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
                 *
                 * @returns {CoreMapIterator} Iterator object that contains the values for each element in the Map object in insertion order
                 */
                TypedMap.prototype.values = function () {
                    return _super.prototype.values.call(this);
                };
                TypedMap.create = function (source) {
                    return new TypedMap(source);
                };
                return TypedMap;
            }(CoreMap));
            exports_12("TypedMap", TypedMap);
        }
    }
});
System.register("core/reflect/reflection", ["core/map/map", "debug/debug"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var map_1, debug_3;
    var ClassReflection;
    return {
        setters:[
            function (map_1_1) {
                map_1 = map_1_1;
            },
            function (debug_3_1) {
                debug_3 = debug_3_1;
            }],
        execute: function() {
            debug_3.assert(!!(Reflect && Reflect.defineMetadata), 'reflect-metadata shim is required! Please make sure it is installed.');
            ClassReflection = (function () {
                function ClassReflection() {
                    this._properties = new map_1.TypedMap();
                    this._parameters = [];
                    this._annotations = new map_1.TypedMap();
                }
                Object.defineProperty(ClassReflection.prototype, "properties", {
                    get: function () {
                        return this._properties;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ClassReflection.prototype, "parameters", {
                    get: function () {
                        return this._parameters;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ClassReflection.prototype, "annotations", {
                    get: function () {
                        return this._annotations;
                    },
                    enumerable: true,
                    configurable: true
                });
                ClassReflection.peek = function (classType) {
                    if (this.isReflected(classType)) {
                        return Reflect.getMetadata('reflection', classType);
                    }
                    var reflection = new ClassReflection();
                    Reflect.defineMetadata('reflection', reflection, classType);
                    return reflection;
                };
                ClassReflection.isReflected = function (classType) {
                    return Reflect.hasMetadata('reflection', classType);
                };
                return ClassReflection;
            }());
            exports_13("ClassReflection", ClassReflection);
        }
    }
});
System.register("core/di/metadata", ["utils/string/stringify"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var stringify_2;
    var InjectableMetadata, InjectMetadata;
    return {
        setters:[
            function (stringify_2_1) {
                stringify_2 = stringify_2_1;
            }],
        execute: function() {
            InjectableMetadata = (function () {
                function InjectableMetadata() {
                }
                InjectableMetadata.prototype.toString = function () { return "@Injectable()"; };
                return InjectableMetadata;
            }());
            exports_14("InjectableMetadata", InjectableMetadata);
            InjectMetadata = (function () {
                function InjectMetadata(token) {
                    this.token = token;
                }
                InjectMetadata.prototype.toString = function () { return "@Inject(" + stringify_2.stringify(this.token) + ")"; };
                return InjectMetadata;
            }());
            exports_14("InjectMetadata", InjectMetadata);
        }
    }
});
System.register("core/change_detection/change_detector", [], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var ChangeDetector;
    return {
        setters:[],
        execute: function() {
            ChangeDetector = (function () {
                function ChangeDetector() {
                }
                return ChangeDetector;
            }());
            exports_15("ChangeDetector", ChangeDetector);
        }
    }
});
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * Modified by Thomas Pink for the usage in Mojito
 */
System.register("core/change_detection/differs/iterable", ["utils/utils"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var utils_1;
    var IterableDifferFactory, trackByIdentity, IterableDiffer, CollectionChangeRecord, _DuplicateItemRecordList, _DuplicateMap;
    function isListLikeIterable(obj) {
        if (!utils_1.isObject(obj))
            return false;
        return utils_1.isArray(obj) || (!(obj instanceof Map) && utils_1.getSymbolIterator() in obj);
    }
    exports_16("isListLikeIterable", isListLikeIterable);
    function areIterablesEqual(a, b, comparator) {
        var iterator1 = a[utils_1.getSymbolIterator()]();
        var iterator2 = b[utils_1.getSymbolIterator()]();
        while (true) {
            var item1 = iterator1.next();
            var item2 = iterator2.next();
            if (item1.done && item2.done)
                return true;
            if (item1.done || item2.done)
                return false;
            if (!comparator(item1.value, item2.value))
                return false;
        }
    }
    exports_16("areIterablesEqual", areIterablesEqual);
    function iterateListLike(obj, fn) {
        if (utils_1.isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
                fn(obj[i]);
            }
        }
        else {
            var iterator = obj[utils_1.getSymbolIterator()]();
            var item;
            while (!((item = iterator.next()).done)) {
                fn(item.value);
            }
        }
    }
    exports_16("iterateListLike", iterateListLike);
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            IterableDifferFactory = (function () {
                function IterableDifferFactory() {
                }
                IterableDifferFactory.prototype.supports = function (obj) { return isListLikeIterable(obj); };
                IterableDifferFactory.prototype.create = function (cdRef, trackByFn) {
                    return new IterableDiffer(trackByFn);
                };
                return IterableDifferFactory;
            }());
            exports_16("IterableDifferFactory", IterableDifferFactory);
            trackByIdentity = function (index, item) { return item; };
            /**
             * @stable
             */
            IterableDiffer = (function () {
                function IterableDiffer(_trackByFn) {
                    this._trackByFn = _trackByFn;
                    this._length = null;
                    this._collection = null;
                    // Keeps track of the used records at any point in time (during & across `_check()` calls)
                    this._linkedRecords = null;
                    // Keeps track of the removed records at any point in time during `_check()` calls.
                    this._unlinkedRecords = null;
                    this._previousItHead = null;
                    this._itHead = null;
                    this._itTail = null;
                    this._additionsHead = null;
                    this._additionsTail = null;
                    this._movesHead = null;
                    this._movesTail = null;
                    this._removalsHead = null;
                    this._removalsTail = null;
                    // Keeps track of records where custom track by is the same, but item identity has changed
                    this._identityChangesHead = null;
                    this._identityChangesTail = null;
                    this._trackByFn = utils_1.isPresent(this._trackByFn) ? this._trackByFn : trackByIdentity;
                }
                Object.defineProperty(IterableDiffer.prototype, "collection", {
                    get: function () { return this._collection; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(IterableDiffer.prototype, "length", {
                    get: function () { return this._length; },
                    enumerable: true,
                    configurable: true
                });
                IterableDiffer.prototype.forEachItem = function (fn) {
                    var record;
                    for (record = this._itHead; record !== null; record = record._next) {
                        fn(record);
                    }
                };
                IterableDiffer.prototype.forEachPreviousItem = function (fn) {
                    var record;
                    for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
                        fn(record);
                    }
                };
                IterableDiffer.prototype.forEachAddedItem = function (fn) {
                    var record;
                    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                        fn(record);
                    }
                };
                IterableDiffer.prototype.forEachMovedItem = function (fn) {
                    var record;
                    for (record = this._movesHead; record !== null; record = record._nextMoved) {
                        fn(record);
                    }
                };
                IterableDiffer.prototype.forEachRemovedItem = function (fn) {
                    var record;
                    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                        fn(record);
                    }
                };
                IterableDiffer.prototype.forEachIdentityChange = function (fn) {
                    var record;
                    for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
                        fn(record);
                    }
                };
                IterableDiffer.prototype.diff = function (collection) {
                    if (utils_1.isBlank(collection))
                        collection = [];
                    if (!isListLikeIterable(collection)) {
                        throw new Error("Error trying to diff '" + collection + "'");
                    }
                    if (this.check(collection)) {
                        return this;
                    }
                    else {
                        return null;
                    }
                };
                IterableDiffer.prototype.onDestroy = function () { };
                // todo(vicb): optim for UnmodifiableListView (frozen arrays)
                IterableDiffer.prototype.check = function (collection) {
                    var _this = this;
                    this._reset();
                    var record = this._itHead;
                    var mayBeDirty = false;
                    var index;
                    var item;
                    var itemTrackBy;
                    if (utils_1.isArray(collection)) {
                        var list = collection;
                        this._length = collection.length;
                        for (index = 0; index < this._length; index++) {
                            item = list[index];
                            itemTrackBy = this._trackByFn(index, item);
                            if (record === null || !utils_1.looseIdentical(record.trackById, itemTrackBy)) {
                                record = this._mismatch(record, item, itemTrackBy, index);
                                mayBeDirty = true;
                            }
                            else {
                                if (mayBeDirty) {
                                    // TODO(misko): can we limit this to duplicates only?
                                    record = this._verifyReinsertion(record, item, itemTrackBy, index);
                                }
                                if (!utils_1.looseIdentical(record.item, item))
                                    this._addIdentityChange(record, item);
                            }
                            record = record._next;
                        }
                    }
                    else {
                        index = 0;
                        iterateListLike(collection, function (item /** TODO #9100 */) {
                            itemTrackBy = _this._trackByFn(index, item);
                            if (record === null || !utils_1.looseIdentical(record.trackById, itemTrackBy)) {
                                record = _this._mismatch(record, item, itemTrackBy, index);
                                mayBeDirty = true;
                            }
                            else {
                                if (mayBeDirty) {
                                    // TODO(misko): can we limit this to duplicates only?
                                    record = _this._verifyReinsertion(record, item, itemTrackBy, index);
                                }
                                if (!utils_1.looseIdentical(record.item, item))
                                    _this._addIdentityChange(record, item);
                            }
                            record = record._next;
                            index++;
                        });
                        this._length = index;
                    }
                    this._truncate(record);
                    this._collection = collection;
                    return this.isDirty;
                };
                Object.defineProperty(IterableDiffer.prototype, "isDirty", {
                    /* CollectionChanges is considered dirty if it has any additions, moves, removals, or identity
                     * changes.
                     */
                    get: function () {
                        return this._additionsHead !== null || this._movesHead !== null ||
                            this._removalsHead !== null || this._identityChangesHead !== null;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Reset the state of the change objects to show no changes. This means set previousKey to
                 * currentKey, and clear all of the queues (additions, moves, removals).
                 * Set the previousIndexes of moved and added items to their currentIndexes
                 * Reset the list of additions, moves and removals
                 *
                 * @internal
                 */
                IterableDiffer.prototype._reset = function () {
                    if (this.isDirty) {
                        var record;
                        var nextRecord;
                        for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
                            record._nextPrevious = record._next;
                        }
                        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                            record.previousIndex = record.currentIndex;
                        }
                        this._additionsHead = this._additionsTail = null;
                        for (record = this._movesHead; record !== null; record = nextRecord) {
                            record.previousIndex = record.currentIndex;
                            nextRecord = record._nextMoved;
                        }
                        this._movesHead = this._movesTail = null;
                        this._removalsHead = this._removalsTail = null;
                        this._identityChangesHead = this._identityChangesTail = null;
                    }
                };
                /**
                 * This is the core function which handles differences between collections.
                 *
                 * - `record` is the record which we saw at this position last time. If null then it is a new
                 *   item.
                 * - `item` is the current item in the collection
                 * - `index` is the position of the item in the collection
                 *
                 * @internal
                 */
                IterableDiffer.prototype._mismatch = function (record, item, itemTrackBy, index) {
                    // The previous record after which we will append the current one.
                    var previousRecord;
                    if (record === null) {
                        previousRecord = this._itTail;
                    }
                    else {
                        previousRecord = record._prev;
                        // Remove the record from the collection since we know it does not match the item.
                        this._remove(record);
                    }
                    // Attempt to see if we have seen the item before.
                    record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
                    if (record !== null) {
                        // We have seen this before, we need to move it forward in the collection.
                        // But first we need to check if identity changed, so we can update in view if necessary
                        if (!utils_1.looseIdentical(record.item, item))
                            this._addIdentityChange(record, item);
                        this._moveAfter(record, previousRecord, index);
                    }
                    else {
                        // Never seen it, check evicted list.
                        record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
                        if (record !== null) {
                            // It is an item which we have evicted earlier: reinsert it back into the list.
                            // But first we need to check if identity changed, so we can update in view if necessary
                            if (!utils_1.looseIdentical(record.item, item))
                                this._addIdentityChange(record, item);
                            this._reinsertAfter(record, previousRecord, index);
                        }
                        else {
                            // It is a new item: add it.
                            record =
                                this._addAfter(new CollectionChangeRecord(item, itemTrackBy), previousRecord, index);
                        }
                    }
                    return record;
                };
                /**
                 * This check is only needed if an array contains duplicates. (Short circuit of nothing dirty)
                 *
                 * Use case: `[a, a]` => `[b, a, a]`
                 *
                 * If we did not have this check then the insertion of `b` would:
                 *   1) evict first `a`
                 *   2) insert `b` at `0` index.
                 *   3) leave `a` at index `1` as is. <-- this is wrong!
                 *   3) reinsert `a` at index 2. <-- this is wrong!
                 *
                 * The correct behavior is:
                 *   1) evict first `a`
                 *   2) insert `b` at `0` index.
                 *   3) reinsert `a` at index 1.
                 *   3) move `a` at from `1` to `2`.
                 *
                 *
                 * Double check that we have not evicted a duplicate item. We need to check if the item type may
                 * have already been removed:
                 * The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
                 * at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
                 * better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
                 * at the end.
                 *
                 * @internal
                 */
                IterableDiffer.prototype._verifyReinsertion = function (record, item, itemTrackBy, index) {
                    var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
                    if (reinsertRecord !== null) {
                        record = this._reinsertAfter(reinsertRecord, record._prev, index);
                    }
                    else if (record.currentIndex != index) {
                        record.currentIndex = index;
                        this._addToMoves(record, index);
                    }
                    return record;
                };
                /**
                 * Get rid of any excess {@link CollectionChangeRecord}s from the previous collection
                 *
                 * - `record` The first excess {@link CollectionChangeRecord}.
                 *
                 * @internal
                 */
                IterableDiffer.prototype._truncate = function (record) {
                    // Anything after that needs to be removed;
                    while (record !== null) {
                        var nextRecord = record._next;
                        this._addToRemovals(this._unlink(record));
                        record = nextRecord;
                    }
                    if (this._unlinkedRecords !== null) {
                        this._unlinkedRecords.clear();
                    }
                    if (this._additionsTail !== null) {
                        this._additionsTail._nextAdded = null;
                    }
                    if (this._movesTail !== null) {
                        this._movesTail._nextMoved = null;
                    }
                    if (this._itTail !== null) {
                        this._itTail._next = null;
                    }
                    if (this._removalsTail !== null) {
                        this._removalsTail._nextRemoved = null;
                    }
                    if (this._identityChangesTail !== null) {
                        this._identityChangesTail._nextIdentityChange = null;
                    }
                };
                /** @internal */
                IterableDiffer.prototype._reinsertAfter = function (record, prevRecord, index) {
                    if (this._unlinkedRecords !== null) {
                        this._unlinkedRecords.remove(record);
                    }
                    var prev = record._prevRemoved;
                    var next = record._nextRemoved;
                    if (prev === null) {
                        this._removalsHead = next;
                    }
                    else {
                        prev._nextRemoved = next;
                    }
                    if (next === null) {
                        this._removalsTail = prev;
                    }
                    else {
                        next._prevRemoved = prev;
                    }
                    this._insertAfter(record, prevRecord, index);
                    this._addToMoves(record, index);
                    return record;
                };
                /** @internal */
                IterableDiffer.prototype._moveAfter = function (record, prevRecord, index) {
                    this._unlink(record);
                    this._insertAfter(record, prevRecord, index);
                    this._addToMoves(record, index);
                    return record;
                };
                /** @internal */
                IterableDiffer.prototype._addAfter = function (record, prevRecord, index) {
                    this._insertAfter(record, prevRecord, index);
                    if (this._additionsTail === null) {
                        // todo(vicb)
                        // assert(this._additionsHead === null);
                        this._additionsTail = this._additionsHead = record;
                    }
                    else {
                        // todo(vicb)
                        // assert(_additionsTail._nextAdded === null);
                        // assert(record._nextAdded === null);
                        this._additionsTail = this._additionsTail._nextAdded = record;
                    }
                    return record;
                };
                /** @internal */
                IterableDiffer.prototype._insertAfter = function (record, prevRecord, index) {
                    // todo(vicb)
                    // assert(record != prevRecord);
                    // assert(record._next === null);
                    // assert(record._prev === null);
                    var next = prevRecord === null ? this._itHead : prevRecord._next;
                    // todo(vicb)
                    // assert(next != record);
                    // assert(prevRecord != record);
                    record._next = next;
                    record._prev = prevRecord;
                    if (next === null) {
                        this._itTail = record;
                    }
                    else {
                        next._prev = record;
                    }
                    if (prevRecord === null) {
                        this._itHead = record;
                    }
                    else {
                        prevRecord._next = record;
                    }
                    if (this._linkedRecords === null) {
                        this._linkedRecords = new _DuplicateMap();
                    }
                    this._linkedRecords.put(record);
                    record.currentIndex = index;
                    return record;
                };
                /** @internal */
                IterableDiffer.prototype._remove = function (record) {
                    return this._addToRemovals(this._unlink(record));
                };
                /** @internal */
                IterableDiffer.prototype._unlink = function (record) {
                    if (this._linkedRecords !== null) {
                        this._linkedRecords.remove(record);
                    }
                    var prev = record._prev;
                    var next = record._next;
                    // todo(vicb)
                    // assert((record._prev = null) === null);
                    // assert((record._next = null) === null);
                    if (prev === null) {
                        this._itHead = next;
                    }
                    else {
                        prev._next = next;
                    }
                    if (next === null) {
                        this._itTail = prev;
                    }
                    else {
                        next._prev = prev;
                    }
                    return record;
                };
                /** @internal */
                IterableDiffer.prototype._addToMoves = function (record, toIndex) {
                    // todo(vicb)
                    // assert(record._nextMoved === null);
                    if (record.previousIndex === toIndex) {
                        return record;
                    }
                    if (this._movesTail === null) {
                        // todo(vicb)
                        // assert(_movesHead === null);
                        this._movesTail = this._movesHead = record;
                    }
                    else {
                        // todo(vicb)
                        // assert(_movesTail._nextMoved === null);
                        this._movesTail = this._movesTail._nextMoved = record;
                    }
                    return record;
                };
                /** @internal */
                IterableDiffer.prototype._addToRemovals = function (record) {
                    if (this._unlinkedRecords === null) {
                        this._unlinkedRecords = new _DuplicateMap();
                    }
                    this._unlinkedRecords.put(record);
                    record.currentIndex = null;
                    record._nextRemoved = null;
                    if (this._removalsTail === null) {
                        // todo(vicb)
                        // assert(_removalsHead === null);
                        this._removalsTail = this._removalsHead = record;
                        record._prevRemoved = null;
                    }
                    else {
                        // todo(vicb)
                        // assert(_removalsTail._nextRemoved === null);
                        // assert(record._nextRemoved === null);
                        record._prevRemoved = this._removalsTail;
                        this._removalsTail = this._removalsTail._nextRemoved = record;
                    }
                    return record;
                };
                /** @internal */
                IterableDiffer.prototype._addIdentityChange = function (record, item) {
                    record.item = item;
                    if (this._identityChangesTail === null) {
                        this._identityChangesTail = this._identityChangesHead = record;
                    }
                    else {
                        this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
                    }
                    return record;
                };
                IterableDiffer.prototype.toString = function () {
                    var list = [];
                    this.forEachItem(function (record /** TODO #9100 */) { return list.push(record); });
                    var previous = [];
                    this.forEachPreviousItem(function (record /** TODO #9100 */) { return previous.push(record); });
                    var additions = [];
                    this.forEachAddedItem(function (record /** TODO #9100 */) { return additions.push(record); });
                    var moves = [];
                    this.forEachMovedItem(function (record /** TODO #9100 */) { return moves.push(record); });
                    var removals = [];
                    this.forEachRemovedItem(function (record /** TODO #9100 */) { return removals.push(record); });
                    var identityChanges = [];
                    this.forEachIdentityChange(function (record /** TODO #9100 */) { return identityChanges.push(record); });
                    return 'collection: ' + list.join(', ') + '\n' +
                        'previous: ' + previous.join(', ') + '\n' +
                        'additions: ' + additions.join(', ') + '\n' +
                        'moves: ' + moves.join(', ') + '\n' +
                        'removals: ' + removals.join(', ') + '\n' +
                        'identityChanges: ' + identityChanges.join(', ') + '\n';
                };
                return IterableDiffer;
            }());
            exports_16("IterableDiffer", IterableDiffer);
            /**
             * @stable
             */
            CollectionChangeRecord = (function () {
                function CollectionChangeRecord(item, trackById) {
                    this.item = item;
                    this.trackById = trackById;
                    this.currentIndex = null;
                    this.previousIndex = null;
                    /** @internal */
                    this._nextPrevious = null;
                    /** @internal */
                    this._prev = null;
                    /** @internal */
                    this._next = null;
                    /** @internal */
                    this._prevDup = null;
                    /** @internal */
                    this._nextDup = null;
                    /** @internal */
                    this._prevRemoved = null;
                    /** @internal */
                    this._nextRemoved = null;
                    /** @internal */
                    this._nextAdded = null;
                    /** @internal */
                    this._nextMoved = null;
                    /** @internal */
                    this._nextIdentityChange = null;
                }
                CollectionChangeRecord.prototype.toString = function () {
                    return this.previousIndex === this.currentIndex ? utils_1.stringify(this.item) :
                        utils_1.stringify(this.item) + '[' +
                            utils_1.stringify(this.previousIndex) + '->' + utils_1.stringify(this.currentIndex) + ']';
                };
                return CollectionChangeRecord;
            }());
            exports_16("CollectionChangeRecord", CollectionChangeRecord);
            // A linked list of CollectionChangeRecords with the same CollectionChangeRecord.item
            _DuplicateItemRecordList = (function () {
                function _DuplicateItemRecordList() {
                    /** @internal */
                    this._head = null;
                    /** @internal */
                    this._tail = null;
                }
                /**
                 * Append the record to the list of duplicates.
                 *
                 * Note: by design all records in the list of duplicates hold the same value in record.item.
                 */
                _DuplicateItemRecordList.prototype.add = function (record) {
                    if (this._head === null) {
                        this._head = this._tail = record;
                        record._nextDup = null;
                        record._prevDup = null;
                    }
                    else {
                        // todo(vicb)
                        // assert(record.item ==  _head.item ||
                        //       record.item is num && record.item.isNaN && _head.item is num && _head.item.isNaN);
                        this._tail._nextDup = record;
                        record._prevDup = this._tail;
                        record._nextDup = null;
                        this._tail = record;
                    }
                };
                // Returns a CollectionChangeRecord having CollectionChangeRecord.trackById == trackById and
                // CollectionChangeRecord.currentIndex >= afterIndex
                _DuplicateItemRecordList.prototype.get = function (trackById, afterIndex) {
                    var record;
                    for (record = this._head; record !== null; record = record._nextDup) {
                        if ((afterIndex === null || afterIndex < record.currentIndex) &&
                            utils_1.looseIdentical(record.trackById, trackById)) {
                            return record;
                        }
                    }
                    return null;
                };
                /**
                 * Remove one {@link CollectionChangeRecord} from the list of duplicates.
                 *
                 * Returns whether the list of duplicates is empty.
                 */
                _DuplicateItemRecordList.prototype.remove = function (record) {
                    // todo(vicb)
                    // assert(() {
                    //  // verify that the record being removed is in the list.
                    //  for (CollectionChangeRecord cursor = _head; cursor != null; cursor = cursor._nextDup) {
                    //    if (identical(cursor, record)) return true;
                    //  }
                    //  return false;
                    //});
                    var prev = record._prevDup;
                    var next = record._nextDup;
                    if (prev === null) {
                        this._head = next;
                    }
                    else {
                        prev._nextDup = next;
                    }
                    if (next === null) {
                        this._tail = prev;
                    }
                    else {
                        next._prevDup = prev;
                    }
                    return this._head === null;
                };
                return _DuplicateItemRecordList;
            }());
            _DuplicateMap = (function () {
                function _DuplicateMap() {
                    this.map = new Map();
                }
                _DuplicateMap.prototype.put = function (record) {
                    // todo(vicb) handle corner cases
                    var key = utils_1.getMapKey(record.trackById);
                    var duplicates = this.map.get(key);
                    if (!utils_1.isPresent(duplicates)) {
                        duplicates = new _DuplicateItemRecordList();
                        this.map.set(key, duplicates);
                    }
                    duplicates.add(record);
                };
                /**
                 * Retrieve the `value` using key. Because the CollectionChangeRecord value may be one which we
                 * have already iterated over, we use the afterIndex to pretend it is not there.
                 *
                 * Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
                 * have any more `a`s needs to return the last `a` not the first or second.
                 */
                _DuplicateMap.prototype.get = function (trackById, afterIndex) {
                    if (afterIndex === void 0) { afterIndex = null; }
                    var key = utils_1.getMapKey(trackById);
                    var recordList = this.map.get(key);
                    return utils_1.isBlank(recordList) ? null : recordList.get(trackById, afterIndex);
                };
                /**
                 * Removes a {@link CollectionChangeRecord} from the list of duplicates.
                 *
                 * The list of duplicates also is removed from the map if it gets empty.
                 */
                _DuplicateMap.prototype.remove = function (record) {
                    var key = utils_1.getMapKey(record.trackById);
                    // todo(vicb)
                    // assert(this.map.containsKey(key));
                    var recordList = this.map.get(key);
                    // Remove the list of duplicates when it gets empty
                    if (recordList.remove(record)) {
                        this.map.delete(key);
                    }
                    return record;
                };
                Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
                    get: function () { return this.map.size === 0; },
                    enumerable: true,
                    configurable: true
                });
                _DuplicateMap.prototype.clear = function () { this.map.clear(); };
                _DuplicateMap.prototype.toString = function () { return '_DuplicateMap(' + utils_1.stringify(this.map) + ')'; };
                return _DuplicateMap;
            }());
        }
    }
});
System.register("core/change_detection/differs/keyvalue", ["utils/utils"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var utils_2;
    var KeyValueDifferFactory, KeyValueDiffer, KeyValueChangeRecord;
    return {
        setters:[
            function (utils_2_1) {
                utils_2 = utils_2_1;
            }],
        execute: function() {
            /**
             * @license
             * Copyright Google Inc. All Rights Reserved.
             *
             * Use of this source code is governed by an MIT-style license that can be
             * found in the LICENSE file at https://angular.io/license
             *
             * Modified by Thomas Pink for the usage in Mojito
             */
            /**
             * Factory for creating a KeyValueDiffer
             *
             * @export
             * @class DefaultKeyValueDifferFactory
             */
            KeyValueDifferFactory = (function () {
                function KeyValueDifferFactory() {
                }
                KeyValueDifferFactory.prototype.supports = function (obj) { return obj instanceof Map || utils_2.isObject(obj); };
                KeyValueDifferFactory.prototype.create = function (cdRef) { return new KeyValueDiffer(); };
                return KeyValueDifferFactory;
            }());
            exports_17("KeyValueDifferFactory", KeyValueDifferFactory);
            /**
             * Key-Value Differ for Objects and Maps
             *
             * @export
             * @class KeyValueDiffer
             */
            KeyValueDiffer = (function () {
                function KeyValueDiffer() {
                    this._records = new Map();
                    this._mapHead = null;
                    this._previousMapHead = null;
                    this._changesHead = null;
                    this._changesTail = null;
                    this._additionsHead = null;
                    this._additionsTail = null;
                    this._removalsHead = null;
                    this._removalsTail = null;
                }
                Object.defineProperty(KeyValueDiffer.prototype, "isDirty", {
                    get: function () {
                        return this._additionsHead !== null || this._changesHead !== null ||
                            this._removalsHead !== null;
                    },
                    enumerable: true,
                    configurable: true
                });
                KeyValueDiffer.prototype.forEachItem = function (fn) {
                    var record;
                    for (record = this._mapHead; record !== null; record = record._next) {
                        fn(record);
                    }
                };
                KeyValueDiffer.prototype.forEachPreviousItem = function (fn) {
                    var record;
                    for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
                        fn(record);
                    }
                };
                KeyValueDiffer.prototype.forEachChangedItem = function (fn) {
                    var record;
                    for (record = this._changesHead; record !== null; record = record._nextChanged) {
                        fn(record);
                    }
                };
                KeyValueDiffer.prototype.forEachAddedItem = function (fn) {
                    var record;
                    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                        fn(record);
                    }
                };
                KeyValueDiffer.prototype.forEachRemovedItem = function (fn) {
                    var record;
                    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                        fn(record);
                    }
                };
                KeyValueDiffer.prototype.diff = function (map) {
                    if (!map) {
                        map = new Map();
                    }
                    else if (!(map instanceof Map || utils_2.isObject(map))) {
                        throw new Error("Error trying to diff '" + map + "'");
                    }
                    return this.check(map) ? this : null;
                };
                KeyValueDiffer.prototype.onDestroy = function () { };
                KeyValueDiffer.prototype.check = function (map) {
                    var _this = this;
                    this._reset();
                    var records = this._records;
                    var oldSeqRecord = this._mapHead;
                    var lastOldSeqRecord = null;
                    var lastNewSeqRecord = null;
                    var seqChanged = false;
                    this._forEach(map, function (value, key) {
                        var newSeqRecord;
                        if (oldSeqRecord && key === oldSeqRecord.key) {
                            newSeqRecord = oldSeqRecord;
                            _this._maybeAddToChanges(newSeqRecord, value);
                        }
                        else {
                            seqChanged = true;
                            if (oldSeqRecord !== null) {
                                _this._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
                                _this._addToRemovals(oldSeqRecord);
                            }
                            if (records.has(key)) {
                                newSeqRecord = records.get(key);
                                _this._maybeAddToChanges(newSeqRecord, value);
                            }
                            else {
                                newSeqRecord = new KeyValueChangeRecord(key);
                                records.set(key, newSeqRecord);
                                newSeqRecord.currentValue = value;
                                _this._addToAdditions(newSeqRecord);
                            }
                        }
                        if (seqChanged) {
                            if (_this._isInRemovals(newSeqRecord)) {
                                _this._removeFromRemovals(newSeqRecord);
                            }
                            if (lastNewSeqRecord == null) {
                                _this._mapHead = newSeqRecord;
                            }
                            else {
                                lastNewSeqRecord._next = newSeqRecord;
                            }
                        }
                        lastOldSeqRecord = oldSeqRecord;
                        lastNewSeqRecord = newSeqRecord;
                        oldSeqRecord = oldSeqRecord && oldSeqRecord._next;
                    });
                    this._truncate(lastOldSeqRecord, oldSeqRecord);
                    return this.isDirty;
                };
                /** @internal */
                KeyValueDiffer.prototype._reset = function () {
                    if (this.isDirty) {
                        var record = void 0;
                        // Record the state of the mapping
                        for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
                            record._nextPrevious = record._next;
                        }
                        for (record = this._changesHead; record !== null; record = record._nextChanged) {
                            record.previousValue = record.currentValue;
                        }
                        for (record = this._additionsHead; record != null; record = record._nextAdded) {
                            record.previousValue = record.currentValue;
                        }
                        this._changesHead = this._changesTail = null;
                        this._additionsHead = this._additionsTail = null;
                        this._removalsHead = this._removalsTail = null;
                    }
                };
                /** @internal */
                KeyValueDiffer.prototype._truncate = function (lastRecord, record) {
                    while (record !== null) {
                        if (lastRecord === null) {
                            this._mapHead = null;
                        }
                        else {
                            lastRecord._next = null;
                        }
                        var nextRecord = record._next;
                        this._addToRemovals(record);
                        lastRecord = record;
                        record = nextRecord;
                    }
                    for (var rec = this._removalsHead; rec !== null; rec = rec._nextRemoved) {
                        rec.previousValue = rec.currentValue;
                        rec.currentValue = null;
                        this._records.delete(rec.key);
                    }
                };
                KeyValueDiffer.prototype._maybeAddToChanges = function (record, newValue) {
                    if (!utils_2.looseIdentical(newValue, record.currentValue)) {
                        record.previousValue = record.currentValue;
                        record.currentValue = newValue;
                        this._addToChanges(record);
                    }
                };
                /** @internal */
                KeyValueDiffer.prototype._isInRemovals = function (record) {
                    return record === this._removalsHead || record._nextRemoved !== null ||
                        record._prevRemoved !== null;
                };
                /** @internal */
                KeyValueDiffer.prototype._addToRemovals = function (record) {
                    if (this._removalsHead === null) {
                        this._removalsHead = this._removalsTail = record;
                    }
                    else {
                        this._removalsTail._nextRemoved = record;
                        record._prevRemoved = this._removalsTail;
                        this._removalsTail = record;
                    }
                };
                /** @internal */
                KeyValueDiffer.prototype._removeFromSeq = function (prev, record) {
                    var next = record._next;
                    if (prev === null) {
                        this._mapHead = next;
                    }
                    else {
                        prev._next = next;
                    }
                    record._next = null;
                };
                /** @internal */
                KeyValueDiffer.prototype._removeFromRemovals = function (record) {
                    var prev = record._prevRemoved;
                    var next = record._nextRemoved;
                    if (prev === null) {
                        this._removalsHead = next;
                    }
                    else {
                        prev._nextRemoved = next;
                    }
                    if (next === null) {
                        this._removalsTail = prev;
                    }
                    else {
                        next._prevRemoved = prev;
                    }
                    record._prevRemoved = record._nextRemoved = null;
                };
                /** @internal */
                KeyValueDiffer.prototype._addToAdditions = function (record) {
                    if (this._additionsHead === null) {
                        this._additionsHead = this._additionsTail = record;
                    }
                    else {
                        this._additionsTail._nextAdded = record;
                        this._additionsTail = record;
                    }
                };
                /** @internal */
                KeyValueDiffer.prototype._addToChanges = function (record) {
                    if (this._changesHead === null) {
                        this._changesHead = this._changesTail = record;
                    }
                    else {
                        this._changesTail._nextChanged = record;
                        this._changesTail = record;
                    }
                };
                KeyValueDiffer.prototype.toString = function () {
                    var items = [];
                    var previous = [];
                    var changes = [];
                    var additions = [];
                    var removals = [];
                    var record;
                    for (record = this._mapHead; record !== null; record = record._next) {
                        items.push(utils_2.stringify(record));
                    }
                    for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
                        previous.push(utils_2.stringify(record));
                    }
                    for (record = this._changesHead; record !== null; record = record._nextChanged) {
                        changes.push(utils_2.stringify(record));
                    }
                    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                        additions.push(utils_2.stringify(record));
                    }
                    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                        removals.push(utils_2.stringify(record));
                    }
                    return 'map: ' + items.join(', ') + '\n' +
                        'previous: ' + previous.join(', ') + '\n' +
                        'additions: ' + additions.join(', ') + '\n' +
                        'changes: ' + changes.join(', ') + '\n' +
                        'removals: ' + removals.join(', ') + '\n';
                };
                KeyValueDiffer.prototype._forEach = function (obj, callback) {
                    if (obj instanceof Map) {
                        obj.forEach(callback);
                    }
                    else if (utils_2.isObject(obj)) {
                        for (var key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                callback(obj[key], key);
                            }
                        }
                    }
                    else {
                        throw new Error("forEach supports only objects or maps");
                    }
                };
                return KeyValueDiffer;
            }());
            exports_17("KeyValueDiffer", KeyValueDiffer);
            KeyValueChangeRecord = (function () {
                function KeyValueChangeRecord(key) {
                    this.key = key;
                    this.previousValue = null;
                    this.currentValue = null;
                    /** @internal */
                    this._nextPrevious = null;
                    /** @internal */
                    this._next = null;
                    /** @internal */
                    this._nextAdded = null;
                    /** @internal */
                    this._nextRemoved = null;
                    /** @internal */
                    this._prevRemoved = null;
                    /** @internal */
                    this._nextChanged = null;
                }
                KeyValueChangeRecord.prototype.toString = function () {
                    return utils_2.looseIdentical(this.previousValue, this.currentValue) ?
                        utils_2.stringify(this.key) :
                        (utils_2.stringify(this.key) + '[' + utils_2.stringify(this.previousValue) + '->' +
                            utils_2.stringify(this.currentValue) + ']');
                };
                return KeyValueChangeRecord;
            }());
            exports_17("KeyValueChangeRecord", KeyValueChangeRecord);
        }
    }
});
/**
 * NOTE!!!
 * Mojito uses change detection based on Angular.
 * This constants are taken directly from Angular, so we get the same API
 *
 *
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * Modified by Thomas Pink for usage in Mojito
 */
System.register("core/change_detection/constants", ["utils/utils"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var utils_3;
    var ChangeDetectionStrategy, ChangeDetectorStatus, CHANGE_DETECTION_STRATEGY_VALUES, CHANGE_DETECTOR_STATUS_VALUES;
    function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
        return utils_3.isBlank(changeDetectionStrategy) ||
            changeDetectionStrategy === ChangeDetectionStrategy.Default;
    }
    exports_18("isDefaultChangeDetectionStrategy", isDefaultChangeDetectionStrategy);
    return {
        setters:[
            function (utils_3_1) {
                utils_3 = utils_3_1;
            }],
        execute: function() {
            /**
             * Describes within the change detector which strategy will be used the next time change
             * detection is triggered.
             * @stable
             */
            (function (ChangeDetectionStrategy) {
                /**
                 * `OnPush` means that the change detector's mode will be set to `CheckOnce` during hydration.
                 */
                ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
                /**
                 * `Default` means that the change detector's mode will be set to `CheckAlways` during hydration.
                 */
                ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
            })(ChangeDetectionStrategy || (ChangeDetectionStrategy = {}));
            exports_18("ChangeDetectionStrategy", ChangeDetectionStrategy);
            /**
             * Describes the status of the detector.
             */
            (function (ChangeDetectorStatus) {
                /**
                 * `CheckedOnce` means that after calling detectChanges the mode of the change detector
                 * will become `Checked`.
                 */
                ChangeDetectorStatus[ChangeDetectorStatus["CheckOnce"] = 0] = "CheckOnce";
                /**
                 * `Checked` means that the change detector should be skipped until its mode changes to
                 * `CheckOnce`.
                 */
                ChangeDetectorStatus[ChangeDetectorStatus["Checked"] = 1] = "Checked";
                /**
                 * `CheckAlways` means that after calling detectChanges the mode of the change detector
                 * will remain `CheckAlways`.
                 */
                ChangeDetectorStatus[ChangeDetectorStatus["CheckAlways"] = 2] = "CheckAlways";
                /**
                 * `Detached` means that the change detector sub tree is not a part of the main tree and
                 * should be skipped.
                 */
                ChangeDetectorStatus[ChangeDetectorStatus["Detached"] = 3] = "Detached";
                /**
                 * `Errored` means that the change detector encountered an error checking a binding
                 * or calling a directive lifecycle method and is now in an inconsistent state. Change
                 * detectors in this state will no longer detect changes.
                 */
                ChangeDetectorStatus[ChangeDetectorStatus["Errored"] = 4] = "Errored";
                /**
                 * `Destroyed` means that the change detector is destroyed.
                 */
                ChangeDetectorStatus[ChangeDetectorStatus["Destroyed"] = 5] = "Destroyed";
            })(ChangeDetectorStatus || (ChangeDetectorStatus = {}));
            exports_18("ChangeDetectorStatus", ChangeDetectorStatus);
            /**
             * List of possible {@link ChangeDetectionStrategy} values.
             */
            exports_18("CHANGE_DETECTION_STRATEGY_VALUES", CHANGE_DETECTION_STRATEGY_VALUES = [
                ChangeDetectionStrategy.OnPush,
                ChangeDetectionStrategy.Default,
            ]);
            /**
             * List of possible {@link ChangeDetectorStatus} values.
             */
            exports_18("CHANGE_DETECTOR_STATUS_VALUES", CHANGE_DETECTOR_STATUS_VALUES = [
                ChangeDetectorStatus.CheckOnce,
                ChangeDetectorStatus.Checked,
                ChangeDetectorStatus.CheckAlways,
                ChangeDetectorStatus.Detached,
                ChangeDetectorStatus.Errored,
                ChangeDetectorStatus.Destroyed,
            ]);
        }
    }
});
System.register("core/change_detection/change_detection", ["core/change_detection/differs/iterable", "core/change_detection/differs/keyvalue", "core/change_detection/change_detector", "core/change_detection/constants"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var iterable_1, keyvalue_1;
    return {
        setters:[
            function (iterable_1_1) {
                iterable_1 = iterable_1_1;
            },
            function (keyvalue_1_1) {
                keyvalue_1 = keyvalue_1_1;
            },
            function (change_detector_1_1) {
                exports_19({
                    "ChangeDetector": change_detector_1_1["ChangeDetector"]
                });
            },
            function (constants_1_1) {
                exports_19({
                    "CHANGE_DETECTION_STRATEGY_VALUES": constants_1_1["CHANGE_DETECTION_STRATEGY_VALUES"],
                    "CHANGE_DETECTOR_STATUS_VALUES": constants_1_1["CHANGE_DETECTOR_STATUS_VALUES"],
                    "ChangeDetectionStrategy": constants_1_1["ChangeDetectionStrategy"],
                    "ChangeDetectorStatus": constants_1_1["ChangeDetectorStatus"]
                });
            }],
        execute: function() {
            exports_19("IterableDiffer", iterable_1.IterableDiffer);
            exports_19("IterableDifferFactory", iterable_1.IterableDifferFactory);
            exports_19("KeyValueDiffer", keyvalue_1.KeyValueDiffer);
            exports_19("KeyValueDifferFactory", keyvalue_1.KeyValueDifferFactory);
        }
    }
});
System.register("core/component/metadata", ["debug/debug", "utils/string/stringify", "core/di/metadata"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var debug_4, stringify_3, metadata_1;
    var DirectiveMetadata, ComponentMetadata, InputMetadata, OutputMetadata;
    return {
        setters:[
            function (debug_4_1) {
                debug_4 = debug_4_1;
            },
            function (stringify_3_1) {
                stringify_3 = stringify_3_1;
            },
            function (metadata_1_1) {
                metadata_1 = metadata_1_1;
            }],
        execute: function() {
            DirectiveMetadata = (function (_super) {
                __extends(DirectiveMetadata, _super);
                function DirectiveMetadata(_a) {
                    var _b = _a === void 0 ? {} : _a, selector = _b.selector, inputs = _b.inputs, outputs = _b.outputs, host = _b.host, providers = _b.providers;
                    _super.call(this);
                    // Check if a selector is specified in the metadata.
                    // Every directive must have a selector
                    debug_4.assert(typeof selector === 'string', "The directive metadata object on your class must specify a selector!", TypeError);
                    selector = selector.trim();
                    // Check if selector contains only one level of dom nodes
                    // Ok: .my-selector
                    // Not allowed: .parent .my-selector
                    debug_4.assert(selector.indexOf(' ') === -1, "The selector \"" + selector + "\" contains more than one levels of nodes. Only one is allowed!", SyntaxError);
                    // Check if selector is valid
                    debug_4.assert(!!selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/), "The directive selector \"" + selector + "\" is not valid", SyntaxError);
                    // Parsing the selector string to an array
                    // 'my-element.class1#id[attribute1].class2[attribute2="value"]'
                    // to
                    // ["my-element", ".class1", "#id", "[attribute1]", ".class2", "[attribute2="value"]"]   
                    var selectorList = selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');
                    for (var i = 0, max = selectorList.length; i < max; i++) {
                        var selectorPart = selectorList[i];
                        if (!selectorPart.length) {
                            continue;
                        }
                        // Check if the selector contains element names whicht are not allowed
                        // eg. custom elements without a "-" in it
                        debug_4.assert(!selectorPart.match(/^\w+(-\w+)*$/) || !(document.createElement(selectorPart) instanceof HTMLUnknownElement), "The selector \"" + selector + "\" contains an element name \"" + selectorPart + "\" which is not allowed. \n                If you are using a custom element, there has to be a \"-\" char in it. E.g.: my-component", SyntaxError);
                    }
                    this.selector = selector;
                    this.inputs = inputs;
                    this.outputs = outputs;
                    this.host = host;
                    this.providers = providers;
                }
                DirectiveMetadata.prototype.toString = function () { return "@DirectiveMetadata()"; };
                return DirectiveMetadata;
            }(metadata_1.InjectableMetadata));
            exports_20("DirectiveMetadata", DirectiveMetadata);
            /**
             * The component directive allows you to attach behavior (a class) to elements in the DOM
             * using a class decorator or the {@link registerDirective} function.
             *
             * A component directive contains metadata (including the elements selector)
             * and a class which will be attached to the elements.
             *
             * Assume this HTML Template or DOM
             * ```html
             * <form class="form">
             *   <div>
             *     <div my-component>
             *       <div>
             *         <div></div>
             *       </div>
             *       <div></div>
             *     </div>
             *   </div>
             * </form>
             * ```
             *
             * ```typescript
             * @Component({ selector: '[my-component]'})
             * class MyComponent {
             *  // Your Code
             * }
             * ```
             *
             * @export
             * @class ComponentMetadata
             * @extends {DirectiveMetadata}
             */
            ComponentMetadata = (function (_super) {
                __extends(ComponentMetadata, _super);
                function ComponentMetadata(_a) {
                    var _b = _a === void 0 ? {} : _a, changeDetection = _b.changeDetection, selector = _b.selector, inputs = _b.inputs, outputs = _b.outputs, host = _b.host, providers = _b.providers, templateUrl = _b.templateUrl, template = _b.template, styleUrls = _b.styleUrls, styles = _b.styles;
                    _super.call(this, { selector: selector, inputs: inputs, outputs: outputs, host: host, providers: providers });
                    this.changeDetection = changeDetection;
                    this.templateUrl = templateUrl;
                    this.template = template;
                    this.styles = styles;
                    this.styleUrls = styleUrls;
                }
                ComponentMetadata.prototype.toString = function () { return "@ComponentMetadata()"; };
                return ComponentMetadata;
            }(DirectiveMetadata));
            exports_20("ComponentMetadata", ComponentMetadata);
            InputMetadata = (function () {
                function InputMetadata(bindingPropertyName) {
                    this.bindingPropertyName = bindingPropertyName;
                }
                InputMetadata.prototype.toString = function () { return "@InputMetadata(" + stringify_3.stringify(this.bindingPropertyName) + ")"; };
                return InputMetadata;
            }());
            exports_20("InputMetadata", InputMetadata);
            OutputMetadata = (function () {
                function OutputMetadata(bindingPropertyName) {
                    this.bindingPropertyName = bindingPropertyName;
                }
                OutputMetadata.prototype.toString = function () { return "@OutputMetadata(" + stringify_3.stringify(this.bindingPropertyName) + ")"; };
                return OutputMetadata;
            }());
            exports_20("OutputMetadata", OutputMetadata);
        }
    }
});
System.register("core/directive/registry", [], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var DirectiveRegistry;
    return {
        setters:[],
        execute: function() {
            DirectiveRegistry = (function () {
                function DirectiveRegistry() {
                }
                Object.defineProperty(DirectiveRegistry, "selectors", {
                    get: function () { return this._selectors; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DirectiveRegistry, "directiveTypes", {
                    get: function () { return this._directiveTypes; },
                    enumerable: true,
                    configurable: true
                });
                DirectiveRegistry.register = function (directiveType, selector) {
                    if (this._directiveTypes.indexOf(directiveType) === -1 && this._selectors.indexOf(selector) === -1) {
                        this._directiveTypes.push(directiveType);
                        this._selectors.push(selector);
                    }
                };
                DirectiveRegistry.bySelector = function (selector) {
                    var index = this._selectors.indexOf(selector);
                    return index !== -1 ? this._directiveTypes[index] : null;
                };
                DirectiveRegistry._directiveTypes = [];
                DirectiveRegistry._selectors = [];
                return DirectiveRegistry;
            }());
            exports_21("DirectiveRegistry", DirectiveRegistry);
        }
    }
});
System.register("core/decorators/decorators", ["core/reflect/reflection", "core/directive/registry"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var reflection_1, registry_1;
    function createClassDecorator(metadataClass) {
        return function (objOrType) {
            return function (cls) {
                reflection_1.ClassReflection.peek(cls).annotations.set(metadataClass, new metadataClass(objOrType));
                // if objOrType has a selector property we asume that cls is a component or DirectiveMetadata
                // so we can add it to the c
                if (typeof objOrType === 'object' && typeof objOrType.selector === 'string') {
                    registry_1.DirectiveRegistry.register(cls, objOrType.selector);
                }
            };
        };
    }
    exports_22("createClassDecorator", createClassDecorator);
    function createParameterDecorator(metadataClass) {
        return function (objOrType) {
            return function (cls, propertyKey, parameterIndex) {
                if (typeof parameterIndex === 'number' && parameterIndex >= 0) {
                    reflection_1.ClassReflection.peek(cls).parameters[parameterIndex] = new metadataClass(objOrType);
                }
                else {
                    reflection_1.ClassReflection.peek(cls).parameters.push(new metadataClass(objOrType));
                }
            };
        };
    }
    exports_22("createParameterDecorator", createParameterDecorator);
    function createPropertyDecoratory(metadataClass) {
        return function (objOrType) {
            return function (target, propertyKey) {
                reflection_1.ClassReflection.peek(target.constructor).properties.set(propertyKey, new metadataClass(objOrType || propertyKey));
            };
        };
    }
    exports_22("createPropertyDecoratory", createPropertyDecoratory);
    return {
        setters:[
            function (reflection_1_1) {
                reflection_1 = reflection_1_1;
            },
            function (registry_1_1) {
                registry_1 = registry_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/di/decorators", ["core/decorators/decorators", "core/di/metadata"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var decorators_1, metadata_2;
    var Injectable, Inject;
    return {
        setters:[
            function (decorators_1_1) {
                decorators_1 = decorators_1_1;
            },
            function (metadata_2_1) {
                metadata_2 = metadata_2_1;
            }],
        execute: function() {
            exports_23("Injectable", Injectable = decorators_1.createClassDecorator(metadata_2.InjectableMetadata));
            exports_23("Inject", Inject = decorators_1.createParameterDecorator(metadata_2.InjectMetadata));
        }
    }
});
System.register("core/di/forward_ref", ["utils/string/stringify"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var stringify_4;
    /**
     * Allows to refer to references which are not yet defined.
     *
     * For instance, `forwardRef` is used when the `token` which we need to refer to for the purposes of
     * DI is declared,
     * but not yet defined. It is also used when the `token` which we use when creating a query is not
     * yet defined.
     *
     * ### Example
     * {@example core/di/ts/forward_ref/forward_ref.ts region='forward_ref'}
     * @experimental
     */
    function forwardRef(forwardRefFn) {
        forwardRefFn.__forward_ref__ = forwardRef;
        forwardRefFn.toString = function () { return stringify_4.stringify(this()); };
        return forwardRefFn;
    }
    exports_24("forwardRef", forwardRef);
    /**
     * Lazily retrieves the reference value from a forwardRef.
     *
     * Acts as the identity function when given a non-forward-ref value.
     *
     * ### Example ([live demo](http://plnkr.co/edit/GU72mJrk1fiodChcmiDR?p=preview))
     *
     * ```typescript
     * var ref = forwardRef(() => "refValue");
     * expect(resolveForwardRef(ref)).toEqual("refValue");
     * expect(resolveForwardRef("regularValue")).toEqual("regularValue");
     * ```
     *
     * See: {@link forwardRef}
     * @experimental
     */
    function resolveForwardRef(type) {
        if (typeof type === 'function' && type.hasOwnProperty('__forward_ref__') &&
            type.__forward_ref__ === forwardRef) {
            return type();
        }
        else {
            return type;
        }
    }
    exports_24("resolveForwardRef", resolveForwardRef);
    return {
        setters:[
            function (stringify_4_1) {
                stringify_4 = stringify_4_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/di/provider", ["core/reflect/reflection", "core/di/metadata", "core/di/forward_ref", "debug/debug", "utils/string/stringify"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var reflection_2, metadata_3, forward_ref_1, debug_5, stringify_5;
    var Provider, ResolvedProvider, ResolvedFactory;
    /**
     * Creates a {@link Provider}.
     *
     * @export
     * @param {*} token
     * @param {{
     *     useClass?: ClassType<any>,
     *     useValue?: any,
     *     useFactory?: Function,
     *     dependencies?: Object[],
     * }} {useClass, useValue, useFactory, dependencies}
     * @returns {Provider}
     */
    function provide(token, _a) {
        var useClass = _a.useClass, useValue = _a.useValue, useFactory = _a.useFactory, dependencies = _a.dependencies;
        return new Provider(token, {
            useClass: useClass,
            useValue: useValue,
            useFactory: useFactory,
            dependencies: dependencies,
        });
    }
    exports_25("provide", provide);
    /**
     * Resolves an array of Providers or stuff that can be converted to a Provider
     *
     * @internal
     * @export
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @returns {ResolvedProvider[]}
     */
    function resolveProviders(providers) {
        var resolved = [];
        for (var i = 0, max = providers.length; i < max; i++) {
            var p = providers[i];
            if (p instanceof Provider) {
                resolved.push(resolveProvider(p));
            }
            else if (p instanceof Function) {
                resolved.push(resolveProvider(provide(p, { useClass: p })));
            }
            else if (Array.isArray(p)) {
                resolveProviders(p).map(function (resolvedP) { return resolved.push(resolvedP); });
            }
            else {
                throw new TypeError(p + " is not a valid provider!");
            }
        }
        return resolved;
    }
    exports_25("resolveProviders", resolveProviders);
    /**
     * Resolves a single Provider and returns an ResolvedProvider
     *
     * @internal
     * @export
     * @param {Provider} provider
     * @returns {ResolvedProvider}
     */
    function resolveProvider(provider) {
        return new ResolvedProvider(provider.token, resolveFactory(provider));
    }
    exports_25("resolveProvider", resolveProvider);
    function resolveFactory(provider) {
        var factoryFn;
        var dependencies = [];
        if (provider.useClass) {
            var useClass_1 = forward_ref_1.resolveForwardRef(provider.useClass);
            dependencies = dependenciesForClass(useClass_1);
            factoryFn = function (dependecies) {
                if (dependecies === void 0) { dependecies = []; }
                return new (Function.prototype.bind.apply(useClass_1, [null].concat(dependecies)));
            };
        }
        else if (provider.useFactory) {
            factoryFn = provider.useFactory;
        }
        else {
            factoryFn = function () { return provider.useValue; };
        }
        return new ResolvedFactory(factoryFn, dependencies);
    }
    exports_25("resolveFactory", resolveFactory);
    /**
     * Looks up and returns the dependecies as an array for an annotated class.
     *
     * @export
     * @param {ClassType<any>} annotatedClass
     * @returns {any[]}
     */
    function dependenciesForClass(annotatedClass) {
        var dependecies = [];
        var dependencyTokens = reflection_2.ClassReflection.peek(annotatedClass).parameters.filter(function (value) { return value instanceof metadata_3.InjectMetadata; });
        if (Array.isArray(dependencyTokens) && dependencyTokens.length) {
            var isInjectable_1 = false;
            reflection_2.ClassReflection.peek(annotatedClass).annotations.forEach(function (value) {
                if (value instanceof metadata_3.InjectableMetadata) {
                    isInjectable_1 = true;
                }
            });
            debug_5.assert(!!isInjectable_1, "Cannot resolve all parameters for " + stringify_5.stringify(annotatedClass) + "! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject");
            for (var i = 0, max = dependencyTokens.length; i < max; i++) {
                var dep = dependencyTokens[i];
                if (dep instanceof metadata_3.InjectMetadata) {
                    dependecies.push(dep.token);
                }
            }
        }
        return dependecies;
    }
    exports_25("dependenciesForClass", dependenciesForClass);
    return {
        setters:[
            function (reflection_2_1) {
                reflection_2 = reflection_2_1;
            },
            function (metadata_3_1) {
                metadata_3 = metadata_3_1;
            },
            function (forward_ref_1_1) {
                forward_ref_1 = forward_ref_1_1;
            },
            function (debug_5_1) {
                debug_5 = debug_5_1;
            },
            function (stringify_5_1) {
                stringify_5 = stringify_5_1;
            }],
        execute: function() {
            /**
             * Describes how the {@link Injector} should instantiate a given token.
             *
             * @export
             * @class Provider
             */
            Provider = (function () {
                function Provider(token, _a) {
                    var useClass = _a.useClass, useValue = _a.useValue, useFactory = _a.useFactory, dependencies = _a.dependencies;
                    this.token = token;
                    this.useClass = useClass;
                    this.useValue = useValue;
                    this.useFactory = useFactory;
                    this.dependencies = dependencies;
                }
                return Provider;
            }());
            exports_25("Provider", Provider);
            /**
             * An internal resolved representation of a {@link Provider} used by the {@link Injector}.
             *
             * @export
             * @class ResolvedProvider
             */
            ResolvedProvider = (function () {
                function ResolvedProvider(token, resolvedFactory) {
                    this._token = token;
                    this._resolvedFactory = resolvedFactory;
                }
                Object.defineProperty(ResolvedProvider.prototype, "token", {
                    get: function () {
                        return this._token;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResolvedProvider.prototype, "resolvedFactory", {
                    get: function () {
                        return this._resolvedFactory;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ResolvedProvider;
            }());
            exports_25("ResolvedProvider", ResolvedProvider);
            /**
             * An internal resolved representation of a factory function created by resolving {@link Provider}.
             *
             * A ResolvedFactory is basically a function which creates
             * and returns the item (class, value,.. ) provided.
             *
             * @export
             * @class ResolvedFactory
             */
            ResolvedFactory = (function () {
                function ResolvedFactory(factory, dependencies) {
                    this._dependencies = [];
                    this._factoryFn = factory;
                    this._dependencies = dependencies;
                }
                Object.defineProperty(ResolvedFactory.prototype, "factory", {
                    get: function () {
                        return this._factoryFn;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResolvedFactory.prototype, "dependencies", {
                    get: function () {
                        return this._dependencies || [];
                    },
                    enumerable: true,
                    configurable: true
                });
                return ResolvedFactory;
            }());
            exports_25("ResolvedFactory", ResolvedFactory);
        }
    }
});
System.register("core/di/injector", ["core/map/map", "core/di/provider", "core/di/forward_ref", "debug/debug", "utils/string/stringify"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var map_2, provider_1, forward_ref_2, debug_6, stringify_6;
    var Injector;
    return {
        setters:[
            function (map_2_1) {
                map_2 = map_2_1;
            },
            function (provider_1_1) {
                provider_1 = provider_1_1;
            },
            function (forward_ref_2_1) {
                forward_ref_2 = forward_ref_2_1;
            },
            function (debug_6_1) {
                debug_6 = debug_6_1;
            },
            function (stringify_6_1) {
                stringify_6 = stringify_6_1;
            }],
        execute: function() {
            /**
             * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
             * constructor dependencies.
             *
             * @export
             * @class Injector
             */
            Injector = (function () {
                /**
                 * Creates an instance of Injector.
                 *
                 * @param {ResolvedProvider[]} providers
                 * @param {Injector} [parent=null]
                 */
                function Injector(providers, parent) {
                    if (parent === void 0) { parent = null; }
                    this._parent = null;
                    this._providers = [];
                    this._values = new map_2.CoreMap();
                    this._parent = parent;
                    this._providers = providers;
                }
                Object.defineProperty(Injector.prototype, "parent", {
                    /**
                     * The parent of this injector
                     *
                     * @readonly
                     * @type {Injector}
                     */
                    get: function () {
                        return this._parent || null;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Turns an array of provider definitions into an array of resolved providers.
                 *
                 * @static
                 * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
                 * @returns {ResolvedProvider[]}
                 */
                Injector.resolve = function (providers) {
                    return provider_1.resolveProviders(providers);
                };
                /**
                 * Resolves an array of providers and creates an injector from those providers.
                 *
                 * @static
                 * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
                 * @param {Injector} [parent=null]
                 * @returns
                 */
                Injector.resolveAndCreate = function (providers, parent) {
                    if (parent === void 0) { parent = null; }
                    var resolvedProviders = Injector.resolve(providers);
                    return Injector.fromResolvedProviders(resolvedProviders, parent);
                };
                /**
                 * Creates an injector from previously resolved providers.
                 *
                 * @static
                 * @param {ResolvedProvider[]} providers
                 * @param {Injector} [parent=null]
                 * @returns
                 */
                Injector.fromResolvedProviders = function (providers, parent) {
                    if (parent === void 0) { parent = null; }
                    return new Injector(providers, parent);
                };
                /**
                 * Resolves an array of providers and creates a child injector from those providers.
                 *
                 * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
                 * @returns {Injector}
                 */
                Injector.prototype.resolveAndCreateChild = function (providers) {
                    var resolvedProviders = Injector.resolve(providers);
                    return this.createChildFromResolved(resolvedProviders);
                };
                /**
                 * Creates a child injector from previously resolved providers.
                 *
                 * @param {ResolvedProvider[]} providers
                 * @returns {Injector}
                 */
                Injector.prototype.createChildFromResolved = function (providers) {
                    return Injector.fromResolvedProviders(providers, this);
                };
                /**
                 * Gets the value of the resolved provider matching the token
                 *
                 * @param {*} token
                 * @returns {*}
                 */
                Injector.prototype.get = function (token) {
                    var value = this._values.get(token);
                    if (value) {
                        return value;
                    }
                    for (var i = 0, max = this._providers.length; i < max; i++) {
                        var provider = this._providers[i];
                        if (provider.token === token) {
                            var resolvedFactory = provider.resolvedFactory;
                            var resolvedDepts = [];
                            for (var j = 0, max_1 = resolvedFactory.dependencies.length; j < max_1; j++) {
                                var deptToken = forward_ref_2.resolveForwardRef(resolvedFactory.dependencies[j]);
                                var dept = this.get(deptToken);
                                debug_6.assert(!!dept, "Cannot resolve all parameters for " + stringify_6.stringify(resolvedFactory.factory) + "! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject");
                                resolvedDepts.push(dept);
                            }
                            value = resolvedFactory.factory(resolvedDepts);
                            this._values.set(token, value);
                            return value;
                        }
                    }
                    return this._parent ? this._parent.get(token) : null;
                };
                return Injector;
            }());
            exports_26("Injector", Injector);
        }
    }
});
/**
 * Mojito's dependency injection basically a simpler version of Angular's DI.
 * All the credits and respect to the Angular team.
 *
 * TODO: Insert stuff...
 */
System.register("core/di/di", ["core/di/decorators", "core/di/injector", "core/di/provider", "core/di/forward_ref"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    return {
        setters:[
            function (decorators_2_1) {
                exports_27({
                    "Injectable": decorators_2_1["Injectable"],
                    "Inject": decorators_2_1["Inject"]
                });
            },
            function (injector_1_1) {
                exports_27({
                    "Injector": injector_1_1["Injector"]
                });
            },
            function (provider_2_1) {
                exports_27({
                    "Provider": provider_2_1["Provider"],
                    "ResolvedProvider": provider_2_1["ResolvedProvider"],
                    "provide": provider_2_1["provide"]
                });
            },
            function (forward_ref_3_1) {
                exports_27({
                    "forwardRef": forward_ref_3_1["forwardRef"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("core/component/decorators", ["core/decorators/decorators", "core/component/metadata"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var decorators_3, metadata_4;
    var Component, Input, Output;
    return {
        setters:[
            function (decorators_3_1) {
                decorators_3 = decorators_3_1;
            },
            function (metadata_4_1) {
                metadata_4 = metadata_4_1;
            }],
        execute: function() {
            exports_28("Component", Component = decorators_3.createClassDecorator(metadata_4.ComponentMetadata));
            exports_28("Input", Input = decorators_3.createPropertyDecoratory(metadata_4.InputMetadata));
            exports_28("Output", Output = decorators_3.createPropertyDecoratory(metadata_4.OutputMetadata));
        }
    }
});
System.register("render/parser/context", [], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var ContextReference, ContextTree;
    return {
        setters:[],
        execute: function() {
            ContextReference = (function () {
                function ContextReference(context) {
                    this.context = context;
                }
                return ContextReference;
            }());
            exports_29("ContextReference", ContextReference);
            ContextTree = (function () {
                function ContextTree(context) {
                    this._tree = [];
                    if (context) {
                        this.add(context);
                    }
                }
                ContextTree.prototype.up = function () {
                    this._tree.shift();
                    if (!this._tree.length) {
                        this.down();
                    }
                };
                ContextTree.prototype.down = function () {
                    this._tree.unshift([]);
                };
                ContextTree.prototype.add = function (context) {
                    var _this = this;
                    if (Array.isArray(context)) {
                        context.map(function (context) { return _this.add(context); });
                    }
                    else {
                        if (!this._tree.length) {
                            this.down();
                        }
                        this._tree[0].push(new ContextReference(context));
                    }
                };
                ContextTree.prototype.getUnfiltered = function () {
                    return this._tree.slice(0);
                };
                ContextTree.prototype.getFiltered = function () {
                    return this._tree.slice(0).filter(function (list) { return !!(Array.isArray(list) && list.length); });
                };
                ContextTree.prototype.getNearestContextOfType = function (type) {
                    for (var i = 0, max = this._tree.length; i < max; i++) {
                        var list = this._tree[i];
                        for (var j = 0, max_2 = list.length; j < max_2; j++) {
                            var context = list[j].context;
                            if ((typeof type === 'string' && typeof context === type)
                                || (typeof type === 'function' && context instanceof type)) {
                                return context;
                            }
                        }
                    }
                    return null;
                };
                return ContextTree;
            }());
            exports_29("ContextTree", ContextTree);
        }
    }
});
System.register("render/parser/dom_parser", ["debug/debug", "core/di/di", "render/parser/context"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var debug_7, di_1, context_31;
    var DOMParser;
    return {
        setters:[
            function (debug_7_1) {
                debug_7 = debug_7_1;
            },
            function (di_1_1) {
                di_1 = di_1_1;
            },
            function (context_31_1) {
                context_31 = context_31_1;
            }],
        execute: function() {
            DOMParser = (function () {
                function DOMParser() {
                    this.elementHooks = [];
                    this.attributeHooks = [];
                }
                DOMParser.prototype.parseTree = function (rootElement, context, skipRootElement) {
                    if (typeof context === 'boolean') {
                        skipRootElement = context;
                    }
                    this.parseNode(rootElement, new context_31.ContextTree(context), skipRootElement);
                };
                DOMParser.prototype.parseNode = function (element, contextTree, skipRootElement) {
                    if (skipRootElement === void 0) { skipRootElement = false; }
                    if (!(element instanceof Element)) {
                        throw new Error('The property element has to be an Element');
                    }
                    if (!skipRootElement) {
                        contextTree.down();
                    }
                    // Skip script and styles elements
                    var tagName = element.tagName.toUpperCase();
                    if (tagName.toUpperCase() === 'SCRIPT' || tagName.toUpperCase() === 'STYLES') {
                        return;
                    }
                    var elementHooks = this.elementHooks;
                    var parseFunctions = [];
                    var afterParseFunctions = [];
                    if (element.hasAttribute(DOMParser.PARSED_ELEMENT_ATTR)) {
                        skipRootElement = true;
                    }
                    if (!skipRootElement) {
                        for (var i = 0, max = elementHooks.length; i < max; i++) {
                            var elementHook = elementHooks[i];
                            if (elementHook.predicate(element)) {
                                if (elementHook.onBeforeParse) {
                                    try {
                                        contextTree.add(elementHook.onBeforeParse(element, contextTree));
                                    }
                                    catch (ex) {
                                        debug_7.Logger.log(debug_7.LogLevel.error, ex, debug_7.LogType.error);
                                    }
                                }
                                (function (hook, element) {
                                    if (hook.onParse)
                                        parseFunctions.push(function (context) { hook.onParse(element, context); });
                                    if (hook.onAfterParse)
                                        afterParseFunctions.push(function (context) { hook.onAfterParse(element, context); });
                                })(elementHook, element);
                            }
                        }
                        var attributes = element.attributes;
                        var attributeHooks = this.attributeHooks;
                        var diff = 0;
                        for (var i = 0, max = attributes.length; i < max; i++) {
                            var attribute = attributes[i - diff];
                            if (attribute.name === DOMParser.PARSED_ELEMENT_ATTR) {
                                continue;
                            }
                            for (var j = 0, max_3 = attributeHooks.length; j < max_3; j++) {
                                var attributeHook = attributeHooks[j];
                                if (attributeHook.predicate(attribute)) {
                                    if (attributeHook.onBeforeParse) {
                                        try {
                                            contextTree.add(attributeHook.onBeforeParse(element, attribute, contextTree));
                                        }
                                        catch (ex) {
                                            debug_7.Logger.log(debug_7.LogLevel.critical, ex, debug_7.LogType.error);
                                        }
                                    }
                                    if (attributeHook.removeAttributeNode) {
                                        element.removeAttributeNode(attribute);
                                        diff++;
                                    }
                                    (function (hook, element, attribute) {
                                        if (hook.onParse)
                                            parseFunctions.push(function (context) { hook.onParse(element, attribute, context); });
                                        if (hook.onAfterParse)
                                            afterParseFunctions.push(function (context) { hook.onAfterParse(element, attribute, context); });
                                    })(attributeHook, element, attribute);
                                }
                            }
                        }
                        for (var i = 0, max = parseFunctions.length; i < max; i++) {
                            parseFunctions[i](contextTree);
                        }
                    }
                    // loop through child nodes and recursively parse them       
                    var nodes = element.childNodes;
                    for (var i = 0, max = nodes.length; i < max; i++) {
                        var node = nodes[i];
                        var nodeType = node.nodeType;
                        if (nodeType !== Node.ELEMENT_NODE && nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                            continue;
                        }
                        if (node instanceof Element) {
                            this.parseNode(node, contextTree);
                        }
                    }
                    if (!skipRootElement) {
                        for (var i = 0, max = afterParseFunctions.length; i < max; i++) {
                            afterParseFunctions[i](contextTree);
                        }
                    }
                    element.setAttribute(DOMParser.PARSED_ELEMENT_ATTR, '');
                    if (!skipRootElement) {
                        contextTree.up();
                    }
                };
                DOMParser.prototype.registerElementHook = function (hook) {
                    this.elementHooks.push(hook);
                };
                DOMParser.prototype.registerAttributeHook = function (hook) {
                    this.attributeHooks.push(hook);
                };
                DOMParser.PARSED_ELEMENT_ATTR = '_mparsed';
                DOMParser = __decorate([
                    di_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], DOMParser);
                return DOMParser;
            }());
            exports_30("DOMParser", DOMParser);
        }
    }
});
System.register("core/component/resolver", ["core/di/di", "core/component/factory", "core/reflect/reflection"], function(exports_31, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var di_2, factory_1, reflection_3;
    var ComponentResolver;
    return {
        setters:[
            function (di_2_1) {
                di_2 = di_2_1;
            },
            function (factory_1_1) {
                factory_1 = factory_1_1;
            },
            function (reflection_3_1) {
                reflection_3 = reflection_3_1;
            }],
        execute: function() {
            ComponentResolver = (function () {
                function ComponentResolver() {
                }
                ComponentResolver.prototype.resolveComponent = function (componentClass) {
                    var factory = reflection_3.ClassReflection.peek(componentClass).annotations.get(factory_1.ComponentFactory);
                    if (!(factory instanceof factory_1.ComponentFactory)) {
                        factory = new factory_1.ComponentFactory(componentClass);
                        reflection_3.ClassReflection.peek(componentClass).annotations.set(factory_1.ComponentFactory, factory);
                    }
                    return factory;
                };
                ComponentResolver = __decorate([
                    di_2.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], ComponentResolver);
                return ComponentResolver;
            }());
            exports_31("ComponentResolver", ComponentResolver);
        }
    }
});
System.register("render/parser/hooks/hooks", [], function(exports_32, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var ParserElementHook, ParserAttributeHook;
    return {
        setters:[],
        execute: function() {
            ParserElementHook = (function () {
                function ParserElementHook() {
                }
                return ParserElementHook;
            }());
            exports_32("ParserElementHook", ParserElementHook);
            ParserAttributeHook = (function () {
                function ParserAttributeHook() {
                    this.removeAttributeNode = false;
                }
                return ParserAttributeHook;
            }());
            exports_32("ParserAttributeHook", ParserAttributeHook);
        }
    }
});
System.register("render/parser/hooks/component", ["debug/debug", "utils/string/stringify", "render/parser/hooks/hooks", "utils/dom/dom", "core/directive/registry", "core/view/view", "core/view/host"], function(exports_33, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    var debug_8, stringify_7, hooks_1, dom_2, registry_2, view_1, host_1;
    var ComponentParserHook;
    return {
        setters:[
            function (debug_8_1) {
                debug_8 = debug_8_1;
            },
            function (stringify_7_1) {
                stringify_7 = stringify_7_1;
            },
            function (hooks_1_1) {
                hooks_1 = hooks_1_1;
            },
            function (dom_2_1) {
                dom_2 = dom_2_1;
            },
            function (registry_2_1) {
                registry_2 = registry_2_1;
            },
            function (view_1_1) {
                view_1 = view_1_1;
            },
            function (host_1_1) {
                host_1 = host_1_1;
            }],
        execute: function() {
            ComponentParserHook = (function (_super) {
                __extends(ComponentParserHook, _super);
                function ComponentParserHook(resolver) {
                    _super.call(this);
                    this.resolver = resolver;
                    this.selectors = registry_2.DirectiveRegistry.selectors;
                    this.lastFoundSelectorIndex = -1;
                }
                ComponentParserHook.prototype.predicate = function (element) {
                    for (var i = 0, max = this.selectors.length; i < max; i++) {
                        if (dom_2.doesSelectorMatchElement(this.selectors[i], element)) {
                            this.lastFoundSelectorIndex = i;
                            return true;
                        }
                    }
                    this.lastFoundSelectorIndex = -1;
                    return false;
                };
                ComponentParserHook.prototype.onBeforeParse = function (element, context) {
                    var componentType = registry_2.DirectiveRegistry.directiveTypes[this.lastFoundSelectorIndex];
                    var factory = this.resolver.resolveComponent(componentType);
                    var view = context.getNearestContextOfType(view_1.View);
                    debug_8.assert(view instanceof view_1.View, "The found view on the element " + element + " has to be of the type View!");
                    debug_8.assert(view.hostElement instanceof host_1.HostElement, "The found component \"" + stringify_7.stringify(componentType) + "\" on the element " + element + " has no parent host element.\nAre you using the bootstrap function for setting up your project?");
                    var componentRef = factory.create(view.hostElement.injector, element);
                    this.lastFoundSelectorIndex = -1;
                    return componentRef.hostElement.getView(-1);
                };
                return ComponentParserHook;
            }(hooks_1.ParserElementHook));
            exports_33("ComponentParserHook", ComponentParserHook);
        }
    }
});
System.register("core/async/events", [], function(exports_34, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var EventEmitter, EventSubscription;
    return {
        setters:[],
        execute: function() {
            EventEmitter = (function () {
                function EventEmitter() {
                    this._subscriptions = [];
                }
                EventEmitter.prototype.subscribe = function (generatorOrNext, error, complete) {
                    if (generatorOrNext instanceof EventSubscription) {
                        this._subscriptions.push(generatorOrNext);
                    }
                    else {
                        var subscription = new EventSubscription(this, generatorOrNext, error, complete);
                        this._subscriptions.push(subscription);
                        return subscription;
                    }
                };
                EventEmitter.prototype.emit = function (value) {
                    this._call('subscriber', value);
                };
                EventEmitter.prototype.error = function (error) {
                    this._call('error');
                };
                EventEmitter.prototype.complete = function () {
                    this._call('complete');
                };
                EventEmitter.prototype.unsubscribe = function (subscription) {
                    var index = this._subscriptions.indexOf(subscription);
                    if (index !== -1) {
                        this._subscriptions.splice(index, 1);
                        subscription.emitter = null;
                    }
                };
                EventEmitter.prototype._call = function (fnName) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    for (var i = 0, max = this._subscriptions.length; i < max; i++) {
                        var subscription = this._subscriptions[i];
                        subscription[fnName].call(subscription, args);
                    }
                };
                return EventEmitter;
            }());
            exports_34("EventEmitter", EventEmitter);
            EventSubscription = (function () {
                function EventSubscription(emitter, generatorOrNext, error, complete) {
                    this.emitter = emitter;
                    if (typeof generatorOrNext === 'function') {
                        this._subscriber = generatorOrNext;
                    }
                    if (typeof error === 'function') {
                        this._complete = error;
                    }
                    if (typeof error === 'function') {
                        this._error = complete;
                    }
                }
                Object.defineProperty(EventSubscription.prototype, "subscriber", {
                    get: function () {
                        return this._subscriber;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EventSubscription.prototype, "complete", {
                    get: function () {
                        return this._complete;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EventSubscription.prototype, "error", {
                    get: function () {
                        return this._error;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EventSubscription.prototype, "isSubscribed", {
                    get: function () {
                        return !!this.emitter;
                    },
                    enumerable: true,
                    configurable: true
                });
                EventSubscription.prototype.unsubscribe = function () {
                    this.emitter.unsubscribe(this);
                };
                return EventSubscription;
            }());
            exports_34("EventSubscription", EventSubscription);
        }
    }
});
System.register("render/parser/expression_parser/executable", [], function(exports_35, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var Executable;
    return {
        setters:[],
        execute: function() {
            Executable = (function () {
                function Executable(expression, requestContextForToken) {
                    this._contexts = [];
                    var pattern = /\$?\b\w+(\.\w+)*\b/g;
                    var executableString = "";
                    var lastIndex = 0;
                    var match;
                    var contexts = [];
                    while (match = pattern.exec(expression)) {
                        var token = expression.substr(match.index, pattern.lastIndex - match.index);
                        contexts.push(requestContextForToken(token.split('.')[0]));
                        executableString += expression.substr(lastIndex, match.index - lastIndex) + 'arguments[' + (contexts.length - 1) + '].' + token;
                        lastIndex = pattern.lastIndex;
                    }
                    executableString += expression.substr(lastIndex, expression.length);
                    this._executableFn = Function(executableString);
                    this._contexts = contexts;
                }
                Executable.prototype.execute = function () {
                    return this._executableFn.apply(this._executableFn, this._contexts);
                };
                return Executable;
            }());
            exports_35("Executable", Executable);
        }
    }
});
System.register("render/parser/expression_parser/parser", ["render/parser/expression_parser/executable"], function(exports_36, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var executable_1;
    var ExpressionParser;
    return {
        setters:[
            function (executable_1_1) {
                executable_1 = executable_1_1;
            }],
        execute: function() {
            ExpressionParser = (function () {
                function ExpressionParser(expession) {
                    this.expession = expession;
                }
                ExpressionParser.prototype.parse = function (requestContextForToken) {
                    return new executable_1.Executable(this.expession, requestContextForToken);
                };
                return ExpressionParser;
            }());
            exports_36("ExpressionParser", ExpressionParser);
        }
    }
});
System.register("render/parser/hooks/event", ["debug/debug", "render/parser/hooks/hooks", "core/view/view", "core/reflect/reflection", "core/component/metadata", "core/async/events", "render/parser/expression_parser/parser"], function(exports_37, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var debug_9, hooks_2, view_2, reflection_4, metadata_5, events_1, parser_1;
    var EventParserHook;
    return {
        setters:[
            function (debug_9_1) {
                debug_9 = debug_9_1;
            },
            function (hooks_2_1) {
                hooks_2 = hooks_2_1;
            },
            function (view_2_1) {
                view_2 = view_2_1;
            },
            function (reflection_4_1) {
                reflection_4 = reflection_4_1;
            },
            function (metadata_5_1) {
                metadata_5 = metadata_5_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (parser_1_1) {
                parser_1 = parser_1_1;
            }],
        execute: function() {
            EventParserHook = (function (_super) {
                __extends(EventParserHook, _super);
                function EventParserHook() {
                    _super.call(this);
                    this.removeAttributeNode = true;
                }
                EventParserHook.prototype.predicate = function (attribute) {
                    return !!attribute.name.match(/^\(\w+(-\w+)*\)|on-\w+(-\w+)*|data-on-\w+(-\w+)*$/);
                };
                EventParserHook.prototype.onAfterParse = function (element, attribute, context) {
                    var view = context.getNearestContextOfType(view_2.View);
                    var host = view.hostElement;
                    var attrName = attribute.name;
                    var eventType;
                    var eventExpression = attribute.value;
                    debug_9.assert(view instanceof view_2.View, "There is no view, directive or component found for this event " + attribute.name + "=\"" + attribute.value + "\"");
                    if (attrName.indexOf('on-') !== -1) {
                        eventType = attrName.split('on-')[1];
                    }
                    else {
                        eventType = attrName.match(/\w+(-\w+)*/)[0];
                    }
                    eventType = eventType.toLowerCase();
                    var isComponent = context.getUnfiltered()[0].filter(function (value) { return value.context === view; }).length
                        && view.hostElement.componentView === view;
                    var eventContextObject = {
                        $event: {}
                    };
                    var exprParser = new parser_1.ExpressionParser(eventExpression);
                    var executable = exprParser.parse(function (token) {
                        if (token === '$event') {
                            return eventContextObject;
                        }
                        // Check for template var in view
                        if (!isComponent && view !== host.componentView && view.getTemplateVar(token, false)) {
                            return view.templateVars;
                        }
                        // Check for template var in component view
                        if (!isComponent && host.componentView.getTemplateVar(token, false)) {
                            return host.componentView.templateVars;
                        }
                        // Check for template var in parent component view
                        if (isComponent && host.parent.componentView.getTemplateVar(token, false)) {
                            return host.parent.componentView.templateVars;
                        }
                        // Check for var or method in 
                        return isComponent ? host.parent.component : host.component;
                    });
                    if (isComponent) {
                        reflection_4.ClassReflection.peek(view.hostElement.component.constructor).properties.forEach(function (value, key) {
                            if (value instanceof metadata_5.OutputMetadata && value.bindingPropertyName.toLowerCase() === eventType) {
                                var emitter = host.component[key];
                                if (emitter instanceof events_1.EventEmitter) {
                                    emitter.subscribe(function (event) {
                                        if (event) {
                                            eventContextObject.$event = event;
                                        }
                                        executable.execute();
                                    });
                                }
                            }
                        });
                    }
                    else {
                        element.addEventListener(eventType, function (event) {
                            if (event) {
                                eventContextObject.$event = event;
                            }
                            executable.execute();
                        });
                    }
                };
                return EventParserHook;
            }(hooks_2.ParserAttributeHook));
            exports_37("EventParserHook", EventParserHook);
        }
    }
});
System.register("render/parser/hooks/binding", ["render/parser/hooks/hooks", "core/view/view", "render/parser/expression_parser/parser"], function(exports_38, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var hooks_3, view_3, parser_2;
    var BindingParserHook;
    return {
        setters:[
            function (hooks_3_1) {
                hooks_3 = hooks_3_1;
            },
            function (view_3_1) {
                view_3 = view_3_1;
            },
            function (parser_2_1) {
                parser_2 = parser_2_1;
            }],
        execute: function() {
            BindingParserHook = (function (_super) {
                __extends(BindingParserHook, _super);
                function BindingParserHook() {
                    _super.call(this);
                    this.removeAttributeNode = true;
                }
                BindingParserHook.prototype.predicate = function (attribute) {
                    return !!attribute.name.match(/^\[\w+\]|bind-\w+|data-bind-\w+$/);
                };
                BindingParserHook.prototype.onParse = function (element, attribute, context) {
                    var view = context.getNearestContextOfType(view_3.View);
                    var host = view.hostElement;
                    var attrName = attribute.name;
                    var bindingName = '';
                    var bindingExpression = attribute.value;
                    var isComponent = context.getUnfiltered()[0].filter(function (value) { return value.context === view; }).length
                        && view.hostElement.componentView === view;
                    if (attrName.indexOf('on-') !== -1) {
                        bindingName = attrName.split('on-')[1];
                    }
                    else {
                        bindingName = attrName.match(/\w+(-\w+)*/)[0];
                    }
                    var exprParser = new parser_2.ExpressionParser(bindingExpression);
                    var executable = exprParser.parse(function (token) {
                        // Check for template var in view
                        if (!isComponent && view !== host.componentView && view.getTemplateVar(token, false)) {
                            return view.templateVars;
                        }
                        // Check for template var in component view
                        if (!isComponent && host.componentView.getTemplateVar(token, false)) {
                            return host.componentView.templateVars;
                        }
                        // Check for template var in parent component view
                        if (isComponent && host.parent.componentView.getTemplateVar(token, false)) {
                            return host.parent.componentView.templateVars;
                        }
                        // Check for var or method in 
                        return isComponent ? host.parent.component : host.component;
                    });
                    var bindingType = bindingName.split('.')[0];
                    if (bindingType === 'attr') {
                    }
                    else if (bindingType === 'class') {
                    }
                    else {
                    }
                    // console.log(bindingName);
                };
                return BindingParserHook;
            }(hooks_3.ParserAttributeHook));
            exports_38("BindingParserHook", BindingParserHook);
        }
    }
});
System.register("render/parser/hooks/template_variable", ["render/parser/hooks/hooks", "core/view/view"], function(exports_39, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    var hooks_4, view_4;
    var TemplateVariableParserHook;
    return {
        setters:[
            function (hooks_4_1) {
                hooks_4 = hooks_4_1;
            },
            function (view_4_1) {
                view_4 = view_4_1;
            }],
        execute: function() {
            TemplateVariableParserHook = (function (_super) {
                __extends(TemplateVariableParserHook, _super);
                function TemplateVariableParserHook() {
                    _super.call(this);
                    this.removeAttributeNode = true;
                }
                TemplateVariableParserHook.prototype.predicate = function (attribute) {
                    return !!attribute.name.match(/^\#\w+|ref-\w+|data-ref-\w+$/);
                };
                TemplateVariableParserHook.prototype.onParse = function (element, attribute, context) {
                    var view = context.getNearestContextOfType(view_4.View);
                    var parts = attribute.name.split('-');
                    var name = parts[parts.length - 1].match(/\w+/)[0];
                    view.addTemplateVar(name, element);
                };
                return TemplateVariableParserHook;
            }(hooks_4.ParserAttributeHook));
            exports_39("TemplateVariableParserHook", TemplateVariableParserHook);
        }
    }
});
System.register("render/parser/parser", ["core/di/di", "render/parser/dom_parser", "core/component/resolver", "render/parser/hooks/component", "render/parser/hooks/event", "render/parser/hooks/binding", "render/parser/hooks/template_variable"], function(exports_40, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    var di_3, dom_parser_1, resolver_1, component_1, event_1, binding_1, template_variable_1;
    var Parser;
    return {
        setters:[
            function (di_3_1) {
                di_3 = di_3_1;
            },
            function (dom_parser_1_1) {
                dom_parser_1 = dom_parser_1_1;
            },
            function (resolver_1_1) {
                resolver_1 = resolver_1_1;
            },
            function (component_1_1) {
                component_1 = component_1_1;
            },
            function (event_1_1) {
                event_1 = event_1_1;
            },
            function (binding_1_1) {
                binding_1 = binding_1_1;
            },
            function (template_variable_1_1) {
                template_variable_1 = template_variable_1_1;
            }],
        execute: function() {
            Parser = (function () {
                function Parser(resolver) {
                    this._domParser = new dom_parser_1.DOMParser();
                    this._domParser.registerElementHook(new component_1.ComponentParserHook(resolver));
                    this._domParser.registerAttributeHook(new template_variable_1.TemplateVariableParserHook());
                    this._domParser.registerAttributeHook(new event_1.EventParserHook());
                    this._domParser.registerAttributeHook(new binding_1.BindingParserHook());
                }
                Parser.prototype.parse = function (root, context, skipRootElement) {
                    this._domParser.parseTree(root, context, skipRootElement);
                };
                Parser = __decorate([
                    di_3.Injectable(),
                    __param(0, di_3.Inject(di_3.forwardRef(function () { return resolver_1.ComponentResolver; }))), 
                    __metadata('design:paramtypes', [resolver_1.ComponentResolver])
                ], Parser);
                return Parser;
            }());
            exports_40("Parser", Parser);
        }
    }
});
System.register("core/view/factory", [], function(exports_41, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    var ViewFactory;
    return {
        setters:[],
        execute: function() {
            ViewFactory = (function () {
                function ViewFactory(viewType) {
                    this._viewType = viewType;
                }
                ViewFactory.prototype.create = function (element) {
                    var view = new this._viewType(element);
                    return view;
                };
                return ViewFactory;
            }());
            exports_41("ViewFactory", ViewFactory);
        }
    }
});
System.register("core/view/view", ["debug/assert/assert", "render/parser/parser"], function(exports_42, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var assert_2, parser_3;
    var View;
    return {
        setters:[
            function (assert_2_1) {
                assert_2 = assert_2_1;
            },
            function (parser_3_1) {
                parser_3 = parser_3_1;
            }],
        execute: function() {
            View = (function () {
                function View(element, hostElement, cdStatus) {
                    this._templateVars = {};
                    this._rootElement = element;
                    this._hostElement = hostElement;
                    this._parser = this._hostElement.injector.get(parser_3.Parser);
                }
                Object.defineProperty(View.prototype, "rootElement", {
                    get: function () { return this._rootElement; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "hostElement", {
                    get: function () { return this._hostElement; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "templateVars", {
                    get: function () { return this._templateVars; },
                    enumerable: true,
                    configurable: true
                });
                View.prototype.parse = function () {
                    this._parser.parse(this._rootElement, this, true);
                };
                View.prototype.addTemplateVar = function (key, element) {
                    assert_2.assert(!(this._templateVars[key] instanceof Element), "There is already a template variable \"" + key + "\" set on this view!");
                    this._templateVars[key] = element;
                };
                View.prototype.getTemplateVar = function (key, hostLookup) {
                    if (hostLookup === void 0) { hostLookup = true; }
                    var hostView = this.hostElement.getView(-1);
                    var element = this._templateVars[key] || null;
                    if (hostLookup && !(element instanceof Element) && hostView !== this) {
                        element = hostView.getTemplateVar(key);
                    }
                    return element;
                };
                View.prototype.destroy = function () { };
                return View;
            }());
            exports_42("View", View);
        }
    }
});
System.register("core/view/element", [], function(exports_43, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var ElementRef;
    return {
        setters:[],
        execute: function() {
            ElementRef = (function () {
                function ElementRef(nativeElement) {
                    this.nativeElement = nativeElement;
                }
                return ElementRef;
            }());
            exports_43("ElementRef", ElementRef);
        }
    }
});
System.register("core/view/host", ["debug/debug", "utils/utils", "core/view/view", "core/view/element", "core/change_detection/change_detection"], function(exports_44, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
    var debug_10, utils_4, view_5, element_1, change_detection_1;
    var HostElement;
    return {
        setters:[
            function (debug_10_1) {
                debug_10 = debug_10_1;
            },
            function (utils_4_1) {
                utils_4 = utils_4_1;
            },
            function (view_5_1) {
                view_5 = view_5_1;
            },
            function (element_1_1) {
                element_1 = element_1_1;
            },
            function (change_detection_1_1) {
                change_detection_1 = change_detection_1_1;
            }],
        execute: function() {
            HostElement = (function () {
                function HostElement(nativeElement, parent, cdStatus) {
                    this._componentView = null;
                    this._nestedViews = []; // TODO: Implement embedded views
                    this._parent = null;
                    this._children = [];
                    this._cdStatus = change_detection_1.ChangeDetectorStatus.CheckAlways;
                    this._cdDefaultStatus = change_detection_1.ChangeDetectorStatus.CheckAlways;
                    this._nativeElement = nativeElement;
                    this._parent = parent || null;
                    if (typeof cdStatus === 'number') {
                        this._cdStatus = cdStatus;
                        this._cdDefaultStatus = cdStatus;
                    }
                    var iterableDifferFactory = new change_detection_1.IterableDifferFactory();
                    var keyValueDifferFactory = new change_detection_1.KeyValueDifferFactory();
                    if (iterableDifferFactory.supports(this)) {
                        this._iterableDiffer = iterableDifferFactory.create(this);
                    }
                    if (keyValueDifferFactory.supports(this)) {
                        this._keyValueDiffer = keyValueDifferFactory.create(this);
                    }
                }
                Object.defineProperty(HostElement.prototype, "component", {
                    get: function () { return this._component; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HostElement.prototype, "componentView", {
                    get: function () { return this.getView(-1); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HostElement.prototype, "elementRef", {
                    get: function () { return new element_1.ElementRef(this._nativeElement); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HostElement.prototype, "injector", {
                    get: function () { return this._injector; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(HostElement.prototype, "parent", {
                    get: function () { return this._parent; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HostElement.prototype, "cdStatus", {
                    get: function () { return this._cdStatus; },
                    enumerable: true,
                    configurable: true
                });
                HostElement.prototype.initComponent = function (component, injector) {
                    this._component = component;
                    this._injector = injector;
                    var componentView = new view_5.View(this._nativeElement, this);
                    this._componentView = componentView;
                };
                // TODO    
                HostElement.prototype.attachView = function (view, viewIndex) { };
                HostElement.prototype.registerChild = function (childHost) {
                    this._children.push(childHost);
                };
                HostElement.prototype.parseView = function (viewIndex) {
                    if (viewIndex === void 0) { viewIndex = -1; }
                    var view = this.getView(viewIndex);
                    debug_10.assert(view instanceof view_5.View, "No view with index \"" + viewIndex + "\"\" found!");
                    view.parse();
                };
                HostElement.prototype.parse = function () {
                    this.parseView(-1);
                };
                HostElement.prototype.getView = function (viewIndex) {
                    if (viewIndex === void 0) { viewIndex = -1; }
                    return viewIndex === -1 ? this._componentView : this._nestedViews[viewIndex];
                };
                HostElement.prototype.markForCheck = function () { };
                HostElement.prototype.detach = function () {
                    this._cdStatus = change_detection_1.ChangeDetectorStatus.Detached;
                };
                HostElement.prototype.detectChanges = function () {
                    if (this._cdStatus === change_detection_1.ChangeDetectorStatus.Checked || this._cdStatus === change_detection_1.ChangeDetectorStatus.Errored) {
                        return;
                    }
                    if (this._cdStatus === change_detection_1.ChangeDetectorStatus.Destroyed) {
                        return;
                    }
                    if (utils_4.isPresent(this._iterableDiffer)) {
                        var changes = this._iterableDiffer.diff(this.component);
                        if (utils_4.isPresent(changes)) {
                        }
                    }
                    if (utils_4.isPresent(this._keyValueDiffer)) {
                        var changes = this._keyValueDiffer.diff(this.component);
                        if (utils_4.isPresent(changes)) {
                        }
                    }
                    this.detectChildChanges();
                    if (this._cdStatus === change_detection_1.ChangeDetectorStatus.CheckOnce)
                        this._cdStatus = change_detection_1.ChangeDetectorStatus.Checked;
                };
                HostElement.prototype.detectChildChanges = function () {
                    for (var i = 0, max = this._children.length; i < max; i++) {
                        var childHost = this._children[i];
                        if (childHost.cdStatus === change_detection_1.ChangeDetectorStatus.Detached) {
                            continue;
                        }
                        childHost.detectChanges();
                    }
                };
                HostElement.prototype.checkNoChanges = function () { };
                HostElement.prototype.reattach = function () {
                    this._cdStatus = this._cdDefaultStatus;
                    this.markForCheck();
                };
                return HostElement;
            }());
            exports_44("HostElement", HostElement);
        }
    }
});
System.register("core/component/reference", [], function(exports_45, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    var ComponentReference;
    return {
        setters:[],
        execute: function() {
            ComponentReference = (function () {
                function ComponentReference(hostElement, componentType) {
                    this._hostElement = hostElement;
                    this._componentType = componentType;
                }
                Object.defineProperty(ComponentReference.prototype, "hostElement", {
                    get: function () {
                        return this._hostElement;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ComponentReference.prototype, "instance", {
                    get: function () {
                        return this._hostElement.component;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ComponentReference.prototype, "injector", {
                    get: function () {
                        return this._hostElement.injector;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ComponentReference.prototype, "componentType", {
                    get: function () {
                        return this._componentType;
                    },
                    enumerable: true,
                    configurable: true
                });
                ComponentReference.prototype.parse = function () {
                    this._hostElement.parse();
                };
                ComponentReference.prototype.destroy = function () {
                    // TODO!
                };
                return ComponentReference;
            }());
            exports_45("ComponentReference", ComponentReference);
        }
    }
});
System.register("core/component/factory", ["core/component/reference", "core/component/metadata", "core/view/host", "core/view/element", "core/reflect/reflection", "core/di/di"], function(exports_46, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    var reference_1, metadata_6, host_2, element_2, reflection_5, di_4;
    var ComponentFactory;
    return {
        setters:[
            function (reference_1_1) {
                reference_1 = reference_1_1;
            },
            function (metadata_6_1) {
                metadata_6 = metadata_6_1;
            },
            function (host_2_1) {
                host_2 = host_2_1;
            },
            function (element_2_1) {
                element_2 = element_2_1;
            },
            function (reflection_5_1) {
                reflection_5 = reflection_5_1;
            },
            function (di_4_1) {
                di_4 = di_4_1;
            }],
        execute: function() {
            ComponentFactory = (function () {
                function ComponentFactory(componentType) {
                    this._componentType = componentType;
                }
                Object.defineProperty(ComponentFactory.prototype, "componentType", {
                    get: function () { return this._componentType; },
                    enumerable: true,
                    configurable: true
                });
                ComponentFactory.prototype.create = function (injector, nativeElement) {
                    var _this = this;
                    var metadata = reflection_5.ClassReflection.peek(this._componentType).annotations.get(metadata_6.ComponentMetadata);
                    var parentHostElement = injector.get(host_2.HostElement);
                    var hostElement = new host_2.HostElement(nativeElement, parentHostElement);
                    if (parentHostElement instanceof host_2.HostElement) {
                        parentHostElement.registerChild(hostElement);
                    }
                    var providers = Array.isArray(metadata.providers) ? metadata.providers : [];
                    providers = providers.concat([
                        di_4.provide(element_2.ElementRef, { useValue: hostElement.elementRef }),
                        di_4.provide(host_2.HostElement, { useValue: hostElement }),
                        di_4.provide(hostElement, { useClass: di_4.forwardRef(function () { return _this._componentType; }) })
                    ]);
                    var inj = injector.resolveAndCreateChild(providers);
                    var component = inj.get(hostElement);
                    hostElement.initComponent(component, inj);
                    var ref = new reference_1.ComponentReference(hostElement, this._componentType);
                    return ref;
                };
                return ComponentFactory;
            }());
            exports_46("ComponentFactory", ComponentFactory);
        }
    }
});
System.register("core/component/component", ["core/component/decorators", "core/component/factory", "core/component/metadata", "core/component/reference", "core/component/resolver"], function(exports_47, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
    function exportStar_2(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_47(exports);
    }
    return {
        setters:[
            function (decorators_4_1) {
                exportStar_2(decorators_4_1);
            },
            function (factory_2_1) {
                exportStar_2(factory_2_1);
            },
            function (metadata_7_1) {
                exportStar_2(metadata_7_1);
            },
            function (reference_2_1) {
                exportStar_2(reference_2_1);
            },
            function (resolver_2_1) {
                exportStar_2(resolver_2_1);
            }],
        execute: function() {
        }
    }
});
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * Modified by Thomas Pink for the usage in Mojito
 */
System.register("core/zone/zone", ["debug/debug", "core/async/events"], function(exports_48, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    var debug_11, events_2;
    var ZoneWrapper, ZoneService;
    return {
        setters:[
            function (debug_11_1) {
                debug_11 = debug_11_1;
            },
            function (events_2_1) {
                events_2 = events_2_1;
            }],
        execute: function() {
            ZoneWrapper = (function () {
                function ZoneWrapper(_a) {
                    var _this = this;
                    var onEnter = _a.onEnter, onLeave = _a.onLeave, setMicrotask = _a.setMicrotask, setMacrotask = _a.setMacrotask, onError = _a.onError;
                    this._onEnter = onEnter || function () { };
                    this._onLeave = onLeave || function () { };
                    this._setMicrotask = setMicrotask || function (hasMicrotasks) { };
                    this._setMacrotask = setMacrotask || function (hasMacrotasks) { };
                    debug_11.assert(!!Zone, "Mojito requires zone.js. Please install and provide it!");
                    this._outerZone = Zone.current;
                    this._innerZone = this._outerZone.fork({
                        name: 'mojito',
                        properties: { 'isMojitoZone': true },
                        onInvokeTask: function (delegate, current, target, task, applyThis, applyArgs) {
                            try {
                                _this._onEnter();
                                return delegate.invokeTask(target, task, applyThis, applyArgs);
                            }
                            finally {
                                _this._onLeave();
                            }
                        },
                        onInvoke: function (delegate, current, target, callback, applyThis, applyArgs, source) {
                            try {
                                _this._onEnter();
                                return delegate.invoke(target, callback, applyThis, applyArgs, source);
                            }
                            finally {
                                _this._onLeave();
                            }
                        },
                        onHasTask: function (delegate, current, target, hasTaskState) {
                            delegate.hasTask(target, hasTaskState);
                            if (current == target) {
                                if (hasTaskState.change == 'microTask') {
                                    _this._setMicrotask(hasTaskState.microTask);
                                }
                                else if (hasTaskState.change == 'macroTask') {
                                    _this._setMacrotask(hasTaskState.macroTask);
                                }
                            }
                        },
                        onHandleError: function (delegate, current, target, error) {
                            delegate.handleError(target, error);
                            _this._onError(error);
                            return false;
                        }
                    });
                }
                ZoneWrapper.prototype.runInner = function (fn) { return this._innerZone.run(fn); };
                ;
                ZoneWrapper.prototype.runInnerGuarded = function (fn) { return this._innerZone.runGuarded(fn); };
                ;
                ZoneWrapper.prototype.runOuter = function (fn) { return this._outerZone.run(fn); };
                ;
                return ZoneWrapper;
            }());
            exports_48("ZoneWrapper", ZoneWrapper);
            ZoneService = (function () {
                function ZoneService() {
                    var _this = this;
                    this._nestedLevel = 0;
                    this._hasPendingMicrotasks = false;
                    this._hasPendingMacrotasks = false;
                    this._isStable = true;
                    this._onUnstable = new events_2.EventEmitter();
                    this._onMicrotaskEmpty = new events_2.EventEmitter();
                    this._onStable = new events_2.EventEmitter();
                    this._onErrorEvents = new events_2.EventEmitter();
                    this._zoneWrapper = new ZoneWrapper({
                        onEnter: function () {
                            _this._nestedLevel++;
                            if (_this._isStable) {
                                _this._isStable = false;
                                _this._onUnstable.emit(null);
                            }
                        },
                        onLeave: function () {
                            _this._nestedLevel--;
                            _this._checkStable();
                        },
                        setMicrotask: function (hasMicrotasks) {
                            _this._hasPendingMicrotasks = hasMicrotasks;
                            _this._checkStable();
                        },
                        setMacrotask: function (hasMacrotasks) { _this._hasPendingMacrotasks = hasMacrotasks; },
                        onError: function (error) { return _this._onErrorEvents.emit(error); }
                    });
                }
                ZoneService.prototype._checkStable = function () {
                    var _this = this;
                    if (this._nestedLevel == 0) {
                        if (!this._hasPendingMicrotasks && !this._isStable) {
                            try {
                                this._nestedLevel++;
                                this._onMicrotaskEmpty.emit(null);
                            }
                            finally {
                                this._nestedLevel--;
                                if (!this._hasPendingMicrotasks) {
                                    try {
                                        this.runOutsideMojito(function () { return _this._onStable.emit(null); });
                                    }
                                    finally {
                                        this._isStable = true;
                                    }
                                }
                            }
                        }
                    }
                };
                Object.defineProperty(ZoneService.prototype, "onUnstable", {
                    /**
                     * Notifies when code enters Angular Zone. This gets fired first on VM Turn.
                     */
                    get: function () { return this._onUnstable; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZoneService.prototype, "onMicrotaskEmpty", {
                    /**
                     * Notifies when there is no more microtasks enqueue in the current VM Turn.
                     * This is a hint for Angular to do change detection, which may enqueue more microtasks.
                     * For this reason this event can fire multiple times per VM Turn.
                     */
                    get: function () { return this._onMicrotaskEmpty; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZoneService.prototype, "onStable", {
                    /**
                     * Notifies when the last `onMicrotaskEmpty` has run and there are no more microtasks, which
                     * implies we are about to relinquish VM turn.
                     * This event gets called just once.
                     */
                    get: function () { return this._onStable; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZoneService.prototype, "onError", {
                    /**
                     * Notify that an error has been delivered.
                     */
                    get: function () { return this._onErrorEvents; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZoneService.prototype, "isStable", {
                    /**
                     * Whether there are no outstanding microtasks or microtasks.
                     */
                    get: function () { return this._isStable; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZoneService.prototype, "hasPendingMicrotasks", {
                    /**
                     * Whether there are any outstanding microtasks.
                     */
                    get: function () { return this._hasPendingMicrotasks; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZoneService.prototype, "hasPendingMacrotasks", {
                    /**
                     * Whether there are any outstanding microtasks.
                     */
                    get: function () { return this._hasPendingMacrotasks; },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Executes the `fn` function synchronously within the Angular zone and returns value returned by
                 * the function.
                 *
                 * Running functions via `run` allows you to reenter Angular zone from a task that was executed
                 * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
                 *
                 * Any future tasks or microtasks scheduled from within this function will continue executing from
                 * within the Angular zone.
                 *
                 * If a synchronous error happens it will be rethrown and not reported via `onError`.
                 */
                ZoneService.prototype.run = function (fn) { return this._zoneWrapper.runInner(fn); };
                /**
                 * Same as #run, except that synchronous errors are caught and forwarded
                 * via `onError` and not rethrown.
                 */
                ZoneService.prototype.runGuarded = function (fn) { return this._zoneWrapper.runInnerGuarded(fn); };
                /**
                 * Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
                 * the function.
                 *
                 * Running functions via `runOutsideAngular` allows you to escape Angular's zone and do work that
                 * doesn't trigger Angular change-detection or is subject to Angular's error handling.
                 *
                 * Any future tasks or microtasks scheduled from within this function will continue executing from
                 * outside of the Angular zone.
                 *
                 * Use {@link #run} to reenter the Angular zone and do work that updates the application model.
                 */
                ZoneService.prototype.runOutsideMojito = function (fn) { return this._zoneWrapper.runOuter(fn); };
                return ZoneService;
            }());
            exports_48("ZoneService", ZoneService);
        }
    }
});
System.register("core/application/application", ["debug/debug", "utils/utils", "core/di/di", "core/component/component", "core/reflect/reflection", "render/parser/parser", "core/zone/zone"], function(exports_49, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    var debug_12, utils_5, di_5, component_2, reflection_6, parser_4, zone_1;
    var DEFAULT_PROVIDERS, Application;
    function bootstrap(appComponentType, customProviders, root) {
        if (customProviders === void 0) { customProviders = []; }
        if (root === void 0) { root = document.body; }
        if (customProviders instanceof Element) {
            root = customProviders;
            customProviders = [];
        }
        debug_12.assert(root instanceof Element, 'Root has to be an Element!', TypeError);
        debug_12.assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);
        var rootInjector = di_5.Injector.resolveAndCreate(DEFAULT_PROVIDERS.concat(customProviders));
        var app = new Application(rootInjector);
        app.bootstrap(appComponentType, root);
        return app;
    }
    exports_49("bootstrap", bootstrap);
    return {
        setters:[
            function (debug_12_1) {
                debug_12 = debug_12_1;
            },
            function (utils_5_1) {
                utils_5 = utils_5_1;
            },
            function (di_5_1) {
                di_5 = di_5_1;
            },
            function (component_2_1) {
                component_2 = component_2_1;
            },
            function (reflection_6_1) {
                reflection_6 = reflection_6_1;
            },
            function (parser_4_1) {
                parser_4 = parser_4_1;
            },
            function (zone_1_1) {
                zone_1 = zone_1_1;
            }],
        execute: function() {
            exports_49("DEFAULT_PROVIDERS", DEFAULT_PROVIDERS = [
                new di_5.Provider(component_2.ComponentResolver, { useClass: component_2.ComponentResolver }),
                new di_5.Provider(parser_4.Parser, { useClass: parser_4.Parser }),
                new di_5.Provider(zone_1.ZoneService, { useClass: zone_1.ZoneService })
            ]);
            Application = (function () {
                function Application(injector) {
                    var _this = this;
                    this._runningTick = false;
                    this._injector = injector;
                    var zoneService = this._zoneService = this._injector.get(zone_1.ZoneService);
                    zoneService.onMicrotaskEmpty.subscribe(function () { zoneService.run(function () { _this.tick(); }); });
                    zoneService.onError.subscribe(function (error) { throw error; });
                }
                Object.defineProperty(Application.prototype, "injector", {
                    get: function () { return this._injector; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Application.prototype, "appComponent", {
                    get: function () { return this._appComponent; },
                    enumerable: true,
                    configurable: true
                });
                Application.prototype.bootstrap = function (componentOrFactory, root) {
                    var _this = this;
                    if (root === void 0) { root = document.body; }
                    this._zoneService.run(function () {
                        var componentFactory;
                        if (componentOrFactory instanceof component_2.ComponentFactory) {
                            componentFactory = componentOrFactory;
                        }
                        else {
                            var componentResolver = _this._injector.get(component_2.ComponentResolver);
                            componentFactory = componentResolver.resolveComponent(componentOrFactory);
                        }
                        var metadata = reflection_6.ClassReflection.peek(componentFactory.componentType).annotations.get(component_2.ComponentMetadata);
                        debug_12.assert(metadata instanceof component_2.ComponentMetadata, "The class \"" + utils_5.stringify(componentFactory.componentType) + "\" has no metadata defined in the @Component decorator.");
                        var element;
                        var selector = metadata.selector;
                        debug_12.assert(!!(typeof selector === 'string' && selector.length), "The class \"" + utils_5.stringify(componentFactory.componentType) + "\" has no selector defined in the @Component metadata object.");
                        if (utils_5.doesSelectorMatchElement(selector, root)) {
                            element = root;
                        }
                        else {
                            var elements = root.querySelectorAll(selector);
                            debug_12.assert(!!elements.length, "We could not find an element matching the selector \"" + selector + "\" of the \"" + utils_5.stringify(componentFactory.componentType) + "\" component provided to the bootstrap function");
                            debug_12.assert(elements.length === 1, "There are more than one elements matching the selector \"" + selector + "\" of the \"" + utils_5.stringify(componentFactory.componentType) + "\" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!");
                            element = elements[0];
                        }
                        var appRef = _this._appComponent = componentFactory.create(_this._injector, element);
                        appRef.parse();
                    });
                };
                Application.prototype.tick = function () {
                    debug_12.assert(!this._runningTick, "Tick is already running. You may call tick recursivly!");
                    this._runningTick = true;
                    debug_12.assert(!!this._appComponent, "Please call \"bootstrap\" before the first tick!");
                    this._appComponent.hostElement.detectChanges();
                    this._runningTick = false;
                };
                return Application;
            }());
            exports_49("Application", Application);
        }
    }
});
System.register("core/lifecycle/lifecycle_hooks", [], function(exports_50, context_51) {
    "use strict";
    var __moduleName = context_51 && context_51.id;
    var LifecycleHooks, OnInit, OnChanges, OnRender, OnDestroy;
    return {
        setters:[],
        execute: function() {
            (function (LifecycleHooks) {
                LifecycleHooks[LifecycleHooks["OnInit"] = 0] = "OnInit";
                LifecycleHooks[LifecycleHooks["OnChanges"] = 1] = "OnChanges";
                LifecycleHooks[LifecycleHooks["OnRender"] = 2] = "OnRender";
                LifecycleHooks[LifecycleHooks["OnDestroy"] = 3] = "OnDestroy";
            })(LifecycleHooks || (LifecycleHooks = {}));
            exports_50("LifecycleHooks", LifecycleHooks);
            OnInit = (function () {
                function OnInit() {
                }
                return OnInit;
            }());
            exports_50("OnInit", OnInit);
            OnChanges = (function () {
                function OnChanges() {
                }
                return OnChanges;
            }());
            exports_50("OnChanges", OnChanges);
            OnRender = (function () {
                function OnRender() {
                }
                return OnRender;
            }());
            exports_50("OnRender", OnRender);
            OnDestroy = (function () {
                function OnDestroy() {
                }
                return OnDestroy;
            }());
            exports_50("OnDestroy", OnDestroy);
        }
    }
});
System.register("core/core", ["core/application/application", "core/lifecycle/lifecycle_hooks", "core/component/decorators", "core/view/element", "core/view/host", "core/di/di", "core/async/events"], function(exports_51, context_52) {
    "use strict";
    var __moduleName = context_52 && context_52.id;
    var exportedNames_1 = {
        'bootstrap': true,
        'Application': true,
        'Component': true,
        'Input': true,
        'Output': true,
        'ElementRef': true,
        'HostElement': true,
        'EventEmitter': true
    };
    function exportStar_3(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default"&& !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_51(exports);
    }
    return {
        setters:[
            function (application_1_1) {
                exports_51({
                    "bootstrap": application_1_1["bootstrap"],
                    "Application": application_1_1["Application"]
                });
            },
            function (lifecycle_hooks_1_1) {
                exportStar_3(lifecycle_hooks_1_1);
            },
            function (decorators_5_1) {
                exports_51({
                    "Component": decorators_5_1["Component"],
                    "Input": decorators_5_1["Input"],
                    "Output": decorators_5_1["Output"]
                });
            },
            function (element_3_1) {
                exports_51({
                    "ElementRef": element_3_1["ElementRef"]
                });
            },
            function (host_3_1) {
                exports_51({
                    "HostElement": host_3_1["HostElement"]
                });
            },
            function (di_6_1) {
                exportStar_3(di_6_1);
            },
            function (events_ts_1_1) {
                exports_51({
                    "EventEmitter": events_ts_1_1["EventEmitter"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("mojito", ["debug/debug", "utils/utils", "core/core"], function(exports_52, context_53) {
    "use strict";
    var __moduleName = context_53 && context_53.id;
    function exportStar_4(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_52(exports);
    }
    return {
        setters:[
            function (debug_13_1) {
                exportStar_4(debug_13_1);
            },
            function (utils_ts_1_1) {
                exportStar_4(utils_ts_1_1);
            },
            function (core_1_1) {
                exportStar_4(core_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qaXRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliL2RlYnVnL2Fzc2VydC9hc3NlcnQudHMiLCJsaWIvZGVidWcvbG9nZ2VyL2xvZ2dlci50cyIsImxpYi9kZWJ1Zy9kZWJ1Zy50cyIsImxpYi91dGlscy9jbGFzcy9jbGFzcy50cyIsImxpYi91dGlscy9sYW5nL2xhbmcudHMiLCJsaWIvdXRpbHMvZG9tL2RvbS50cyIsImxpYi91dGlscy9zdHJpbmcvZW5kc3dpdGgudHMiLCJsaWIvdXRpbHMvc3RyaW5nL2tlYmFiLnRzIiwibGliL3V0aWxzL3N0cmluZy9zdHJpbmdpZnkudHMiLCJsaWIvdXRpbHMvdXRpbHMudHMiLCJsaWIvY29yZS9pdGVyYXRvci9pdGVyYXRvci50cyIsImxpYi9jb3JlL21hcC9tYXAudHMiLCJsaWIvY29yZS9yZWZsZWN0L3JlZmxlY3Rpb24udHMiLCJsaWIvY29yZS9kaS9tZXRhZGF0YS50cyIsImxpYi9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdG9yLnRzIiwibGliL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9kaWZmZXJzL2l0ZXJhYmxlLnRzIiwibGliL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9kaWZmZXJzL2tleXZhbHVlLnRzIiwibGliL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jb25zdGFudHMudHMiLCJsaWIvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NoYW5nZV9kZXRlY3Rpb24udHMiLCJsaWIvY29yZS9jb21wb25lbnQvbWV0YWRhdGEudHMiLCJsaWIvY29yZS9kaXJlY3RpdmUvcmVnaXN0cnkudHMiLCJsaWIvY29yZS9kZWNvcmF0b3JzL2RlY29yYXRvcnMudHMiLCJsaWIvY29yZS9kaS9kZWNvcmF0b3JzLnRzIiwibGliL2NvcmUvZGkvZm9yd2FyZF9yZWYudHMiLCJsaWIvY29yZS9kaS9wcm92aWRlci50cyIsImxpYi9jb3JlL2RpL2luamVjdG9yLnRzIiwibGliL2NvcmUvZGkvZGkudHMiLCJsaWIvY29yZS9jb21wb25lbnQvZGVjb3JhdG9ycy50cyIsImxpYi9yZW5kZXIvcGFyc2VyL2NvbnRleHQudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9kb21fcGFyc2VyLnRzIiwibGliL2NvcmUvY29tcG9uZW50L3Jlc29sdmVyLnRzIiwibGliL3JlbmRlci9wYXJzZXIvaG9va3MvaG9va3MudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9ob29rcy9jb21wb25lbnQudHMiLCJsaWIvY29yZS9hc3luYy9ldmVudHMudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9leHByZXNzaW9uX3BhcnNlci9leGVjdXRhYmxlLnRzIiwibGliL3JlbmRlci9wYXJzZXIvZXhwcmVzc2lvbl9wYXJzZXIvcGFyc2VyLnRzIiwibGliL3JlbmRlci9wYXJzZXIvaG9va3MvZXZlbnQudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9ob29rcy9iaW5kaW5nLnRzIiwibGliL3JlbmRlci9wYXJzZXIvaG9va3MvdGVtcGxhdGVfdmFyaWFibGUudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9wYXJzZXIudHMiLCJsaWIvY29yZS92aWV3L2ZhY3RvcnkudHMiLCJsaWIvY29yZS92aWV3L3ZpZXcudHMiLCJsaWIvY29yZS92aWV3L2VsZW1lbnQudHMiLCJsaWIvY29yZS92aWV3L2hvc3QudHMiLCJsaWIvY29yZS9jb21wb25lbnQvcmVmZXJlbmNlLnRzIiwibGliL2NvcmUvY29tcG9uZW50L2ZhY3RvcnkudHMiLCJsaWIvY29yZS9jb21wb25lbnQvY29tcG9uZW50LnRzIiwibGliL2NvcmUvem9uZS96b25lLnRzIiwibGliL2NvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24udHMiLCJsaWIvY29yZS9saWZlY3ljbGUvbGlmZWN5Y2xlX2hvb2tzLnRzIiwibGliL2NvcmUvY29yZS50cyIsImxpYi9tb2ppdG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7OztPQU9HO0lBQ0gsZ0JBQXVCLFNBQWtC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