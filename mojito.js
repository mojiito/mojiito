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
System.register("core/component/metadata", ["debug/debug", "utils/string/stringify", "core/di/metadata"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
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
            exports_15("DirectiveMetadata", DirectiveMetadata);
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
                    var _b = _a === void 0 ? {} : _a, selector = _b.selector, inputs = _b.inputs, outputs = _b.outputs, host = _b.host, providers = _b.providers, templateUrl = _b.templateUrl, template = _b.template, styleUrls = _b.styleUrls, styles = _b.styles;
                    _super.call(this, { selector: selector, inputs: inputs, outputs: outputs, host: host, providers: providers });
                    this.templateUrl = templateUrl;
                    this.template = template;
                    this.styles = styles;
                    this.styleUrls = styleUrls;
                }
                ComponentMetadata.prototype.toString = function () { return "@ComponentMetadata()"; };
                return ComponentMetadata;
            }(DirectiveMetadata));
            exports_15("ComponentMetadata", ComponentMetadata);
            InputMetadata = (function () {
                function InputMetadata(bindingPropertyName) {
                    this.bindingPropertyName = bindingPropertyName;
                }
                InputMetadata.prototype.toString = function () { return "@InputMetadata(" + stringify_3.stringify(this.bindingPropertyName) + ")"; };
                return InputMetadata;
            }());
            exports_15("InputMetadata", InputMetadata);
            OutputMetadata = (function () {
                function OutputMetadata(bindingPropertyName) {
                    this.bindingPropertyName = bindingPropertyName;
                }
                OutputMetadata.prototype.toString = function () { return "@OutputMetadata(" + stringify_3.stringify(this.bindingPropertyName) + ")"; };
                return OutputMetadata;
            }());
            exports_15("OutputMetadata", OutputMetadata);
        }
    }
});
System.register("core/directive/registry", [], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
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
            exports_16("DirectiveRegistry", DirectiveRegistry);
        }
    }
});
System.register("core/decorators/decorators", ["core/reflect/reflection", "core/directive/registry"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
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
    exports_17("createClassDecorator", createClassDecorator);
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
    exports_17("createParameterDecorator", createParameterDecorator);
    function createPropertyDecoratory(metadataClass) {
        return function (objOrType) {
            return function (target, propertyKey) {
                reflection_1.ClassReflection.peek(target.constructor).properties.set(propertyKey, new metadataClass(objOrType || propertyKey));
            };
        };
    }
    exports_17("createPropertyDecoratory", createPropertyDecoratory);
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
System.register("core/di/decorators", ["core/decorators/decorators", "core/di/metadata"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
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
            exports_18("Injectable", Injectable = decorators_1.createClassDecorator(metadata_2.InjectableMetadata));
            exports_18("Inject", Inject = decorators_1.createParameterDecorator(metadata_2.InjectMetadata));
        }
    }
});
System.register("core/di/forward_ref", ["utils/string/stringify"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
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
    exports_19("forwardRef", forwardRef);
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
    exports_19("resolveForwardRef", resolveForwardRef);
    return {
        setters:[
            function (stringify_4_1) {
                stringify_4 = stringify_4_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/di/provider", ["core/reflect/reflection", "core/di/metadata", "core/di/forward_ref", "debug/debug", "utils/string/stringify"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
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
    exports_20("provide", provide);
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
    exports_20("resolveProviders", resolveProviders);
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
    exports_20("resolveProvider", resolveProvider);
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
    exports_20("resolveFactory", resolveFactory);
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
        if (Array.isArray(dependencyTokens)) {
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
    exports_20("dependenciesForClass", dependenciesForClass);
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
            exports_20("Provider", Provider);
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
            exports_20("ResolvedProvider", ResolvedProvider);
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
            exports_20("ResolvedFactory", ResolvedFactory);
        }
    }
});
System.register("core/di/injector", ["core/map/map", "core/di/provider", "core/di/forward_ref", "debug/debug", "utils/string/stringify"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
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
            exports_21("Injector", Injector);
        }
    }
});
/**
 * Mojito's dependency injection basically a simpler version of Angular's DI.
 * All the credits and respect to the Angular team.
 *
 * TODO: Insert stuff...
 */
System.register("core/di/di", ["core/di/decorators", "core/di/injector", "core/di/provider", "core/di/forward_ref"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    return {
        setters:[
            function (decorators_2_1) {
                exports_22({
                    "Injectable": decorators_2_1["Injectable"],
                    "Inject": decorators_2_1["Inject"]
                });
            },
            function (injector_1_1) {
                exports_22({
                    "Injector": injector_1_1["Injector"]
                });
            },
            function (provider_2_1) {
                exports_22({
                    "Provider": provider_2_1["Provider"],
                    "ResolvedProvider": provider_2_1["ResolvedProvider"],
                    "provide": provider_2_1["provide"]
                });
            },
            function (forward_ref_3_1) {
                exports_22({
                    "forwardRef": forward_ref_3_1["forwardRef"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("core/component/decorators", ["core/decorators/decorators", "core/component/metadata"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
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
            exports_23("Component", Component = decorators_3.createClassDecorator(metadata_4.ComponentMetadata));
            exports_23("Input", Input = decorators_3.createPropertyDecoratory(metadata_4.InputMetadata));
            exports_23("Output", Output = decorators_3.createPropertyDecoratory(metadata_4.OutputMetadata));
        }
    }
});
System.register("render/parser/context", [], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
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
            exports_24("ContextReference", ContextReference);
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
            exports_24("ContextTree", ContextTree);
        }
    }
});
System.register("render/parser/dom_parser", ["debug/debug", "core/di/di", "render/parser/context"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var debug_7, di_1, context_26;
    var DOMParser;
    return {
        setters:[
            function (debug_7_1) {
                debug_7 = debug_7_1;
            },
            function (di_1_1) {
                di_1 = di_1_1;
            },
            function (context_26_1) {
                context_26 = context_26_1;
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
                    this.parseNode(rootElement, new context_26.ContextTree(context), skipRootElement);
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
            exports_25("DOMParser", DOMParser);
        }
    }
});
System.register("core/component/resolver", ["core/di/di", "core/component/factory", "core/reflect/reflection"], function(exports_26, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
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
            exports_26("ComponentResolver", ComponentResolver);
        }
    }
});
System.register("render/parser/hooks/hooks", [], function(exports_27, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var ParserElementHook, ParserAttributeHook;
    return {
        setters:[],
        execute: function() {
            ParserElementHook = (function () {
                function ParserElementHook() {
                }
                return ParserElementHook;
            }());
            exports_27("ParserElementHook", ParserElementHook);
            ParserAttributeHook = (function () {
                function ParserAttributeHook() {
                    this.removeAttributeNode = false;
                }
                return ParserAttributeHook;
            }());
            exports_27("ParserAttributeHook", ParserAttributeHook);
        }
    }
});
System.register("render/parser/hooks/component", ["debug/debug", "utils/string/stringify", "render/parser/hooks/hooks", "utils/dom/dom", "core/directive/registry", "core/view/view", "core/view/host"], function(exports_28, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
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
            exports_28("ComponentParserHook", ComponentParserHook);
        }
    }
});
System.register("core/async/events", [], function(exports_29, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
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
            exports_29("EventEmitter", EventEmitter);
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
            exports_29("EventSubscription", EventSubscription);
        }
    }
});
System.register("render/parser/expression_parser/executable", [], function(exports_30, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
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
            exports_30("Executable", Executable);
        }
    }
});
System.register("render/parser/expression_parser/parser", ["render/parser/expression_parser/executable"], function(exports_31, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
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
            exports_31("ExpressionParser", ExpressionParser);
        }
    }
});
System.register("render/parser/hooks/event", ["debug/debug", "render/parser/hooks/hooks", "core/view/view", "core/reflect/reflection", "core/component/metadata", "core/async/events", "render/parser/expression_parser/parser"], function(exports_32, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
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
            exports_32("EventParserHook", EventParserHook);
        }
    }
});
System.register("render/parser/hooks/binding", ["render/parser/hooks/hooks", "core/view/view", "render/parser/expression_parser/parser"], function(exports_33, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
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
                    console.log(bindingName);
                };
                return BindingParserHook;
            }(hooks_3.ParserAttributeHook));
            exports_33("BindingParserHook", BindingParserHook);
        }
    }
});
System.register("render/parser/hooks/template_variable", ["render/parser/hooks/hooks", "core/view/view"], function(exports_34, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
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
            exports_34("TemplateVariableParserHook", TemplateVariableParserHook);
        }
    }
});
System.register("render/parser/parser", ["core/di/di", "render/parser/dom_parser", "core/component/resolver", "render/parser/hooks/component", "render/parser/hooks/event", "render/parser/hooks/binding", "render/parser/hooks/template_variable"], function(exports_35, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
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
            exports_35("Parser", Parser);
        }
    }
});
System.register("core/view/factory", [], function(exports_36, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
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
            exports_36("ViewFactory", ViewFactory);
        }
    }
});
System.register("core/change_detection/change_detector", [], function(exports_37, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var ChangeDetector;
    return {
        setters:[],
        execute: function() {
            ChangeDetector = (function () {
                function ChangeDetector() {
                }
                return ChangeDetector;
            }());
            exports_37("ChangeDetector", ChangeDetector);
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
System.register("core/change_detection/constants", ["utils/utils"], function(exports_38, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var utils_1;
    var ChangeDetectionStrategy, ChangeDetectorStatus, CHANGE_DETECTION_STRATEGY_VALUES, CHANGE_DETECTOR_STATUS_VALUES;
    function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
        return utils_1.isBlank(changeDetectionStrategy) ||
            changeDetectionStrategy === ChangeDetectionStrategy.Default;
    }
    exports_38("isDefaultChangeDetectionStrategy", isDefaultChangeDetectionStrategy);
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
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
            exports_38("ChangeDetectionStrategy", ChangeDetectionStrategy);
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
            exports_38("ChangeDetectorStatus", ChangeDetectorStatus);
            /**
             * List of possible {@link ChangeDetectionStrategy} values.
             */
            exports_38("CHANGE_DETECTION_STRATEGY_VALUES", CHANGE_DETECTION_STRATEGY_VALUES = [
                ChangeDetectionStrategy.OnPush,
                ChangeDetectionStrategy.Default,
            ]);
            /**
             * List of possible {@link ChangeDetectorStatus} values.
             */
            exports_38("CHANGE_DETECTOR_STATUS_VALUES", CHANGE_DETECTOR_STATUS_VALUES = [
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
System.register("core/change_detection/change_detection", ["core/change_detection/change_detector", "core/change_detection/constants"], function(exports_39, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    return {
        setters:[
            function (change_detector_1_1) {
                exports_39({
                    "ChangeDetector": change_detector_1_1["ChangeDetector"]
                });
            },
            function (constants_1_1) {
                exports_39({
                    "CHANGE_DETECTION_STRATEGY_VALUES": constants_1_1["CHANGE_DETECTION_STRATEGY_VALUES"],
                    "CHANGE_DETECTOR_STATUS_VALUES": constants_1_1["CHANGE_DETECTOR_STATUS_VALUES"],
                    "ChangeDetectionStrategy": constants_1_1["ChangeDetectionStrategy"],
                    "ChangeDetectorStatus": constants_1_1["ChangeDetectorStatus"]
                });
            }],
        execute: function() {
        }
    }
});
// export const defaultIterableDiffers = /*@ts2dart_const*/ new IterableDiffers(iterableDiff);
// export const defaultKeyValueDiffers = /*@ts2dart_const*/ new KeyValueDiffers(keyValDiff); 
System.register("core/view/view", ["debug/assert/assert", "render/parser/parser"], function(exports_40, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
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
            exports_40("View", View);
        }
    }
});
System.register("core/view/element", [], function(exports_41, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
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
            exports_41("ElementRef", ElementRef);
        }
    }
});
System.register("core/view/host", ["debug/debug", "core/view/view", "core/view/element", "core/change_detection/change_detection"], function(exports_42, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var debug_10, view_5, element_1, change_detection_1;
    var HostElement;
    return {
        setters:[
            function (debug_10_1) {
                debug_10 = debug_10_1;
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
                HostElement.prototype.markForCheck = function () {
                };
                HostElement.prototype.detach = function () { };
                HostElement.prototype.detectChanges = function () {
                    if (this._cdStatus === change_detection_1.ChangeDetectorStatus.Checked || this._cdStatus === change_detection_1.ChangeDetectorStatus.Errored) {
                        return;
                    }
                    if (this._cdStatus === change_detection_1.ChangeDetectorStatus.Destroyed) {
                        return;
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
                };
                return HostElement;
            }());
            exports_42("HostElement", HostElement);
        }
    }
});
System.register("core/component/reference", [], function(exports_43, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
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
            exports_43("ComponentReference", ComponentReference);
        }
    }
});
System.register("core/component/factory", ["core/component/reference", "core/component/metadata", "core/view/host", "core/view/element", "core/reflect/reflection", "core/di/di"], function(exports_44, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
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
                    var parentHostElement = injector.get(host_2.HostElement);
                    var hostElement = new host_2.HostElement(nativeElement, parentHostElement);
                    if (parentHostElement instanceof host_2.HostElement) {
                        parentHostElement.registerChild(hostElement);
                    }
                    var metadata = reflection_5.ClassReflection.peek(this._componentType).annotations.get(metadata_6.ComponentMetadata);
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
            exports_44("ComponentFactory", ComponentFactory);
        }
    }
});
System.register("core/component/component", ["core/component/decorators", "core/component/factory", "core/component/metadata", "core/component/reference", "core/component/resolver"], function(exports_45, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    function exportStar_2(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_45(exports);
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
System.register("core/application/application", ["debug/debug", "utils/utils", "core/di/di", "core/component/component", "core/reflect/reflection", "render/parser/parser"], function(exports_46, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    var debug_11, utils_2, di_5, component_2, reflection_6, parser_4;
    var DEFAULT_PROVIDERS, Application;
    function bootstrap(appComponentType, customProviders, root) {
        if (customProviders === void 0) { customProviders = []; }
        if (root === void 0) { root = document.body; }
        if (customProviders instanceof Element) {
            root = customProviders;
            customProviders = [];
        }
        debug_11.assert(root instanceof Element, 'Root has to be an Element!', TypeError);
        debug_11.assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);
        var rootInjector = di_5.Injector.resolveAndCreate(DEFAULT_PROVIDERS.concat(customProviders));
        var app = new Application(rootInjector);
        app.bootstrap(appComponentType, root);
        return app;
    }
    exports_46("bootstrap", bootstrap);
    return {
        setters:[
            function (debug_11_1) {
                debug_11 = debug_11_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
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
            }],
        execute: function() {
            exports_46("DEFAULT_PROVIDERS", DEFAULT_PROVIDERS = [
                new di_5.Provider(component_2.ComponentResolver, { useClass: component_2.ComponentResolver }),
                new di_5.Provider(parser_4.Parser, { useClass: parser_4.Parser })
            ]);
            Application = (function () {
                function Application(injector) {
                    this._injector = injector;
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
                    if (root === void 0) { root = document.body; }
                    var componentFactory;
                    if (componentOrFactory instanceof component_2.ComponentFactory) {
                        componentFactory = componentOrFactory;
                    }
                    else {
                        var componentResolver = this._injector.get(component_2.ComponentResolver);
                        componentFactory = componentResolver.resolveComponent(componentOrFactory);
                    }
                    var metadata = reflection_6.ClassReflection.peek(componentFactory.componentType).annotations.get(component_2.ComponentMetadata);
                    debug_11.assert(metadata instanceof component_2.ComponentMetadata, "The class \"" + utils_2.stringify(componentFactory.componentType) + "\" has no metadata defined in the @Component decorator.");
                    var element;
                    var selector = metadata.selector;
                    debug_11.assert(!!(typeof selector === 'string' && selector.length), "The class \"" + utils_2.stringify(componentFactory.componentType) + "\" has no selector defined in the @Component metadata object.");
                    if (utils_2.doesSelectorMatchElement(selector, root)) {
                        element = root;
                    }
                    else {
                        var elements = root.querySelectorAll(selector);
                        debug_11.assert(!!elements.length, "We could not find an element matching the selector \"" + selector + "\" of the \"" + utils_2.stringify(componentFactory.componentType) + "\" component provided to the bootstrap function");
                        debug_11.assert(elements.length === 1, "There are more than one elements matching the selector \"" + selector + "\" of the \"" + utils_2.stringify(componentFactory.componentType) + "\" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!");
                        element = elements[0];
                    }
                    var appRef = this._appComponent = componentFactory.create(this._injector, element);
                    appRef.parse();
                    this.tick();
                    return appRef;
                };
                Application.prototype.tick = function () {
                    debug_11.assert(!!this._appComponent, "Please call \"bootstrap\" before the first tick!");
                    this._appComponent.hostElement.detectChanges();
                };
                return Application;
            }());
            exports_46("Application", Application);
        }
    }
});
System.register("core/lifecycle/lifecycle_hooks", [], function(exports_47, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
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
            exports_47("LifecycleHooks", LifecycleHooks);
            OnInit = (function () {
                function OnInit() {
                }
                return OnInit;
            }());
            exports_47("OnInit", OnInit);
            OnChanges = (function () {
                function OnChanges() {
                }
                return OnChanges;
            }());
            exports_47("OnChanges", OnChanges);
            OnRender = (function () {
                function OnRender() {
                }
                return OnRender;
            }());
            exports_47("OnRender", OnRender);
            OnDestroy = (function () {
                function OnDestroy() {
                }
                return OnDestroy;
            }());
            exports_47("OnDestroy", OnDestroy);
        }
    }
});
System.register("core/core", ["core/application/application", "core/lifecycle/lifecycle_hooks", "core/component/decorators", "core/view/element", "core/view/host", "core/di/di", "core/async/events"], function(exports_48, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
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
        exports_48(exports);
    }
    return {
        setters:[
            function (application_1_1) {
                exports_48({
                    "bootstrap": application_1_1["bootstrap"],
                    "Application": application_1_1["Application"]
                });
            },
            function (lifecycle_hooks_1_1) {
                exportStar_3(lifecycle_hooks_1_1);
            },
            function (decorators_5_1) {
                exports_48({
                    "Component": decorators_5_1["Component"],
                    "Input": decorators_5_1["Input"],
                    "Output": decorators_5_1["Output"]
                });
            },
            function (element_3_1) {
                exports_48({
                    "ElementRef": element_3_1["ElementRef"]
                });
            },
            function (host_3_1) {
                exports_48({
                    "HostElement": host_3_1["HostElement"]
                });
            },
            function (di_6_1) {
                exportStar_3(di_6_1);
            },
            function (events_ts_1_1) {
                exports_48({
                    "EventEmitter": events_ts_1_1["EventEmitter"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("mojito/core", ["core/core"], function(exports_49, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    function exportStar_4(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_49(exports);
    }
    return {
        setters:[
            function (core_1_1) {
                exportStar_4(core_1_1);
            }],
        execute: function() {
        }
    }
});
System.register("mojito/debug", ["debug/debug"], function(exports_50, context_51) {
    "use strict";
    var __moduleName = context_51 && context_51.id;
    function exportStar_5(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_50(exports);
    }
    return {
        setters:[
            function (debug_12_1) {
                exportStar_5(debug_12_1);
            }],
        execute: function() {
        }
    }
});
System.register("mojito/utils", ["utils/utils"], function(exports_51, context_52) {
    "use strict";
    var __moduleName = context_52 && context_52.id;
    function exportStar_6(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_51(exports);
    }
    return {
        setters:[
            function (utils_ts_1_1) {
                exportStar_6(utils_ts_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qaXRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliL2RlYnVnL2Fzc2VydC9hc3NlcnQudHMiLCJsaWIvZGVidWcvbG9nZ2VyL2xvZ2dlci50cyIsImxpYi9kZWJ1Zy9kZWJ1Zy50cyIsImxpYi91dGlscy9jbGFzcy9jbGFzcy50cyIsImxpYi91dGlscy9sYW5nL2xhbmcudHMiLCJsaWIvdXRpbHMvZG9tL2RvbS50cyIsImxpYi91dGlscy9zdHJpbmcvZW5kc3dpdGgudHMiLCJsaWIvdXRpbHMvc3RyaW5nL2tlYmFiLnRzIiwibGliL3V0aWxzL3N0cmluZy9zdHJpbmdpZnkudHMiLCJsaWIvdXRpbHMvdXRpbHMudHMiLCJsaWIvY29yZS9pdGVyYXRvci9pdGVyYXRvci50cyIsImxpYi9jb3JlL21hcC9tYXAudHMiLCJsaWIvY29yZS9yZWZsZWN0L3JlZmxlY3Rpb24udHMiLCJsaWIvY29yZS9kaS9tZXRhZGF0YS50cyIsImxpYi9jb3JlL2NvbXBvbmVudC9tZXRhZGF0YS50cyIsImxpYi9jb3JlL2RpcmVjdGl2ZS9yZWdpc3RyeS50cyIsImxpYi9jb3JlL2RlY29yYXRvcnMvZGVjb3JhdG9ycy50cyIsImxpYi9jb3JlL2RpL2RlY29yYXRvcnMudHMiLCJsaWIvY29yZS9kaS9mb3J3YXJkX3JlZi50cyIsImxpYi9jb3JlL2RpL3Byb3ZpZGVyLnRzIiwibGliL2NvcmUvZGkvaW5qZWN0b3IudHMiLCJsaWIvY29yZS9kaS9kaS50cyIsImxpYi9jb3JlL2NvbXBvbmVudC9kZWNvcmF0b3JzLnRzIiwibGliL3JlbmRlci9wYXJzZXIvY29udGV4dC50cyIsImxpYi9yZW5kZXIvcGFyc2VyL2RvbV9wYXJzZXIudHMiLCJsaWIvY29yZS9jb21wb25lbnQvcmVzb2x2ZXIudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9ob29rcy9ob29rcy50cyIsImxpYi9yZW5kZXIvcGFyc2VyL2hvb2tzL2NvbXBvbmVudC50cyIsImxpYi9jb3JlL2FzeW5jL2V2ZW50cy50cyIsImxpYi9yZW5kZXIvcGFyc2VyL2V4cHJlc3Npb25fcGFyc2VyL2V4ZWN1dGFibGUudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9leHByZXNzaW9uX3BhcnNlci9wYXJzZXIudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9ob29rcy9ldmVudC50cyIsImxpYi9yZW5kZXIvcGFyc2VyL2hvb2tzL2JpbmRpbmcudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9ob29rcy90ZW1wbGF0ZV92YXJpYWJsZS50cyIsImxpYi9yZW5kZXIvcGFyc2VyL3BhcnNlci50cyIsImxpYi9jb3JlL3ZpZXcvZmFjdG9yeS50cyIsImxpYi9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdG9yLnRzIiwibGliL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jb25zdGFudHMudHMiLCJsaWIvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NoYW5nZV9kZXRlY3Rpb24udHMiLCJsaWIvY29yZS92aWV3L3ZpZXcudHMiLCJsaWIvY29yZS92aWV3L2VsZW1lbnQudHMiLCJsaWIvY29yZS92aWV3L2hvc3QudHMiLCJsaWIvY29yZS9jb21wb25lbnQvcmVmZXJlbmNlLnRzIiwibGliL2NvcmUvY29tcG9uZW50L2ZhY3RvcnkudHMiLCJsaWIvY29yZS9jb21wb25lbnQvY29tcG9uZW50LnRzIiwibGliL2NvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24udHMiLCJsaWIvY29yZS9saWZlY3ljbGUvbGlmZWN5Y2xlX2hvb2tzLnRzIiwibGliL2NvcmUvY29yZS50cyIsImxpYi9tb2ppdG8vY29yZS50cyIsImxpYi9tb2ppdG8vcmVuZGVyLnRzIiwibGliL21vaml0by9kZWJ1Zy50cyIsImxpYi9tb2ppdG8vdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7OztPQU9HO0lBQ0gsZ0JBQXVCLFNBQWtCLEVBQUUsT0FBZSxFQUFFLFNBQTRCO1FBQ3BGLElBQUksV0FBVyxHQUFHLFNBQVMs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