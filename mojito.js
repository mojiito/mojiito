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
System.register("core/get/get", ["debug/debug"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var debug_1;
    /**
     * Gets the value of a property on an object. If the property is computed,
     * the function will be invoked. If the property is not defined this method
     * will return `undefined`.
     * If the object itself is `undefined`, this method will throw an error.
     * The propertyName can also be a path (e.g. `y.m.c.a`)
     *
     * @export
     * @param {Object} obj The object where to look for a property value
     * @param {string} propertyName The name(key) of the property to be looked for
     * @returns {*} The value of the found property or `undefined`
     */
    function get(obj, propertyName) {
        debug_1.assert(arguments.length === 2, 'Get must be called with two arguments; an object and a property name');
        debug_1.assert(typeof obj !== 'undefined', 'Cannot call get on an undefined object', TypeError);
        debug_1.assert(typeof obj === 'object' || typeof obj === 'function', 'The first argument of the get method has be an object or a function', TypeError);
        debug_1.assert(typeof propertyName === 'string', 'The key provided to get method must be a string', TypeError);
        var source = obj; // needed for enabled noImplicitAny    
        var properties = propertyName.split('.');
        var property = properties.slice(0, 1)[0];
        if (property in obj) {
            return properties.length === 1 ? source[property] : get(source[property], properties.slice(1).join('.'));
        }
        return undefined;
    }
    exports_4("get", get);
    return {
        setters:[
            function (debug_1_1) {
                debug_1 = debug_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/array/array", ["debug/debug", "core/meta/meta"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var debug_2, meta_1;
    var CoreArray;
    return {
        setters:[
            function (debug_2_1) {
                debug_2 = debug_2_1;
            },
            function (meta_1_1) {
                meta_1 = meta_1_1;
            }],
        execute: function() {
            /**
             * Extends the native Array
             *
             * Usage:
             * ````
             * let a = new Mojito.Array();
             * // or
             * let b = Mojito.Array.create();
             * ````
             *
             * It's also possible to provide a native array to the constructor.
             * The CoreArray will then be created with the elements, of
             * that provided array.
             *
             * Usage:
             * ````
             * let a = new Mojito.Object([1,2,3]);
             * // or
             * let b = Mojito.Object.create([1,2,3]);
             * ````
             *
             * @export
             * @class CoreArray
             */
            CoreArray = (function () {
                /**
                 * Creates an instance of CoreArray.
                 *
                 * @param {Array<any>} [array] Array to create CoreArray from
                 */
                function CoreArray(array) {
                    debug_2.assert(this instanceof CoreArray, 'A CoreArray can only be instantiated with `new` or `CoreArray.create()`');
                    var source = [];
                    if (Array.isArray(array)) {
                        for (var i = 0, max = array.length; i < max; i++) {
                            source.push(array[i]);
                        }
                    }
                    meta_1.Meta.peek(this).setProperty('values', 'source', source, {
                        writable: false,
                        enumerable: true,
                        configurable: false
                    });
                }
                Object.defineProperty(CoreArray.prototype, "length", {
                    /**
                     * Length of the array
                     *
                     * @type {number}
                     */
                    get: function () {
                        var source = meta_1.Meta.peek(this).getProperty('values', 'source');
                        return source.length >>> 0;
                    },
                    /**
                     * Length of the array
                     */
                    set: function (value) {
                        throw new Error('Setting a length of a CoreArray is not allowed');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CoreArray.prototype, "source", {
                    /**
                     * Source of the CoreArray
                     *
                     * @type {Array<any>}
                     */
                    get: function () {
                        return meta_1.Meta.peek(this).getProperty('values', 'source');
                    },
                    /**
                     * Source of the CoreArray
                     */
                    set: function (value) {
                        throw new Error('Setting the source of a CoreArray is not allowed');
                    },
                    enumerable: true,
                    configurable: true
                });
                CoreArray.prototype.concat = function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i - 0] = arguments[_i];
                    }
                    for (var index = 0, max = values.length; index < max; index++) {
                        var element = values[index];
                        if (element instanceof CoreArray) {
                            values[index] = element.toArray();
                        }
                    }
                    var result = this.source.concat.apply(this.source, values);
                    return new CoreArray(result);
                };
                /**
                 * Returns the element at a specific position.
                 *
                 * @param {number} index Position of the element
                 * @returns {*} The found element
                 */
                CoreArray.prototype.elementAt = function (index) {
                    return this.source[index];
                };
                /**
                 * Tests whether all elements in the array pass the test
                 * implemented by the provided function.
                 *
                 * @param {Function} callback Function to test for each element.
                 * @param {*} [thisArg] Value to use as this when executing callback.
                 * @returns {boolean} true if every element passes the test, false if not
                 */
                CoreArray.prototype.every = function (callback, thisArg) {
                    var _this = this;
                    return this.source.every.call(this.source, function (value, index, array) {
                        return callback.call(thisArg ? thisArg : _this, value, index, _this);
                    }, thisArg);
                };
                /**
                 * Creates a new array with all elements that pass the test
                 * implemented by the provided function.
                 *
                 * @param {Function} callback Function to test each element of the CoreArray
                 * @param {*} [thisArg] Value to use as this when executing callback
                 * @returns {CoreArray} New CoreArray with all elements that pass
                 */
                CoreArray.prototype.filter = function (callback, thisArg) {
                    var _this = this;
                    var result = this.source.filter.call(this.source, function (value, index, array) {
                        return callback.call(thisArg ? thisArg : _this, value, index, _this);
                    }, thisArg);
                    return new CoreArray(result);
                };
                /**
                 * Returns an array with just the items with the matched property.
                 * You can pass an optional second argument with the target value.
                 * Otherwise this will match any property that evaluates to true.
                 *
                 * @param {string} key The property to test
                 * @param {string} [value] Optional value to test against.
                 * @param {*} [thisArg] Value to use as this when executing callback
                 * @returns {CoreArray} New CoreArray with all elements that pass
                 */
                CoreArray.prototype.filterBy = function (key, value, thisArg) {
                    return this.filter(function (elementValue) {
                        return typeof elementValue === 'object' && elementValue[key]
                            && (typeof value === 'undefined' && !!elementValue[key]
                                || typeof value !== 'undefined' && elementValue[key] === value);
                    }, thisArg);
                };
                /**
                 * Returns a value in the array, if an element in the array
                 * satisfies the provided testing function.
                 * Otherwise `undefined` is returned.
                 *
                 * @param {Function} predicate Function to execute on each value in the array.
                 * @param {*} [thisArg] Object to use as this when executing callback.
                 * @returns {*} value of the found element or `undefined`
                 */
                CoreArray.prototype.find = function (predicate, thisArg) {
                    var _this = this;
                    var source = this.source;
                    var fn = source['find'];
                    if (typeof fn === 'function') {
                        return fn.call(source, function (element, index, array) {
                            return predicate.call(thisArg ? thisArg : _this, element, index, _this);
                        }, thisArg);
                    }
                    else {
                        var value = void 0;
                        for (var i = 0, max = source.length >>> 0; i < max; i++) {
                            value = source[i];
                            if (predicate.call(thisArg ? thisArg : this, value, i, this)) {
                                return value;
                            }
                        }
                        return undefined;
                    }
                };
                /**
                 * Returns a object in the array, if the property of the
                 * object is equal to the provided value
                 *
                 * @param {string} propertyName name of the property to look for
                 * @param {*} value value of the property in the object to check for
                 * @returns {*} found object or `undefined`
                 */
                CoreArray.prototype.findBy = function (propertyName, value) {
                    var source = this.source;
                    var fn = source['find'];
                    var obj;
                    for (var i = 0, max = source.length >>> 0; i < max; i++) {
                        obj = source[i];
                        if (typeof obj === 'object' && obj[propertyName] === value) {
                            return obj;
                        }
                    }
                    return undefined;
                };
                /**
                 * returns an index in the array, if an element in the array
                 * satisfies the provided testing function.
                 * Otherwise -1 is returned
                 *
                 * @param {Function} predicate Function to execute on each value in the array
                 * @param {*} [thisArg] Object to use as this when executing callback.
                 * @returns {number} index of the found element or -1
                 */
                CoreArray.prototype.findIndex = function (predicate, thisArg) {
                    var _this = this;
                    var source = this.source;
                    var fn = source['findIndex'];
                    if (typeof fn === 'function') {
                        return fn.call(source, function (element, index, array) {
                            return predicate.call(thisArg ? thisArg : _this, element, index, _this);
                        }, thisArg);
                    }
                    else {
                        var value = void 0;
                        for (var i = 0, max = source.length >>> 0; i < max; i++) {
                            value = source[i];
                            if (predicate.call(thisArg ? thisArg : this, value, i, this)) {
                                return i;
                            }
                        }
                        return -1;
                    }
                };
                /**
                 * Executes a provided function once per array element.
                 *
                 * @param {Function} callback Function to execute for each element.
                 * @param {*} [thisArg] Value to use as this when executing callback.
                 * @returns {void}
                 */
                CoreArray.prototype.forEach = function (callback, thisArg) {
                    var _this = this;
                    var source = this.source;
                    var fn = source['forEach'];
                    if (typeof fn === 'function') {
                        return fn.call(source, function (currentValue, index, array) {
                            callback.call(thisArg ? thisArg : _this, currentValue, index, _this);
                        }, thisArg);
                    }
                    else {
                        for (var i = 0, max = source.length >>> 0; i < max; i++) {
                            callback.call(thisArg, source[i], i, this);
                        }
                    }
                };
                /**
                 * Determines whether an array includes a certain element, returning true or false as appropriate.
                 *
                 * @param {*} searchElement The element to search for.
                 * @param {number} [fromIndex] The position in this array at which to begin searching for searchElement.
                 * @returns {boolean} true if searchElement is found, false if not
                 */
                CoreArray.prototype.includes = function (searchElement, fromIndex) {
                    var source = this.source;
                    var fn = source['includes'];
                    if (typeof fn === 'function') {
                        return fn.apply(this.source, arguments);
                    }
                    else {
                        for (var i = fromIndex >>> 0, max = source.length >>> 0; i < max; i++) {
                            if (source[i] === searchElement) {
                                return true;
                            }
                        }
                        return false;
                    }
                };
                /**
                 * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
                 *
                 * @param {*} searchElement Element to locate in the array.
                 * @param {number} [fromIndex] The index to start the search at.
                 * @returns {number} Position of the found element, -1 if not found
                 */
                CoreArray.prototype.indexOf = function (searchElement, fromIndex) {
                    return this.source.indexOf.apply(this.source, arguments);
                };
                /**
                 * Joins all elements of an array into a string.
                 *
                 * @param {string} [separator] Specifies a string to separate each element of the array.
                 * @returns {string} String of the joined elements
                 */
                CoreArray.prototype.join = function (separator) {
                    return this.source.join.apply(this.source, arguments);
                };
                /**
                 * returns the last index at which a given element can be
                 * found in the array, or -1 if it is not present.
                 * The array is searched backwards, starting at fromIndex.
                 *
                 * @param {*} searchElement Element to locate in the array.
                 * @param {number} [fromIndex] The index at which to start searching backwards.
                 * @returns {number} Position of the found element, -1 if not found
                 */
                CoreArray.prototype.lastIndexOf = function (searchElement, fromIndex) {
                    return this.source.lastIndexOf.apply(this.source, arguments);
                };
                /**
                 * Creates a new array with the results of calling a provided function on every element in this array.
                 *
                 * @param {Function} callback Function that produces an element of the new Array
                 * @param {*} [thisArg] Value to use as this when executing callback.
                 * @returns {CoreArray} Created array
                 */
                CoreArray.prototype.map = function (callback, thisArg) {
                    var _this = this;
                    var result = this.source.concat.call(this.source, function (currentValue, index, array) {
                        callback.call(thisArg ? thisArg : _this, currentValue, index, _this);
                    }, thisArg);
                    return new CoreArray(result);
                };
                /**
                 * Removes the last element from an array and returns that element.
                 *
                 * @returns {*} Removed element
                 */
                CoreArray.prototype.pop = function () {
                    return this.source.pop.apply(this.source, arguments);
                };
                CoreArray.prototype.push = function () {
                    var elements = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        elements[_i - 0] = arguments[_i];
                    }
                    var length = this.source.push.apply(this.source, arguments);
                    return length;
                };
                /**
                 * Applies a function against an accumulator and each value
                 * of the array (from left-to-right) to reduce it to a single value.
                 *
                 * @param {Function} callback Function to execute on each value in the array.
                 * @param {*} initialValue Value to use as the first argument to the first call of the callback.
                 * @returns {*} The value returned would be that of the last callback invocation.
                 */
                CoreArray.prototype.reduce = function (callback, initialValue) {
                    var _this = this;
                    return this.source.reduce.call(this.source, function (previousValue, currentValue, currentIndex, array) {
                        callback.call(_this, previousValue, currentValue, currentIndex, _this);
                    });
                };
                /**
                 * Applies a function against an accumulator and each value
                 * of the array (from right-to-left) has to reduce it to a single value.
                 *
                 * @param {Function} callback Function to execute on each value in the array.
                 * @param {*} initialValue Object to use as the first argument to the first call of the callback.
                 * @returns {*} The value returned would be that of the last callback invocation.
                 */
                CoreArray.prototype.reduceRight = function (callback, initialValue) {
                    var _this = this;
                    return this.source.reduceRight.call(this.source, function (previousValue, currentValue, currentIndex, array) {
                        callback.call(_this, previousValue, currentValue, currentIndex, _this);
                    });
                };
                /**
                 * Reverses an array in place.
                 * The first array element becomes the last and the last becomes the first.
                 *
                 * @returns {CoreArray} The reversed array
                 */
                CoreArray.prototype.reverse = function () {
                    return this.source.reverse.apply(this.source, arguments);
                };
                /**
                 * Removes the first element from an array and returns that element.
                 * This method changes the length of the array.
                 *
                 * @returns {*} The first element of the array
                 */
                CoreArray.prototype.shift = function () {
                    return this.source.shift.apply(this.source, arguments);
                };
                /**
                 * Returns a shallow copy of a portion of an array into a new array object.
                 *
                 * @param {number} [begin] Zero-based index at which to begin extraction.
                 * @param {number} [end] Zero-based index at which to end extraction.
                 * @returns {CoreArray} New sliced array
                 */
                CoreArray.prototype.slice = function (begin, end) {
                    var result = this.source.slice.apply(this.source, arguments);
                    return new CoreArray(result);
                };
                /**
                 * Tests whether some element in the array passes the test
                 * implemented by the provided function.
                 *
                 * @param {Function} callback Function to test for each element.
                 * @param {*} [thisArg] Value to use as this when executing callback.
                 */
                CoreArray.prototype.some = function (callback, thisArg) {
                    var _this = this;
                    return this.source.some.call(this.source, function (currentValue, index, array) {
                        callback.call(thisArg ? thisArg : _this, currentValue, index, _this);
                    }, thisArg);
                };
                /**
                 * Sorts the elements of an array in place and returns the array.
                 * The default sort order is according to string Unicode code points.
                 *
                 * @param {Function} [compareFunction] Specifies a function that defines the sort order.
                 * @returns {CoreArray} Returns the sorted CoreArray
                 */
                CoreArray.prototype.sort = function (compareFunction) {
                    this.source.sort.apply(this, arguments);
                    return this;
                };
                CoreArray.prototype.splice = function (start, deleteCount) {
                    var elements = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        elements[_i - 2] = arguments[_i];
                    }
                    var result = this.source.splice.apply(this.source, arguments);
                    return new CoreArray(result);
                };
                /**
                 * Converts the CoreArray to a native Array
                 *
                 * @returns {Array<any>} The converted native Array
                 */
                CoreArray.prototype.toArray = function () {
                    return this.source;
                };
                CoreArray.prototype.unshift = function () {
                    var elements = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        elements[_i - 0] = arguments[_i];
                    }
                    return this.source.unshift.apply(this.source, arguments);
                };
                /**
                 * Static method to provide functionality for `CoreArray.create()`
                 *
                 * @static
                 * @param {Array<any>} [array] Elements to insert initially
                 * @returns {CoreArray} Newly created CoreArray
                 */
                CoreArray.create = function (array) {
                    debug_2.assert(Array.isArray(array) || typeof array === 'undefined', 'The Array provided to the create method must be an array', TypeError);
                    return new CoreArray(array);
                };
                return CoreArray;
            }());
            exports_5("CoreArray", CoreArray);
        }
    }
});
System.register("core/meta/meta", ["debug/debug"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var debug_3;
    var Meta;
    return {
        setters:[
            function (debug_3_1) {
                debug_3 = debug_3_1;
            }],
        execute: function() {
            /**
             * The meta object contains information about computed property descriptors,
             * values of defined properties as well as any watched properties and other information.
             *
             * @export
             * @class Meta
             */
            Meta = (function () {
                function Meta() {
                }
                /**
                 * Creates the member on a meta hash
                 *
                 * @param  {string} memberKey The name(key) of the member to be created
                 * @returns {Object} The created member object
                 */
                Meta.prototype.createMember = function (memberKey) {
                    debug_3.assert(arguments.length === 1, 'createMember on an meta hash must be called with one arguments: a member key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the createMember method on a meta hash must be a string', TypeError);
                    if (!this.hasMember(memberKey)) {
                        Object.defineProperty(this, '_' + memberKey, {
                            writable: false,
                            configurable: false,
                            enumerable: true,
                            value: {}
                        });
                        return this.getMember(memberKey);
                    }
                    return undefined;
                };
                /**
                 * Checks if the member is already there, otherwise
                 * it will create it. The member gets returned.
                 *
                 * @param  {string} memberKey The name(key) of the member to be peeked
                 * @returns {Object} The peeked member object
                 */
                Meta.prototype.peekMember = function (memberKey) {
                    debug_3.assert(arguments.length === 1, 'peekMember on an meta hash must be called with one arguments: a member key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the peekMember method on a meta hash must be a string', TypeError);
                    var member = this.createMember(memberKey);
                    return member ? member : this.getMember(memberKey);
                };
                /**
                 * Returns the member of the meta hash
                 * or `undefined` it does not exist
                 *
                 * @param  {string} memberKey The name(key) of the member to be returned
                 * @returns {Object} The member object or `undefined`
                 */
                Meta.prototype.getMember = function (memberKey) {
                    debug_3.assert(arguments.length === 1, 'getMember on an meta hash must be called with one arguments: a member key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the getMember method on a meta hash must be a string', TypeError);
                    var source = this; // needed for enabled noImplicitAny
                    memberKey = '_' + memberKey;
                    return source[memberKey];
                };
                /**
                 * Checks if the meta hash has a specific member
                 *
                 * @param  {string} memberKey The name(key) of the member to be checked
                 * @returns {boolean} true if member exists, false if not
                 */
                Meta.prototype.hasMember = function (memberKey) {
                    debug_3.assert(arguments.length === 1, 'hasMember on an meta hash must be called with one arguments: a member key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the hasMember method on a meta hash must be a string', TypeError);
                    return !!this.getMember(memberKey);
                };
                /**
                 * Deletes all the properties of a member in the meta hash.
                 *
                 * @param  {string} memberKey The name(key) of the member to be cleared
                 * @returns {boolean} true if clear was successful, false if not
                 */
                Meta.prototype.clearMember = function (memberKey) {
                    debug_3.assert(arguments.length === 1, 'clearMember on an meta hash must be called with one arguments: a member key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the clearMember method on a meta hash must be a string', TypeError);
                    var member = this.getMember(memberKey);
                    if (member) {
                        var status_1 = true;
                        for (var propertyKey in member) {
                            status_1 = this.deleteProperty(memberKey, propertyKey) ? status_1 : false;
                        }
                        return status_1;
                    }
                    // No member to be cleared found -> false
                    return false;
                };
                /**
                 * Sets the property of a member in the meta hash.
                 * If the property does not exist, it will be created.
                 * If the property does exist, the value will be overwritten
                 *
                 * @param  {string} memberKey The name(key) of the member where the property will be set
                 * @param  {string} propertyKey The name(key) of the property to be set
                 * @param  {*} value The value which will be set on the property
                 * @param  {PropertyDescriptor} [descriptor] The descriptor for defining the property
                 * @returns {*} The applied value
                 */
                Meta.prototype.setProperty = function (memberKey, propertyKey, value, descriptor) {
                    debug_3.assert(arguments.length === 3 || arguments.length === 4, 'setProperty on an meta hash must be called with three arguments; a member key, a property key and a value; optional you can add a descriptor');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the setProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyKey === 'string', 'The property key provided to the setProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof descriptor === 'undefined' || typeof descriptor === 'object', 'The descriptor provided to the setProperty method on a meta hash must be a PropertyDescriptor', TypeError);
                    var member = this.getMember(memberKey);
                    var isValueSet = false;
                    if (!member) {
                        member = this.createMember(memberKey);
                    }
                    if (descriptor) {
                        if (!descriptor.get && !descriptor.set) {
                            descriptor.value = value;
                            isValueSet = true;
                        }
                        Object.defineProperty(member, propertyKey, descriptor);
                    }
                    if (!isValueSet) {
                        member[propertyKey] = value;
                    }
                    return value;
                };
                Meta.prototype.setProperties = function (memberKey, propertyMap, descriptor) {
                    debug_3.assert(arguments.length === 2 || arguments.length === 3, 'setProperties on an meta hash must be called with two arguments; a member key, and a  property map; optional you can add a descriptor');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the setProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyMap === 'object', 'The propertyMap provided to the setProperties method on a meta hash must be an object', TypeError);
                    debug_3.assert(typeof descriptor === 'undefined' || typeof descriptor === 'object', 'The descriptor provided to the setProperties method on a meta hash must be a PropertyDescriptor', TypeError);
                    var map = propertyMap;
                    for (var propertyName in propertyMap) {
                        this.setProperty(memberKey, propertyName, map[propertyName], descriptor);
                    }
                };
                /**
                 * Returns the property of a member in the meta hash
                 * or `undefined` if the property or the member do not exist.
                 *
                 * @param  {string} memberKey The name(key) of the member where to look for the property
                 * @param  {string} propertyKey The name(key) of the requeste property
                 * @returns {*} The requested property
                 */
                Meta.prototype.getProperty = function (memberKey, propertyKey) {
                    debug_3.assert(arguments.length === 2, 'getProperty on an meta hash must be called with two arguments; a member key and a property key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the getProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyKey === 'string', 'The property key provided to the getProperty method on a meta hash must be a string', TypeError);
                    var member = this.peekMember(memberKey);
                    return member[propertyKey];
                };
                /**
                 * Checks if the member of the meta hash has a specific property
                 *
                 * @param  {string} memberKey The name(key) of the member where to look for the property
                 * @param  {string} propertyKey The name(key) of the property to be checked
                 * @returns {boolean} true if the property was found, false if not
                 */
                Meta.prototype.hasProperty = function (memberKey, propertyKey) {
                    debug_3.assert(arguments.length === 2, 'hasProperty on an meta hash must be called with two arguments; a member key and a property key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the hasProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyKey === 'string', 'The property key provided to the hasProperty method on a meta hash must be a string', TypeError);
                    return !!this.getProperty(memberKey, propertyKey);
                };
                /**
                 * Deletes a property of a member in the meta hash
                 *
                 * @param  {string} memberKey The name(key) of the member where to delete the property
                 * @param  {string} propertyKey The name(key) of the property to be deleted
                 * @returns {boolean} true if deletion was successful, false if not
                 */
                Meta.prototype.deleteProperty = function (memberKey, propertyKey) {
                    debug_3.assert(arguments.length === 2, 'deleteProperty on an meta hash must be called with two arguments; a member key and a property key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the deleteProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyKey === 'string', 'The property key provided to the deleteProperty method on a meta hash must be a string', TypeError);
                    var source = this; // needed for enabled noImplicitAny
                    if (source.hasProperty(memberKey, propertyKey)) {
                        memberKey = '_' + memberKey;
                        source[memberKey][propertyKey] = null;
                        delete source[memberKey][propertyKey];
                        return !source[memberKey][propertyKey];
                    }
                    return false;
                };
                Meta.extend = function (obj) {
                    var meta = new Meta();
                    Object.defineProperty(obj, Meta.META_FIELD, {
                        writable: false,
                        configurable: false,
                        enumerable: false,
                        value: meta
                    });
                    return meta;
                };
                Meta.peek = function (obj) {
                    debug_3.assert(arguments.length === 1, 'Meta.peek on an object or array must be called with one arguments; the object or array');
                    debug_3.assert(typeof obj === 'object', 'The object or array provided to the Meta.peek method must be a object or array', TypeError);
                    var source = obj; // needed for enabled noImplicitAny
                    var meta = source[Meta.META_FIELD];
                    if (!meta) {
                        meta = Meta.extend(obj);
                    }
                    return meta;
                };
                Meta.META_FIELD = '__mojito_meta__';
                return Meta;
            }());
            exports_6("Meta", Meta);
        }
    }
});
System.register("core/iterator/iterator", ["debug/debug"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var debug_4;
    var Iterator;
    return {
        setters:[
            function (debug_4_1) {
                debug_4 = debug_4_1;
            }],
        execute: function() {
            Iterator = (function () {
                function Iterator(source) {
                    this._nextIndex = 0;
                    debug_4.assert(arguments.length === 1, 'CoreIterator must be created with one argument; an iterable object');
                    debug_4.assert(typeof source.length === 'number', 'The source property has to be a iterable object', TypeError);
                    this._source = source;
                }
                Iterator.prototype.next = function () {
                    var source = this._source;
                    return this._nextIndex < source.length ? { value: source[this._nextIndex++], done: false } : { done: true };
                };
                return Iterator;
            }());
            exports_7("Iterator", Iterator);
        }
    }
});
System.register("core/watch/watch", ["core/properties/properties"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var properties_1;
    function watchKey(obj, key) {
        if (!properties_1.isDefinedProperty(obj, key)) {
            properties_1.defineProperty(obj, key);
        }
    }
    exports_8("watchKey", watchKey);
    function watchPath(obj, path) {
        var parts = path.split('.');
        var source = obj;
        for (var i = 0, max = parts.length; i < max; i++) {
            var part = parts[i];
            if (i >= parts.length - 1) {
                watchKey(obj, part);
            }
            else if (typeof source === 'function' || typeof source === 'object') {
                source = source[part];
            }
        }
    }
    exports_8("watchPath", watchPath);
    return {
        setters:[
            function (properties_1_1) {
                properties_1 = properties_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/observable/observe", ["debug/assert/assert", "core/meta/meta", "core/watch/watch", "core/observable/observer"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var assert_2, meta_2, watch_1, observer_1;
    function observe(obj, keyOrPath, callback, thisArg) {
        assert_2.assert(arguments.length >= 2 && arguments.length <= 4, 'Observe must be called with at least two and maxium four arguments; the object, array or function; the key of path which will be observed; optional a callback and a this arg');
        assert_2.assert(typeof obj === 'object' || typeof obj === 'function', 'The first parameter provided to the observe function must be an object, array or function', TypeError);
        assert_2.assert(typeof keyOrPath === 'string', 'The key or path provided to the observe function must be a string', TypeError);
        assert_2.assert(typeof callback === 'undefined' || typeof callback === 'function', 'The callback provided to the observe function must be a function', TypeError);
        var parts = keyOrPath.split('.');
        var source = obj;
        for (var i = 0, max = parts.length; i < max; i++) {
            var part = parts[i];
            if (i >= parts.length - 1) {
                var observer = meta_2.Meta.peek(source).getProperty('observers', part);
                if (observer instanceof observer_1.Observer) {
                    if (typeof callback === 'function') {
                        observer.subscribe(callback, thisArg);
                    }
                }
                else {
                    observer = new observer_1.Observer(callback, thisArg);
                    meta_2.Meta.peek(source).setProperty('observers', part, observer);
                }
                watch_1.watchKey(source, part);
                return observer;
            }
            else if (typeof source === 'function' || typeof source === 'object') {
                debugger;
                source = source[part];
            }
        }
    }
    exports_9("observe", observe);
    return {
        setters:[
            function (assert_2_1) {
                assert_2 = assert_2_1;
            },
            function (meta_2_1) {
                meta_2 = meta_2_1;
            },
            function (watch_1_1) {
                watch_1 = watch_1_1;
            },
            function (observer_1_1) {
                observer_1 = observer_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/observable/observable", [], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("core/observable/observableObject", ["core/object/object", "core/observable/observe"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var object_1, observe_1;
    var ObservableObject;
    return {
        setters:[
            function (object_1_1) {
                object_1 = object_1_1;
            },
            function (observe_1_1) {
                observe_1 = observe_1_1;
            }],
        execute: function() {
            ObservableObject = (function (_super) {
                __extends(ObservableObject, _super);
                function ObservableObject(obj) {
                    _super.call(this, obj);
                }
                ObservableObject.prototype.observe = function (keysOrPaths, callback) {
                    return observe_1.observe(this, keysOrPaths, callback, this);
                };
                ObservableObject.prototype.unobserve = function () {
                };
                ObservableObject.create = function (obj) {
                    return new ObservableObject(obj);
                };
                return ObservableObject;
            }(object_1.CoreObject));
            exports_11("ObservableObject", ObservableObject);
        }
    }
});
System.register("core/observable/observer", ["debug/debug", "core/meta/meta"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var debug_5, meta_3;
    var Observer;
    function notifyObservers(obj, key) {
        var observer = meta_3.Meta.peek(obj).getProperty('observers', key);
        if (observer instanceof Observer) {
            observer.notify();
        }
    }
    exports_12("notifyObservers", notifyObservers);
    return {
        setters:[
            function (debug_5_1) {
                debug_5 = debug_5_1;
            },
            function (meta_3_1) {
                meta_3 = meta_3_1;
            }],
        execute: function() {
            Observer = (function () {
                function Observer(callback, thisArg) {
                    this._callbacks = [];
                    debug_5.assert(arguments.length < 3, 'The observer must be created with none or one or two arguments; optional a callback function and a context');
                    debug_5.assert(typeof callback === 'undefined' || typeof callback === 'function', 'The callback provided to the observer must be a function', TypeError);
                    if (callback) {
                        this.subscribe(callback, thisArg);
                    }
                }
                Observer.prototype.subscribe = function (callback, thisArg) {
                    debug_5.assert(arguments.length === 2, 'The subscribe method must be called with one or two arguments; a callback function and optional a context');
                    debug_5.assert(typeof callback === 'function', 'The callback provided to the subscribe method must be a function', TypeError);
                    this._callbacks.push({ fn: callback, thisArg: thisArg });
                };
                Observer.prototype.unsubscribe = function () {
                };
                Observer.prototype.notify = function (thisArg) {
                    var callbacks = this._callbacks;
                    for (var i = 0, max = callbacks.length; i < max; i++) {
                        var callback = callbacks[i];
                        callback.fn.call(thisArg ? thisArg : callback.thisArg);
                    }
                };
                return Observer;
            }());
            exports_12("Observer", Observer);
        }
    }
});
System.register("core/properties/propertyEvents", ["core/observable/observer"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var observer_2;
    function propertyWillChange(obj, key, newValue, oldValue) {
        if (typeof obj.propertyWillChange === 'function') {
            obj.propertyWillChange.call(obj, key);
        }
    }
    exports_13("propertyWillChange", propertyWillChange);
    function propertyDidChange(obj, key, newValue, oldValue) {
        if (typeof obj.propertyDidChange === 'function') {
            obj.propertyDidChange.call(obj, key);
        }
        observer_2.notifyObservers(obj, key);
    }
    exports_13("propertyDidChange", propertyDidChange);
    return {
        setters:[
            function (observer_2_1) {
                observer_2 = observer_2_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/properties/mandatory_set", ["core/meta/meta", "core/properties/propertyEvents"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var meta_4, propertyEvents_1;
    function mandatory_set(obj, propertyName, value) {
        var meta = meta_4.Meta.peek(obj);
        var oldValue = meta.getProperty('values', propertyName);
        // Check if new value is different from the old one
        // if not, we do not have to do anything
        if (value === oldValue) {
            return;
        }
        propertyEvents_1.propertyWillChange(obj, propertyName, value, oldValue);
        meta.setProperty('values', propertyName, value);
        propertyEvents_1.propertyDidChange(obj, propertyName, value, oldValue);
    }
    exports_14("mandatory_set", mandatory_set);
    return {
        setters:[
            function (meta_4_1) {
                meta_4 = meta_4_1;
            },
            function (propertyEvents_1_1) {
                propertyEvents_1 = propertyEvents_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/properties/properties", ["debug/debug", "core/meta/meta", "core/properties/mandatory_set"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var debug_6, meta_5, mandatory_set_1;
    /**
     * (description)
     *
     * @export
     * @param {Object} obj (description)
     * @param {string} propertyName (description)
     * @param {*} [value] (description)
     * @returns (description)
     */
    function defineProperty(obj, propertyName, value) {
        debug_6.assert(arguments.length === 2 || arguments.length === 3, 'defineProperty must be called with at least two arguments; an object, a propertyName and optional a value');
        debug_6.assert(typeof obj === 'object', 'The obj provided to the defineProperty function must be an object', TypeError);
        debug_6.assert(typeof propertyName === 'string', 'The propertyName provided to the defineProperty method must be a string', TypeError);
        debug_6.assert(!(value instanceof meta_5.Meta), 'Defining a meta hash is not allowed');
        if (!isDefinedProperty(obj, propertyName)) {
            if (typeof value === 'undefined' && typeof obj[propertyName] !== 'undefined') {
                value = obj[propertyName];
            }
            if (typeof value !== 'undefined') {
                meta_5.Meta.peek(obj).setProperty('values', propertyName, value);
            }
            Object.defineProperty(obj, propertyName, {
                configurable: false,
                get: function () {
                    return meta_5.Meta.peek(obj).getProperty('values', propertyName);
                },
                set: function (value) {
                    mandatory_set_1.mandatory_set(obj, propertyName, value);
                }
            });
        }
        else if (typeof value !== 'undefined') {
            obj[propertyName] = value;
        }
    }
    exports_15("defineProperty", defineProperty);
    /**
     * Checks if property is already defined by mojito's
     * defineProperty method.
     *
     * @export
     * @param {Object} obj The object where to look for the defined property
     * @param {string} propertyName The name(key) of the defined property
     * @returns {boolean} true if property is defined, false if not
     */
    function isDefinedProperty(obj, propertyName) {
        debug_6.assert(arguments.length === 2, 'isDefinedProperty must be called with two arguments; a obj and a propertyName');
        debug_6.assert(typeof obj === 'object', 'The obj provided to the isDefinedProperty method must be an object', TypeError);
        debug_6.assert(typeof propertyName === 'string', 'The propertyName provided to the isDefinedProperty method must be a string', TypeError);
        return obj.hasOwnProperty(propertyName) && meta_5.Meta.peek(obj).hasProperty('values', propertyName);
    }
    exports_15("isDefinedProperty", isDefinedProperty);
    return {
        setters:[
            function (debug_6_1) {
                debug_6 = debug_6_1;
            },
            function (meta_5_1) {
                meta_5 = meta_5_1;
            },
            function (mandatory_set_1_1) {
                mandatory_set_1 = mandatory_set_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/object/object", ["debug/debug", "core/get/get", "core/set/set", "core/properties/properties", "core/meta/meta"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var debug_7, get_1, set_1, properties_2, meta_6;
    var CoreObject;
    return {
        setters:[
            function (debug_7_1) {
                debug_7 = debug_7_1;
            },
            function (get_1_1) {
                get_1 = get_1_1;
            },
            function (set_1_1) {
                set_1 = set_1_1;
            },
            function (properties_2_1) {
                properties_2 = properties_2_1;
            },
            function (meta_6_1) {
                meta_6 = meta_6_1;
            }],
        execute: function() {
            /**
             * Extends the native Object.
             * It's the default Object of Mojito
             *
             * Usage:
             * ````
             * let a = new CoreObject();
             * // or
             * let b = CoreObject.create();
             * ````
             *
             * It's also possible to provide an object to the constructor.
             * The CoreObject will then be created with the properies, of
             * that provided object.
             *
             * Usage:
             * ````
             * let a = new CoreObject({a: 1});
             * // or
             * let b = CoreObject.create({a: 1});
             * ````
             *
             * @export
             * @class CoreObject
             */
            CoreObject = (function () {
                /**
                 * Creates an instance of CoreObject.
                 *
                 * @param {Object} [obj] Object or property map to define properties
                 */
                function CoreObject(obj) {
                    debug_7.assert(this instanceof CoreObject, 'A class can only be instantiated with `new`');
                    debug_7.assert(typeof obj === 'object' || typeof obj === 'undefined', 'The object when provided to the constructor method must be an object', TypeError);
                    set_1.setProperties(this, obj);
                }
                /**
                 * Retrieves the value of a property from the object.
                 *
                 * @param {string} propertyName The name(key) of the property
                 * @returns {*} Value of the property
                 */
                CoreObject.prototype.get = function (propertyName) {
                    debug_7.assert(arguments.length === 1, 'get must be called with one argument; a propertyName');
                    debug_7.assert(typeof propertyName === 'string', 'The propertyName to the get method must be a string', TypeError);
                    return get_1.get(this, propertyName);
                };
                /**
                 * Sets the provided key or path on the object to the value.
                 *
                 * @param {string} propertyName The name(key) of the property
                 * @param {*} value Value to be set on the property
                 * @returns {*} Value which has been set on the property
                 */
                CoreObject.prototype.set = function (propertyName, value) {
                    debug_7.assert(arguments.length === 2, 'set must be called with two arguments; a propertyName and value');
                    debug_7.assert(typeof propertyName === 'string', 'The propertyName to the set method must be a string', TypeError);
                    return set_1.set(this, propertyName, value);
                };
                /**
                 * Returns the Meta hash of this CoreObject
                 *
                 * @returns {Meta} The Meta hash/map
                 */
                CoreObject.prototype.getMeta = function () {
                    return meta_6.Meta.peek(this);
                };
                /**
                 * Static method to provide functionality for `CoreObject.create()`
                 *
                 * @static
                 * @param {Object} [obj] Object or property map to define properties
                 * @returns {CoreObject} Newly created CoreObject
                 */
                CoreObject.create = function (obj) {
                    debug_7.assert(typeof obj === 'object' || typeof obj === 'undefined', 'The object when provided to the create method must be an object', TypeError);
                    return new this(obj);
                };
                /**
                 * Custom defineProperty method for change detection
                 *
                 * @static
                 * @param {CoreObject} sourceObject The object where to define the property
                 * @param {string} propertyName The name(key) of the property to be defined
                 * @param {*} [value] The value to be set on the property
                 */
                CoreObject.defineProperty = function (sourceObject, propertyName, value) {
                    debug_7.assert(arguments.length === 2 || arguments.length === 3, 'defineProperty must be called with at least two arguments; a sourceObject, a propertyName and optional a value');
                    debug_7.assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperty method must be an object', TypeError);
                    debug_7.assert(typeof propertyName === 'string', 'The propertyName provided to the defineProperty method must be a string', TypeError);
                    debug_7.assert(!(value instanceof meta_6.Meta), 'Defining a meta hash is not allowed');
                    properties_2.defineProperty(sourceObject, propertyName, value);
                };
                /**
                 * Defines all the properties provided in a propertyMap
                 * on the sourceObject.
                 *
                 * Usage:
                 * `````
                 * let sourceObject = {};
                 * Mojito.Object.defineProperty(sourceObject, { a: 1, b: true});
                 * // sourceObject { a: 1, b: true }
                 * `````
                 *
                 * @static
                 * @param {CoreObject} sourceObject The object where to define the properties
                 * @param {Object} [propertyMap] The map with the properties to be defined
                 * @returns {CoreObject} The object with the defined properties
                 */
                CoreObject.defineProperties = function (sourceObject, propertyMap) {
                    debug_7.assert(arguments.length === 1 || arguments.length === 2, 'defineProperties must be called with at least one arguments; a sourceObject and optional a propertyMap');
                    debug_7.assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperties method must be an object', TypeError);
                    debug_7.assert(typeof propertyMap === 'undefined' || typeof propertyMap === 'object', 'The propertyMap provided to the defineProperties method must be an object', TypeError);
                    if (propertyMap) {
                        CoreObject.defineProperties(sourceObject);
                    }
                    var properties = !!propertyMap ? propertyMap : sourceObject;
                    // replace every property with a defined one
                    for (var key in properties) {
                        var value = properties[key];
                        // defining Meta not allowed, skip it            
                        if (value instanceof meta_6.Meta) {
                            continue;
                        }
                        // functions directly on the sourceObject object can't be defined
                        if (!propertyMap && typeof value === 'function') {
                            continue;
                        }
                        CoreObject.defineProperty(sourceObject, key, value);
                    }
                    return sourceObject;
                };
                /**
                 * Checks if property is already defined by mojito's
                 * defineProperty method.
                 *
                 * @static
                 * @param {CoreObject} sourceObject The object where to look for the property
                 * @param {string} propertyName The name(key) of the defined property
                 * @returns {boolean} true if property is defined, false if not
                 */
                CoreObject.isDefinedProperty = function (sourceObject, propertyName) {
                    debug_7.assert(arguments.length === 2, 'isDefinedProperty must be called with two arguments; a sourceObject and a propertyName');
                    debug_7.assert(typeof sourceObject === 'object', 'The sourceObject provided to the isDefinedProperty method must be an object', TypeError);
                    debug_7.assert(typeof propertyName === 'string', 'The propertyName provided to the isDefinedProperty method must be a string', TypeError);
                    return properties_2.isDefinedProperty(sourceObject, propertyName);
                };
                return CoreObject;
            }());
            exports_16("CoreObject", CoreObject);
        }
    }
});
System.register("core/set/set", ["debug/debug"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var debug_8;
    /**
     * Sets the value of a property on an object, respecting computed properties
     * and notifying observers and other listeners of the change.
     * If the object itself is `undefined`, this method will throw an error.
     * The propertyName can also be a path (e.g. `y.m.c.a`)
     *
     * @export
     * @param {Object} obj The object where to set a property value
     * @param {string} propertyName The name(key) of the property to be set
     * @param {*} value (description) The value to be set on the property
     * @returns {*} (description) The value which has been set on the property
     */
    function set(obj, propertyName, value) {
        debug_8.assert(arguments.length === 3, 'Get must be called with three arguments; an object, a property name and a value');
        debug_8.assert(typeof obj !== 'undefined', 'Cannot call set on an undefined object', TypeError);
        debug_8.assert(typeof obj === 'object' || typeof obj === 'function', 'The first argument of the get method has be an object or a function', TypeError);
        debug_8.assert(typeof propertyName === 'string', 'The key provided to get method must be a string', TypeError);
        debug_8.assert(typeof value !== 'undefined', 'Cannot call set with an `undefined` value ', TypeError);
        var source = obj; // needed for enabled noImplicitAny    
        var properties = propertyName.split('.');
        var property = properties.slice(0, 1)[0];
        if (properties.length === 1) {
            source[property] = value;
            return value;
        }
        if (!(property in obj)) {
            // if property is `undefined` create an object to fullfil the path
            source[property] = {};
        }
        else if (typeof source[property] !== 'object') {
            throw new TypeError('The property in the path has to be an object ');
        }
        return set(source[property], properties.slice(1).join('.'), value);
    }
    exports_17("set", set);
    function setProperties(obj, properties) {
        for (var key in properties) {
            set(obj, key, properties[key]);
        }
        return obj;
    }
    exports_17("setProperties", setProperties);
    return {
        setters:[
            function (debug_8_1) {
                debug_8 = debug_8_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/map/map", ["core/iterator/iterator", "debug/debug"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var iterator_1, debug_9;
    var CoreMap, TypedMap;
    return {
        setters:[
            function (iterator_1_1) {
                iterator_1 = iterator_1_1;
            },
            function (debug_9_1) {
                debug_9 = debug_9_1;
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
                        debug_9.Logger.log(debug_9.LogLevel.debug, "Don't use length property on CoreMaps!!", debug_9.LogType.warn);
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
            exports_18("CoreMap", CoreMap);
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
            exports_18("TypedMap", TypedMap);
        }
    }
});
System.register("core/observable/observes", ["debug/debug", "core/observable/observe", "core/observable/observableObject"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var debug_10, observe_2, observableObject_1;
    function observes() {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        debug_10.assert(arguments.length > 0, 'The observes decorator must be called with at least one property key');
        return function (target, propertyKey, descriptor) {
            debug_10.assert(arguments.length === 3, 'The observe decorator callback must be called with three arguments; a target, a propertyKey and a descriptor');
            debug_10.assert(target instanceof observableObject_1.ObservableObject, 'The target provided to the observe decorator callback must be an object and an instace of `ObservableObject`', TypeError);
            debug_10.assert(typeof propertyKey === 'string', 'The property key provided to the observe decorator callback must be a string', TypeError);
            //const source: any = target;  // needed for enabled noImplicitAny
            var callback = descriptor.value;
            debug_10.assert(typeof callback === 'function', 'The callback for the observer has to be a function', TypeError);
            for (var i = 0, max = keys.length; i < max; i++) {
                var key = keys[i];
                debug_10.assert(typeof key === 'string', 'The keys provided to the observe decorator callback must be strings', TypeError);
                observe_2.observe(target, key, callback, target);
            }
            return descriptor;
        };
    }
    exports_19("observes", observes);
    return {
        setters:[
            function (debug_10_1) {
                debug_10 = debug_10_1;
            },
            function (observe_2_1) {
                observe_2 = observe_2_1;
            },
            function (observableObject_1_1) {
                observableObject_1 = observableObject_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/core", ["core/get/get", "core/set/set", "core/meta/meta", "core/object/object", "core/array/array", "core/map/map", "core/observable/observes", "core/observable/observableObject"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    return {
        setters:[
            function (get_2_1) {
                exports_20({
                    "get": get_2_1["get"]
                });
            },
            function (set_2_1) {
                exports_20({
                    "set": set_2_1["set"]
                });
            },
            function (meta_7_1) {
                exports_20({
                    "Meta": meta_7_1["Meta"]
                });
            },
            function (object_2_1) {
                exports_20({
                    "CoreObject": object_2_1["CoreObject"]
                });
            },
            function (array_1_1) {
                exports_20({
                    "CoreArray": array_1_1["CoreArray"]
                });
            },
            function (map_1_1) {
                exports_20({
                    "CoreMap": map_1_1["CoreMap"],
                    "TypedMap": map_1_1["TypedMap"]
                });
            },
            function (observes_1_1) {
                exports_20({
                    "observes": observes_1_1["observes"]
                });
            },
            function (observableObject_2_1) {
                exports_20({
                    "ObservableObject": observableObject_2_1["ObservableObject"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("mojito/core", ["core/core"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_21(exports);
    }
    return {
        setters:[
            function (core_1_1) {
                exportStar_1(core_1_1);
            }],
        execute: function() {
        }
    }
});
System.register("utils/class/class", [], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    function getClassName(klass) {
        return klass.name ? klass.name : /^function\s+([\w\$]+)\s*\(/.exec(this.toString())[1];
    }
    exports_22("getClassName", getClassName);
    function isClassInstance(instance) {
        return typeof instance === 'object' && !!instance['constructor'];
    }
    exports_22("isClassInstance", isClassInstance);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("runtime/reflect/reflection", ["core/map/map", "debug/debug"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var map_2, debug_11;
    var ClassReflection;
    return {
        setters:[
            function (map_2_1) {
                map_2 = map_2_1;
            },
            function (debug_11_1) {
                debug_11 = debug_11_1;
            }],
        execute: function() {
            debug_11.assert(!!(Reflect && Reflect.defineMetadata), 'reflect-metadata shim is required! Please make sure it is installed.');
            ClassReflection = (function () {
                function ClassReflection() {
                    this._properties = new map_2.TypedMap();
                    this._parameters = [];
                    this._annotations = new map_2.TypedMap();
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
            exports_23("ClassReflection", ClassReflection);
        }
    }
});
System.register("utils/string/stringify", [], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
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
    exports_24("stringify", stringify);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("runtime/di/metadata", ["utils/string/stringify"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var stringify_1;
    var InjectableMetadata, InjectMetadata;
    return {
        setters:[
            function (stringify_1_1) {
                stringify_1 = stringify_1_1;
            }],
        execute: function() {
            InjectableMetadata = (function () {
                function InjectableMetadata() {
                }
                InjectableMetadata.prototype.toString = function () { return "@Injectable()"; };
                return InjectableMetadata;
            }());
            exports_25("InjectableMetadata", InjectableMetadata);
            InjectMetadata = (function () {
                function InjectMetadata(token) {
                    this.token = token;
                }
                InjectMetadata.prototype.toString = function () { return "@Inject(" + stringify_1.stringify(this.token) + ")"; };
                return InjectMetadata;
            }());
            exports_25("InjectMetadata", InjectMetadata);
        }
    }
});
System.register("runtime/component/metadata", ["utils/string/stringify", "runtime/di/metadata"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var stringify_2, metadata_1;
    var DirectiveMetadata, ComponentMetadata, InputMetadata, OutputMetadata;
    return {
        setters:[
            function (stringify_2_1) {
                stringify_2 = stringify_2_1;
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
                    this.selector = selector;
                    this.inputs = inputs;
                    this.outputs = outputs;
                    this.host = host;
                    this.providers = providers;
                }
                DirectiveMetadata.prototype.toString = function () { return "@DirectiveMetadata()"; };
                return DirectiveMetadata;
            }(metadata_1.InjectableMetadata));
            exports_26("DirectiveMetadata", DirectiveMetadata);
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
            exports_26("ComponentMetadata", ComponentMetadata);
            InputMetadata = (function () {
                function InputMetadata(bindingPropertyName) {
                    this.bindingPropertyName = bindingPropertyName;
                }
                InputMetadata.prototype.toString = function () { return "@InputMetadata(" + stringify_2.stringify(this.bindingPropertyName) + ")"; };
                return InputMetadata;
            }());
            exports_26("InputMetadata", InputMetadata);
            OutputMetadata = (function () {
                function OutputMetadata(bindingPropertyName) {
                    this.bindingPropertyName = bindingPropertyName;
                }
                OutputMetadata.prototype.toString = function () { return "@OutputMetadata(" + stringify_2.stringify(this.bindingPropertyName) + ")"; };
                return OutputMetadata;
            }());
            exports_26("OutputMetadata", OutputMetadata);
        }
    }
});
System.register("runtime/directive/registry", [], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
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
            exports_27("DirectiveRegistry", DirectiveRegistry);
        }
    }
});
System.register("utils/decorators/decorators", ["runtime/reflect/reflection", "runtime/directive/registry"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
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
    exports_28("createClassDecorator", createClassDecorator);
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
    exports_28("createParameterDecorator", createParameterDecorator);
    function createPropertyDecoratory(metadataClass) {
        return function (objOrType) {
            return function (target, propertyKey) {
                reflection_1.ClassReflection.peek(target.constructor).properties.set(propertyKey, new metadataClass(objOrType || propertyKey));
            };
        };
    }
    exports_28("createPropertyDecoratory", createPropertyDecoratory);
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
System.register("runtime/di/decorators", ["utils/decorators/decorators", "runtime/di/metadata"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
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
            exports_29("Injectable", Injectable = decorators_1.createClassDecorator(metadata_2.InjectableMetadata));
            exports_29("Inject", Inject = decorators_1.createParameterDecorator(metadata_2.InjectMetadata));
        }
    }
});
System.register("runtime/di/forward_ref", ["utils/string/stringify"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var stringify_3;
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
        forwardRefFn.toString = function () { return stringify_3.stringify(this()); };
        return forwardRefFn;
    }
    exports_30("forwardRef", forwardRef);
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
    exports_30("resolveForwardRef", resolveForwardRef);
    return {
        setters:[
            function (stringify_3_1) {
                stringify_3 = stringify_3_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/di/provider", ["runtime/reflect/reflection", "runtime/di/metadata", "runtime/di/forward_ref", "debug/debug", "utils/string/stringify"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var reflection_2, metadata_3, forward_ref_1, debug_12, stringify_4;
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
    exports_31("provide", provide);
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
    exports_31("resolveProviders", resolveProviders);
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
    exports_31("resolveProvider", resolveProvider);
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
    exports_31("resolveFactory", resolveFactory);
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
            debug_12.assert(!!isInjectable_1, "Cannot resolve all parameters for " + stringify_4.stringify(annotatedClass) + "! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject");
            for (var i = 0, max = dependencyTokens.length; i < max; i++) {
                var dep = dependencyTokens[i];
                if (dep instanceof metadata_3.InjectMetadata) {
                    dependecies.push(dep.token);
                }
            }
        }
        return dependecies;
    }
    exports_31("dependenciesForClass", dependenciesForClass);
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
            function (debug_12_1) {
                debug_12 = debug_12_1;
            },
            function (stringify_4_1) {
                stringify_4 = stringify_4_1;
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
            exports_31("Provider", Provider);
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
            exports_31("ResolvedProvider", ResolvedProvider);
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
            exports_31("ResolvedFactory", ResolvedFactory);
        }
    }
});
System.register("runtime/di/injector", ["core/core", "runtime/di/provider", "runtime/di/forward_ref", "debug/debug", "utils/string/stringify"], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var core_2, provider_1, forward_ref_2, debug_13, stringify_5;
    var Injector;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (provider_1_1) {
                provider_1 = provider_1_1;
            },
            function (forward_ref_2_1) {
                forward_ref_2 = forward_ref_2_1;
            },
            function (debug_13_1) {
                debug_13 = debug_13_1;
            },
            function (stringify_5_1) {
                stringify_5 = stringify_5_1;
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
                    this._values = new core_2.CoreMap();
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
                                debug_13.assert(!!dept, "Cannot resolve all parameters for " + stringify_5.stringify(resolvedFactory.factory) + "! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject");
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
            exports_32("Injector", Injector);
        }
    }
});
/**
 * Mojito's dependency injection basically a simpler version of Angular's DI.
 * All the credits and respect to the Angular team.
 *
 * TODO: Insert stuff...
 */
System.register("runtime/di/di", ["runtime/di/decorators", "runtime/di/injector", "runtime/di/provider", "runtime/di/forward_ref"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    return {
        setters:[
            function (decorators_2_1) {
                exports_33({
                    "Injectable": decorators_2_1["Injectable"],
                    "Inject": decorators_2_1["Inject"]
                });
            },
            function (injector_1_1) {
                exports_33({
                    "Injector": injector_1_1["Injector"]
                });
            },
            function (provider_2_1) {
                exports_33({
                    "Provider": provider_2_1["Provider"],
                    "ResolvedProvider": provider_2_1["ResolvedProvider"],
                    "provide": provider_2_1["provide"]
                });
            },
            function (forward_ref_3_1) {
                exports_33({
                    "forwardRef": forward_ref_3_1["forwardRef"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("utils/dom/dom", [], function(exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    function convertNodeListToArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }
    exports_34("convertNodeListToArray", convertNodeListToArray);
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
    exports_34("doesSelectorMatchElement", doesSelectorMatchElement);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("render/parser/context", [], function(exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
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
            exports_35("ContextReference", ContextReference);
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
            exports_35("ContextTree", ContextTree);
        }
    }
});
System.register("render/parser/dom_parser", ["debug/debug", "runtime/di/di", "render/parser/context"], function(exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var debug_14, di_1, context_37;
    var DOMParser;
    return {
        setters:[
            function (debug_14_1) {
                debug_14 = debug_14_1;
            },
            function (di_1_1) {
                di_1 = di_1_1;
            },
            function (context_37_1) {
                context_37 = context_37_1;
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
                    this.parseNode(rootElement, new context_37.ContextTree(context), skipRootElement);
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
                                        debug_14.Logger.log(debug_14.LogLevel.error, ex, debug_14.LogType.error);
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
                                            debug_14.Logger.log(debug_14.LogLevel.critical, ex, debug_14.LogType.error);
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
            exports_36("DOMParser", DOMParser);
        }
    }
});
System.register("render/parser/hooks/hooks", [], function(exports_37, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var ParserElementHook, ParserAttributeHook;
    return {
        setters:[],
        execute: function() {
            ParserElementHook = (function () {
                function ParserElementHook() {
                }
                return ParserElementHook;
            }());
            exports_37("ParserElementHook", ParserElementHook);
            ParserAttributeHook = (function () {
                function ParserAttributeHook() {
                    this.removeAttributeNode = false;
                }
                return ParserAttributeHook;
            }());
            exports_37("ParserAttributeHook", ParserAttributeHook);
        }
    }
});
System.register("render/parser/hooks/component", ["debug/debug", "utils/string/stringify", "render/parser/hooks/hooks", "utils/dom/dom", "runtime/directive/registry", "runtime/view/view", "runtime/view/host"], function(exports_38, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var debug_15, stringify_6, hooks_1, dom_1, registry_2, view_1, host_1;
    var ComponentParserHook;
    return {
        setters:[
            function (debug_15_1) {
                debug_15 = debug_15_1;
            },
            function (stringify_6_1) {
                stringify_6 = stringify_6_1;
            },
            function (hooks_1_1) {
                hooks_1 = hooks_1_1;
            },
            function (dom_1_1) {
                dom_1 = dom_1_1;
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
                        if (dom_1.doesSelectorMatchElement(this.selectors[i], element)) {
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
                    debug_15.assert(view instanceof view_1.View, "The found view on the element " + element + " has to be of the type View!");
                    debug_15.assert(view.hostElement instanceof host_1.HostElement, "The found component \"" + stringify_6.stringify(componentType) + "\" on the element " + element + " has no parent host element.\nAre you using the bootstrap function for setting up your project?");
                    var componentRef = factory.create(view.hostElement.injector, element);
                    this.lastFoundSelectorIndex = -1;
                    return componentRef.hostElement.getView(-1);
                };
                return ComponentParserHook;
            }(hooks_1.ParserElementHook));
            exports_38("ComponentParserHook", ComponentParserHook);
        }
    }
});
System.register("runtime/async/events", [], function(exports_39, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
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
            exports_39("EventEmitter", EventEmitter);
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
            exports_39("EventSubscription", EventSubscription);
        }
    }
});
System.register("render/parser/hooks/event", ["debug/debug", "render/parser/hooks/hooks", "runtime/view/view", "runtime/reflect/reflection", "runtime/component/metadata", "runtime/async/events"], function(exports_40, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    var debug_16, hooks_2, view_2, reflection_3, metadata_4, events_1;
    var EventParserHook;
    return {
        setters:[
            function (debug_16_1) {
                debug_16 = debug_16_1;
            },
            function (hooks_2_1) {
                hooks_2 = hooks_2_1;
            },
            function (view_2_1) {
                view_2 = view_2_1;
            },
            function (reflection_3_1) {
                reflection_3 = reflection_3_1;
            },
            function (metadata_4_1) {
                metadata_4 = metadata_4_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
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
                EventParserHook.prototype.onParse = function (element, attribute, context) {
                    var view = context.getNearestContextOfType(view_2.View);
                    var host = view.hostElement;
                    var attrName = attribute.name;
                    var eventType;
                    var eventExpression = attribute.value;
                    if (attrName.indexOf('on-') !== -1) {
                        eventType = attrName.split('on-')[1];
                    }
                    else {
                        eventType = attrName.match(/\w+(-\w+)*/)[0];
                    }
                    debug_16.assert(/\w+\(\w*(,\w+)*\)/.test(eventExpression), "The source \"" + attribute.value + "\" of the event \"" + attribute.name + "\" is not a valid expression!");
                    debug_16.assert(view instanceof view_2.View, "There is no view, directive or component found for this event " + attribute.name + "=\"" + attribute.value + "\"");
                    var methodName = eventExpression.match(/\w+/)[0];
                    var handler;
                    if (context.getUnfiltered()[0].filter(function (value) { return value.context === view; }).length
                        && view.hostElement.getView(-1) === view) {
                        handler = host.parent && host.parent.component;
                        debug_16.assert(!!handler, "There is no parent component to call when the event \"" + attribute.name + "\" fires!");
                        debug_16.assert(typeof handler[methodName] === 'function', "The parent component has no method \"" + attribute.value + " for the \"" + attribute.name + "\" event");
                        // event is attached on a component
                        reflection_3.ClassReflection.peek(view.hostElement.component.constructor).properties.forEach(function (value, key) {
                            if (value instanceof metadata_4.OutputMetadata && value.bindingPropertyName === eventType) {
                                var emitter = host.component[key];
                                if (emitter instanceof events_1.EventEmitter) {
                                    emitter.subscribe(function () {
                                        var args = [];
                                        for (var _i = 0; _i < arguments.length; _i++) {
                                            args[_i - 0] = arguments[_i];
                                        }
                                        handler[methodName].apply(handler, args);
                                    });
                                }
                            }
                        });
                    }
                    else {
                        handler = host.component;
                        debug_16.assert(!!handler, "There is no component to call when the event \"" + attribute.name + "\" fires!");
                        debug_16.assert(typeof handler[methodName] === 'function', "The parent component has no method \"" + attribute.value + " for the \"" + attribute.name + "\" event");
                        // normal event
                        var emitter_1 = new events_1.EventEmitter();
                        emitter_1.subscribe(function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i - 0] = arguments[_i];
                            }
                            handler[methodName].apply(handler, args);
                        });
                        // view.hostElement.component            
                        element.addEventListener(eventType, function (event) {
                            emitter_1.emit();
                        });
                    }
                };
                return EventParserHook;
            }(hooks_2.ParserAttributeHook));
            exports_40("EventParserHook", EventParserHook);
        }
    }
});
System.register("render/parser/hooks/binding", ["render/parser/hooks/hooks"], function(exports_41, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    var hooks_3;
    var BindingParserHook;
    return {
        setters:[
            function (hooks_3_1) {
                hooks_3 = hooks_3_1;
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
                    console.log(element, attribute);
                };
                return BindingParserHook;
            }(hooks_3.ParserAttributeHook));
            exports_41("BindingParserHook", BindingParserHook);
        }
    }
});
System.register("render/parser/hooks/template_variable", ["render/parser/hooks/hooks"], function(exports_42, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var hooks_4;
    var TemplateVariableParserHook;
    return {
        setters:[
            function (hooks_4_1) {
                hooks_4 = hooks_4_1;
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
                    console.log('Template variable found: ', attribute.name, element);
                };
                return TemplateVariableParserHook;
            }(hooks_4.ParserAttributeHook));
            exports_42("TemplateVariableParserHook", TemplateVariableParserHook);
        }
    }
});
System.register("render/parser/parser", ["runtime/di/di", "render/parser/dom_parser", "runtime/component/resolver", "render/parser/hooks/component", "render/parser/hooks/event", "render/parser/hooks/binding", "render/parser/hooks/template_variable"], function(exports_43, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var di_2, dom_parser_1, resolver_1, component_1, event_1, binding_1, template_variable_1;
    var Parser;
    return {
        setters:[
            function (di_2_1) {
                di_2 = di_2_1;
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
                    di_2.Injectable(),
                    __param(0, di_2.Inject(di_2.forwardRef(function () { return resolver_1.ComponentResolver; }))), 
                    __metadata('design:paramtypes', [resolver_1.ComponentResolver])
                ], Parser);
                return Parser;
            }());
            exports_43("Parser", Parser);
        }
    }
});
System.register("runtime/view/factory", [], function(exports_44, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
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
            exports_44("ViewFactory", ViewFactory);
        }
    }
});
System.register("runtime/view/view", ["render/parser/parser"], function(exports_45, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    var parser_1;
    var View;
    return {
        setters:[
            function (parser_1_1) {
                parser_1 = parser_1_1;
            }],
        execute: function() {
            View = (function () {
                function View(element, hostElement) {
                    this._rootElement = element;
                    this._hostElement = hostElement;
                    this._parser = this._hostElement.injector.get(parser_1.Parser);
                    // console.log(this._hostElement.injector);
                }
                Object.defineProperty(View.prototype, "rootElement", {
                    get: function () {
                        return this._rootElement;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "hostElement", {
                    get: function () {
                        return this._hostElement;
                    },
                    enumerable: true,
                    configurable: true
                });
                View.prototype.parse = function () {
                    this._parser.parse(this._rootElement, this, true);
                };
                View.prototype.destroy = function () { };
                return View;
            }());
            exports_45("View", View);
        }
    }
});
System.register("runtime/view/element", [], function(exports_46, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
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
            exports_46("ElementRef", ElementRef);
        }
    }
});
System.register("runtime/view/host", ["debug/debug", "runtime/view/view", "runtime/view/element"], function(exports_47, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
    var debug_17, view_3, element_1;
    var HostElement;
    return {
        setters:[
            function (debug_17_1) {
                debug_17 = debug_17_1;
            },
            function (view_3_1) {
                view_3 = view_3_1;
            },
            function (element_1_1) {
                element_1 = element_1_1;
            }],
        execute: function() {
            HostElement = (function () {
                function HostElement(nativeElement, parent) {
                    this._componentView = null;
                    this._nestedViews = []; // TODO: Implement embedded views
                    this._parent = null;
                    this._nativeElement = nativeElement;
                    this._parent = parent || null;
                }
                Object.defineProperty(HostElement.prototype, "component", {
                    get: function () { return this._component; },
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
                HostElement.prototype.initComponent = function (component, injector) {
                    this._component = component;
                    this._injector = injector;
                    var componentView = new view_3.View(this._nativeElement, this);
                    this._componentView = componentView;
                };
                // TODO    
                HostElement.prototype.attachView = function (view, viewIndex) { };
                HostElement.prototype.parseView = function (viewIndex) {
                    if (viewIndex === void 0) { viewIndex = -1; }
                    var view = this.getView(viewIndex);
                    debug_17.assert(view instanceof view_3.View, "No view with index \"" + viewIndex + "\"\" found!");
                    view.parse();
                };
                HostElement.prototype.parse = function () {
                    this.parseView(-1);
                };
                HostElement.prototype.getView = function (viewIndex) {
                    if (viewIndex === void 0) { viewIndex = -1; }
                    return viewIndex === -1 ? this._componentView : this._nestedViews[viewIndex];
                };
                return HostElement;
            }());
            exports_47("HostElement", HostElement);
        }
    }
});
System.register("runtime/component/reference", [], function(exports_48, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
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
            exports_48("ComponentReference", ComponentReference);
        }
    }
});
System.register("runtime/component/factory", ["runtime/component/reference", "runtime/component/metadata", "runtime/view/host", "runtime/view/element", "runtime/reflect/reflection", "runtime/di/di"], function(exports_49, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    var reference_1, metadata_5, host_2, element_2, reflection_4, di_3;
    var ComponentFactory;
    return {
        setters:[
            function (reference_1_1) {
                reference_1 = reference_1_1;
            },
            function (metadata_5_1) {
                metadata_5 = metadata_5_1;
            },
            function (host_2_1) {
                host_2 = host_2_1;
            },
            function (element_2_1) {
                element_2 = element_2_1;
            },
            function (reflection_4_1) {
                reflection_4 = reflection_4_1;
            },
            function (di_3_1) {
                di_3 = di_3_1;
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
                    var metadata = reflection_4.ClassReflection.peek(this._componentType).annotations.get(metadata_5.ComponentMetadata);
                    var providers = Array.isArray(metadata.providers) ? metadata.providers : [];
                    providers = providers.concat([
                        di_3.provide(element_2.ElementRef, { useValue: hostElement.elementRef }),
                        di_3.provide(host_2.HostElement, { useValue: hostElement }),
                        di_3.provide(hostElement, { useClass: di_3.forwardRef(function () { return _this._componentType; }) })
                    ]);
                    var inj = injector.resolveAndCreateChild(providers);
                    var component = inj.get(hostElement);
                    hostElement.initComponent(component, inj);
                    var ref = new reference_1.ComponentReference(hostElement, this._componentType);
                    return ref;
                };
                return ComponentFactory;
            }());
            exports_49("ComponentFactory", ComponentFactory);
        }
    }
});
System.register("runtime/component/resolver", ["runtime/di/di", "runtime/component/factory", "runtime/reflect/reflection"], function(exports_50, context_51) {
    "use strict";
    var __moduleName = context_51 && context_51.id;
    var di_4, factory_1, reflection_5;
    var ComponentResolver;
    return {
        setters:[
            function (di_4_1) {
                di_4 = di_4_1;
            },
            function (factory_1_1) {
                factory_1 = factory_1_1;
            },
            function (reflection_5_1) {
                reflection_5 = reflection_5_1;
            }],
        execute: function() {
            ComponentResolver = (function () {
                function ComponentResolver() {
                }
                ComponentResolver.prototype.resolveComponent = function (componentClass) {
                    var factory = reflection_5.ClassReflection.peek(componentClass).annotations.get(factory_1.ComponentFactory);
                    if (!(factory instanceof factory_1.ComponentFactory)) {
                        factory = new factory_1.ComponentFactory(componentClass);
                        reflection_5.ClassReflection.peek(componentClass).annotations.set(factory_1.ComponentFactory, factory);
                    }
                    return factory;
                };
                ComponentResolver = __decorate([
                    di_4.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], ComponentResolver);
                return ComponentResolver;
            }());
            exports_50("ComponentResolver", ComponentResolver);
        }
    }
});
System.register("runtime/bootstrap/bootstrap", ["debug/debug", "utils/class/class", "runtime/component/resolver", "runtime/component/metadata", "runtime/component/reference", "runtime/di/di", "utils/dom/dom", "render/parser/parser", "runtime/reflect/reflection"], function(exports_51, context_52) {
    "use strict";
    var __moduleName = context_52 && context_52.id;
    var debug_18, class_1, resolver_2, metadata_6, reference_2, di_5, dom_2, parser_2, reflection_6;
    function bootstrap(appComponentType, customProviders, root) {
        if (customProviders === void 0) { customProviders = []; }
        if (root === void 0) { root = document.body; }
        if (customProviders instanceof Element) {
            root = customProviders;
            customProviders = [];
        }
        debug_18.assert(root instanceof Element, 'Root has to be an Element!', TypeError);
        debug_18.assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);
        var appRef;
        var providers = [
            new di_5.Provider(resolver_2.ComponentResolver, { useClass: resolver_2.ComponentResolver }),
            new di_5.Provider(parser_2.Parser, { useClass: parser_2.Parser }),
            new di_5.Provider(reference_2.ComponentReference, { useValue: appRef })
        ];
        var rootInjector = di_5.Injector.resolveAndCreate(providers.concat(customProviders));
        var componentResolver = rootInjector.get(resolver_2.ComponentResolver);
        var factory = componentResolver.resolveComponent(appComponentType);
        var metadata = reflection_6.ClassReflection.peek(factory.componentType).annotations.get(metadata_6.ComponentMetadata);
        debug_18.assert(metadata instanceof metadata_6.ComponentMetadata, "The class \"" + class_1.getClassName(appComponentType) + "\" has no metadata defined in the @Component decorator.");
        var element;
        var selector = metadata.selector;
        debug_18.assert(!!(typeof selector === 'string' && selector.length), "The class \"" + class_1.getClassName(appComponentType) + "\" has no selector defined in the @Component metadata object.");
        if (dom_2.doesSelectorMatchElement(selector, root)) {
            element = root;
        }
        else {
            var elements = root.querySelectorAll(selector);
            debug_18.assert(!!elements.length, "We could not find an element matching the selector \"" + selector + "\" of the \"" + class_1.getClassName(appComponentType) + "\" component provided to the bootstrap function");
            debug_18.assert(elements.length === 1, "There are more than one elements matching the selector \"" + selector + "\" of the \"" + class_1.getClassName(appComponentType) + "\" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!");
            element = elements[0];
        }
        appRef = factory.create(rootInjector, element);
        appRef.parse();
    }
    exports_51("bootstrap", bootstrap);
    return {
        setters:[
            function (debug_18_1) {
                debug_18 = debug_18_1;
            },
            function (class_1_1) {
                class_1 = class_1_1;
            },
            function (resolver_2_1) {
                resolver_2 = resolver_2_1;
            },
            function (metadata_6_1) {
                metadata_6 = metadata_6_1;
            },
            function (reference_2_1) {
                reference_2 = reference_2_1;
            },
            function (di_5_1) {
                di_5 = di_5_1;
            },
            function (dom_2_1) {
                dom_2 = dom_2_1;
            },
            function (parser_2_1) {
                parser_2 = parser_2_1;
            },
            function (reflection_6_1) {
                reflection_6 = reflection_6_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/lifecycle/lifecycle_hooks", [], function(exports_52, context_53) {
    "use strict";
    var __moduleName = context_53 && context_53.id;
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
            exports_52("LifecycleHooks", LifecycleHooks);
            OnInit = (function () {
                function OnInit() {
                }
                return OnInit;
            }());
            exports_52("OnInit", OnInit);
            OnChanges = (function () {
                function OnChanges() {
                }
                return OnChanges;
            }());
            exports_52("OnChanges", OnChanges);
            OnRender = (function () {
                function OnRender() {
                }
                return OnRender;
            }());
            exports_52("OnRender", OnRender);
            OnDestroy = (function () {
                function OnDestroy() {
                }
                return OnDestroy;
            }());
            exports_52("OnDestroy", OnDestroy);
        }
    }
});
System.register("runtime/component/decorators", ["utils/decorators/decorators", "runtime/component/metadata"], function(exports_53, context_54) {
    "use strict";
    var __moduleName = context_54 && context_54.id;
    var decorators_3, metadata_7;
    var Component, Input, Output;
    return {
        setters:[
            function (decorators_3_1) {
                decorators_3 = decorators_3_1;
            },
            function (metadata_7_1) {
                metadata_7 = metadata_7_1;
            }],
        execute: function() {
            exports_53("Component", Component = decorators_3.createClassDecorator(metadata_7.ComponentMetadata));
            exports_53("Input", Input = decorators_3.createPropertyDecoratory(metadata_7.InputMetadata));
            exports_53("Output", Output = decorators_3.createPropertyDecoratory(metadata_7.OutputMetadata));
        }
    }
});
System.register("runtime/runtime", ["runtime/bootstrap/bootstrap", "runtime/lifecycle/lifecycle_hooks", "runtime/component/decorators", "runtime/view/element", "runtime/view/host", "runtime/di/di", "runtime/async/events"], function(exports_54, context_55) {
    "use strict";
    var __moduleName = context_55 && context_55.id;
    var exportedNames_1 = {
        'bootstrap': true,
        'Component': true,
        'Input': true,
        'Output': true,
        'ElementRef': true,
        'HostElement': true,
        'EventEmitter': true
    };
    function exportStar_2(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default"&& !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_54(exports);
    }
    return {
        setters:[
            function (bootstrap_1_1) {
                exports_54({
                    "bootstrap": bootstrap_1_1["bootstrap"]
                });
            },
            function (lifecycle_hooks_1_1) {
                exportStar_2(lifecycle_hooks_1_1);
            },
            function (decorators_4_1) {
                exports_54({
                    "Component": decorators_4_1["Component"],
                    "Input": decorators_4_1["Input"],
                    "Output": decorators_4_1["Output"]
                });
            },
            function (element_3_1) {
                exports_54({
                    "ElementRef": element_3_1["ElementRef"]
                });
            },
            function (host_3_1) {
                exports_54({
                    "HostElement": host_3_1["HostElement"]
                });
            },
            function (di_6_1) {
                exportStar_2(di_6_1);
            },
            function (events_ts_1_1) {
                exports_54({
                    "EventEmitter": events_ts_1_1["EventEmitter"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("mojito/runtime", ["runtime/runtime"], function(exports_55, context_56) {
    "use strict";
    var __moduleName = context_56 && context_56.id;
    function exportStar_3(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_55(exports);
    }
    return {
        setters:[
            function (runtime_1_1) {
                exportStar_3(runtime_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qaXRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliL2RlYnVnL2Fzc2VydC9hc3NlcnQudHMiLCJsaWIvZGVidWcvbG9nZ2VyL2xvZ2dlci50cyIsImxpYi9kZWJ1Zy9kZWJ1Zy50cyIsImxpYi9jb3JlL2dldC9nZXQudHMiLCJsaWIvY29yZS9hcnJheS9hcnJheS50cyIsImxpYi9jb3JlL21ldGEvbWV0YS50cyIsImxpYi9jb3JlL2l0ZXJhdG9yL2l0ZXJhdG9yLnRzIiwibGliL2NvcmUvd2F0Y2gvd2F0Y2gudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmUudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmFibGUudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmFibGVPYmplY3QudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmVyLnRzIiwibGliL2NvcmUvcHJvcGVydGllcy9wcm9wZXJ0eUV2ZW50cy50cyIsImxpYi9jb3JlL3Byb3BlcnRpZXMvbWFuZGF0b3J5X3NldC50cyIsImxpYi9jb3JlL3Byb3BlcnRpZXMvcHJvcGVydGllcy50cyIsImxpYi9jb3JlL29iamVjdC9vYmplY3QudHMiLCJsaWIvY29yZS9zZXQvc2V0LnRzIiwibGliL2NvcmUvbWFwL21hcC50cyIsImxpYi9jb3JlL29ic2VydmFibGUvb2JzZXJ2ZXMudHMiLCJsaWIvY29yZS9jb3JlLnRzIiwibGliL21vaml0by9jb3JlLnRzIiwibGliL3V0aWxzL2NsYXNzL2NsYXNzLnRzIiwibGliL3J1bnRpbWUvcmVmbGVjdC9yZWZsZWN0aW9uLnRzIiwibGliL3V0aWxzL3N0cmluZy9zdHJpbmdpZnkudHMiLCJsaWIvcnVudGltZS9kaS9tZXRhZGF0YS50cyIsImxpYi9ydW50aW1lL2NvbXBvbmVudC9tZXRhZGF0YS50cyIsImxpYi9ydW50aW1lL2RpcmVjdGl2ZS9yZWdpc3RyeS50cyIsImxpYi91dGlscy9kZWNvcmF0b3JzL2RlY29yYXRvcnMudHMiLCJsaWIvcnVudGltZS9kaS9kZWNvcmF0b3JzLnRzIiwibGliL3J1bnRpbWUvZGkvZm9yd2FyZF9yZWYudHMiLCJsaWIvcnVudGltZS9kaS9wcm92aWRlci50cyIsImxpYi9ydW50aW1lL2RpL2luamVjdG9yLnRzIiwibGliL3J1bnRpbWUvZGkvZGkudHMiLCJsaWIvdXRpbHMvZG9tL2RvbS50cyIsImxpYi9yZW5kZXIvcGFyc2VyL2NvbnRleHQudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9kb21fcGFyc2VyLnRzIiwibGliL3JlbmRlci9wYXJzZXIvaG9va3MvaG9va3MudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9ob29rcy9jb21wb25lbnQudHMiLCJsaWIvcnVudGltZS9hc3luYy9ldmVudHMudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9ob29rcy9ldmVudC50cyIsImxpYi9yZW5kZXIvcGFyc2VyL2hvb2tzL2JpbmRpbmcudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9ob29rcy90ZW1wbGF0ZV92YXJpYWJsZS50cyIsImxpYi9yZW5kZXIvcGFyc2VyL3BhcnNlci50cyIsImxpYi9ydW50aW1lL3ZpZXcvZmFjdG9yeS50cyIsImxpYi9ydW50aW1lL3ZpZXcvdmlldy50cyIsImxpYi9ydW50aW1lL3ZpZXcvZWxlbWVudC50cyIsImxpYi9ydW50aW1lL3ZpZXcvaG9zdC50cyIsImxpYi9ydW50aW1lL2NvbXBvbmVudC9yZWZlcmVuY2UudHMiLCJsaWIvcnVudGltZS9jb21wb25lbnQvZmFjdG9yeS50cyIsImxpYi9ydW50aW1lL2NvbXBvbmVudC9yZXNvbHZlci50cyIsImxpYi9ydW50aW1lL2Jvb3RzdHJhcC9ib290c3RyYXAudHMiLCJsaWIvcnVudGltZS9saWZlY3ljbGUvbGlmZWN5Y2xlX2hvb2tzLnRzIiwibGliL3J1bnRpbWUvY29tcG9uZW50L2RlY29yYXRvcnMudHMiLCJsaWIvcnVudGltZS9ydW50aW1lLnRzIiwibGliL21vaml0by9ydW50aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGlu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