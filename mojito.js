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
System.register("runtime/annotations/annotations", ["utils/class/class", "core/map/map", "debug/debug"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var class_1, map_2, debug_11;
    var Annotations;
    return {
        setters:[
            function (class_1_1) {
                class_1 = class_1_1;
            },
            function (map_2_1) {
                map_2 = map_2_1;
            },
            function (debug_11_1) {
                debug_11 = debug_11_1;
            }],
        execute: function() {
            debug_11.assert(!!(Reflect && Reflect.defineMetadata), 'reflect-metadata shim is required! Please make sure it is installed.');
            Annotations = (function () {
                function Annotations(classType) {
                    this._map = new map_2.CoreMap();
                    this._classType = classType;
                }
                Annotations.prototype.get = function (annotationType) {
                    return this._map.get(annotationType);
                };
                Annotations.prototype.getSingle = function (annotationType) {
                    var annotations = this.get(annotationType);
                    return Array.isArray(annotations) && annotations.length ? annotations[0] : null;
                };
                Annotations.prototype.add = function (annotation) {
                    debug_11.assert(class_1.isClassInstance(annotation), "Annotation " + annotation + " has to be an instance of a class", TypeError);
                    var annotations = this.get(annotation['constructor']);
                    if (annotations === undefined) {
                        annotations = [];
                        this._map.set(annotation['constructor'], annotations);
                    }
                    annotations.push(annotation);
                };
                Annotations.prototype.set = function (annotation) {
                    this._map.delete(annotation['constructor']);
                    this.add(annotation);
                };
                Annotations.peek = function (classType) {
                    if (this.isAnnotated(classType)) {
                        return Reflect.getMetadata('annotations', classType);
                    }
                    var annotations = new Annotations(classType);
                    Reflect.defineMetadata('annotations', annotations, classType);
                    return annotations;
                };
                Annotations.isAnnotated = function (classType) {
                    return Reflect.hasMetadata('annotations', classType);
                };
                return Annotations;
            }());
            exports_23("Annotations", Annotations);
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
System.register("runtime/di/forward_ref", ["utils/string/stringify"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var stringify_2;
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
        forwardRefFn.toString = function () { return stringify_2.stringify(this()); };
        return forwardRefFn;
    }
    exports_26("forwardRef", forwardRef);
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
    exports_26("resolveForwardRef", resolveForwardRef);
    return {
        setters:[
            function (stringify_2_1) {
                stringify_2 = stringify_2_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/di/provider", ["runtime/annotations/annotations", "runtime/di/metadata", "runtime/di/forward_ref", "debug/debug", "utils/string/stringify"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var annotations_1, metadata_1, forward_ref_1, debug_12, stringify_3;
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
    exports_27("provide", provide);
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
    exports_27("resolveProviders", resolveProviders);
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
    exports_27("resolveProvider", resolveProvider);
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
    exports_27("resolveFactory", resolveFactory);
    function dependenciesForClass(annotatedClass) {
        var dependecies = [];
        var dependencyTokens = annotations_1.Annotations.peek(annotatedClass).get(metadata_1.InjectMetadata);
        if (Array.isArray(dependencyTokens)) {
            var isInjectable = !!annotations_1.Annotations.peek(annotatedClass).get(metadata_1.InjectableMetadata);
            debug_12.assert(!!isInjectable, "Cannot resolve all parameters for " + stringify_3.stringify(annotatedClass) + "! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject");
            for (var i = 0, max = dependencyTokens.length; i < max; i++) {
                var dep = dependencyTokens[i];
                if (dep instanceof metadata_1.InjectMetadata) {
                    dependecies.push(dep.token);
                }
            }
        }
        return dependecies;
    }
    exports_27("dependenciesForClass", dependenciesForClass);
    return {
        setters:[
            function (annotations_1_1) {
                annotations_1 = annotations_1_1;
            },
            function (metadata_1_1) {
                metadata_1 = metadata_1_1;
            },
            function (forward_ref_1_1) {
                forward_ref_1 = forward_ref_1_1;
            },
            function (debug_12_1) {
                debug_12 = debug_12_1;
            },
            function (stringify_3_1) {
                stringify_3 = stringify_3_1;
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
            exports_27("Provider", Provider);
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
            exports_27("ResolvedProvider", ResolvedProvider);
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
            exports_27("ResolvedFactory", ResolvedFactory);
        }
    }
});
System.register("runtime/di/injector", ["core/core", "runtime/di/provider", "runtime/di/forward_ref", "debug/debug", "utils/string/stringify"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var core_2, provider_1, forward_ref_2, debug_13, stringify_4;
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
            function (stringify_4_1) {
                stringify_4 = stringify_4_1;
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
                            // console.log('GET', resolvedFactory);
                            for (var j = 0, max_1 = resolvedFactory.dependencies.length; j < max_1; j++) {
                                var deptToken = forward_ref_2.resolveForwardRef(resolvedFactory.dependencies[j]);
                                var dept = this.get(deptToken);
                                debug_13.assert(!!dept, "Cannot resolve all parameters for " + stringify_4.stringify(resolvedFactory.factory) + "! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject");
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
            exports_28("Injector", Injector);
        }
    }
});
System.register("runtime/di/decorators", ["debug/debug", "runtime/annotations/annotations", "runtime/di/metadata"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var debug_14, annotations_2, metadata_2;
    function Inject(token) {
        return function (target, propertyKey, parameterIndex) {
            debug_14.assert(typeof token !== 'undefined', 'Parameter decorator @Inject needs a token, please provide one!', TypeError);
            annotations_2.Annotations.peek(target).add(new metadata_2.InjectMetadata(token));
        };
    }
    exports_29("Inject", Inject);
    function Injectable() {
        return function (target) {
            debug_14.assert(typeof target === 'function', 'Class decorator @Injectable has to be applied on a class!', TypeError);
            annotations_2.Annotations.peek(target).add(new metadata_2.InjectableMetadata());
        };
    }
    exports_29("Injectable", Injectable);
    return {
        setters:[
            function (debug_14_1) {
                debug_14 = debug_14_1;
            },
            function (annotations_2_1) {
                annotations_2 = annotations_2_1;
            },
            function (metadata_2_1) {
                metadata_2 = metadata_2_1;
            }],
        execute: function() {
        }
    }
});
/**
 * Mojito's dependency injection basically a simpler version of Angular's DI.
 * All the credits and respect to the Angular team.
 *
 * TODO: Insert stuff...
 */
System.register("runtime/di/di", ["runtime/di/decorators", "runtime/di/injector", "runtime/di/provider", "runtime/di/forward_ref"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    return {
        setters:[
            function (decorators_1_1) {
                exports_30({
                    "Injectable": decorators_1_1["Injectable"],
                    "Inject": decorators_1_1["Inject"]
                });
            },
            function (injector_1_1) {
                exports_30({
                    "Injector": injector_1_1["Injector"]
                });
            },
            function (provider_2_1) {
                exports_30({
                    "Provider": provider_2_1["Provider"],
                    "ResolvedProvider": provider_2_1["ResolvedProvider"],
                    "provide": provider_2_1["provide"]
                });
            },
            function (forward_ref_3_1) {
                exports_30({
                    "forwardRef": forward_ref_3_1["forwardRef"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("utils/dom/dom", [], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    function convertNodeListToArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }
    exports_31("convertNodeListToArray", convertNodeListToArray);
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
    exports_31("doesSelectorMatchElement", doesSelectorMatchElement);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("render/parser/context", [], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
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
            exports_32("ContextReference", ContextReference);
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
            exports_32("ContextTree", ContextTree);
        }
    }
});
System.register("render/parser/dom_parser", ["debug/debug", "runtime/di/di", "render/parser/context"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var debug_15, di_1, context_34;
    var DOMParser;
    return {
        setters:[
            function (debug_15_1) {
                debug_15 = debug_15_1;
            },
            function (di_1_1) {
                di_1 = di_1_1;
            },
            function (context_34_1) {
                context_34 = context_34_1;
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
                    this.parseNode(rootElement, new context_34.ContextTree(context), skipRootElement);
                };
                DOMParser.prototype.parseNode = function (element, contextTree, skipRootElement) {
                    if (skipRootElement === void 0) { skipRootElement = false; }
                    if (!(element instanceof Element)) {
                        throw new Error('The property element has to be an Element');
                    }
                    contextTree.down();
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
                                        debug_15.Logger.log(debug_15.LogLevel.error, ex, debug_15.LogType.error);
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
                                            debug_15.Logger.log(debug_15.LogLevel.critical, ex, debug_15.LogType.error);
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
                    contextTree.up();
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
            exports_33("DOMParser", DOMParser);
        }
    }
});
System.register("render/parser/hooks/hooks", [], function(exports_34, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var ParserElementHook, ParserAttributeHook;
    return {
        setters:[],
        execute: function() {
            ParserElementHook = (function () {
                function ParserElementHook() {
                }
                return ParserElementHook;
            }());
            exports_34("ParserElementHook", ParserElementHook);
            ParserAttributeHook = (function () {
                function ParserAttributeHook() {
                    this.removeAttributeNode = false;
                }
                return ParserAttributeHook;
            }());
            exports_34("ParserAttributeHook", ParserAttributeHook);
        }
    }
});
System.register("runtime/component/registry", [], function(exports_35, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var ComponentRegistry;
    return {
        setters:[],
        execute: function() {
            ComponentRegistry = (function () {
                function ComponentRegistry() {
                }
                Object.defineProperty(ComponentRegistry, "selectors", {
                    get: function () { return this._selectors; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ComponentRegistry, "componentTypes", {
                    get: function () { return this._componentTypes; },
                    enumerable: true,
                    configurable: true
                });
                ComponentRegistry.register = function (componentType, selector) {
                    if (this._componentTypes.indexOf(componentType) === -1 && this._selectors.indexOf(selector) === -1) {
                        this._componentTypes.push(componentType);
                        this._selectors.push(selector);
                    }
                };
                ComponentRegistry.bySelector = function (selector) {
                    var index = this._selectors.indexOf(selector);
                    return index !== -1 ? this._componentTypes[index] : null;
                };
                ComponentRegistry._componentTypes = [];
                ComponentRegistry._selectors = [];
                return ComponentRegistry;
            }());
            exports_35("ComponentRegistry", ComponentRegistry);
        }
    }
});
System.register("render/parser/hooks/component", ["debug/debug", "utils/string/stringify", "render/parser/hooks/hooks", "utils/dom/dom", "runtime/component/registry", "runtime/view/host"], function(exports_36, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var debug_16, stringify_5, hooks_1, dom_1, registry_1, host_1;
    var ComponentParserHook;
    function _findNextHostFromContext(context) {
        if (context instanceof host_1.HostElement) {
            return context;
        }
        if (Array.isArray(context)) {
            for (var i = 0, max = context.length; i < max; i++) {
                var cntxt = context[i];
                if (cntxt instanceof host_1.HostElement) {
                    return cntxt;
                }
                else if (Array.isArray(cntxt)) {
                    var result = _findNextHostFromContext(cntxt);
                    if (result instanceof host_1.HostElement) {
                        return result;
                    }
                }
            }
        }
        return null;
    }
    exports_36("_findNextHostFromContext", _findNextHostFromContext);
    return {
        setters:[
            function (debug_16_1) {
                debug_16 = debug_16_1;
            },
            function (stringify_5_1) {
                stringify_5 = stringify_5_1;
            },
            function (hooks_1_1) {
                hooks_1 = hooks_1_1;
            },
            function (dom_1_1) {
                dom_1 = dom_1_1;
            },
            function (registry_1_1) {
                registry_1 = registry_1_1;
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
                    this.selectors = registry_1.ComponentRegistry.selectors;
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
                    var componentType = registry_1.ComponentRegistry.componentTypes[this.lastFoundSelectorIndex];
                    var factory = this.resolver.resolveComponent(componentType);
                    var parentHost = context.getNearestContextOfType(host_1.HostElement);
                    debug_16.assert(parentHost instanceof host_1.HostElement, "The found component \"" + stringify_5.stringify(componentType) + "\" on the element " + element + " has no parent host element.\nAre you using the bootstrap function for setting up your project?");
                    var componentRef = factory.create(parentHost.injector, element);
                    this.lastFoundSelectorIndex = -1;
                    return componentRef.hostElement;
                };
                return ComponentParserHook;
            }(hooks_1.ParserElementHook));
            exports_36("ComponentParserHook", ComponentParserHook);
        }
    }
});
System.register("render/parser/parser", ["runtime/di/di", "render/parser/dom_parser", "runtime/component/resolver", "render/parser/hooks/component"], function(exports_37, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var di_2, dom_parser_1, resolver_1, component_1;
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
            }],
        execute: function() {
            Parser = (function () {
                function Parser(resolver) {
                    this._domParser = new dom_parser_1.DOMParser();
                    this._domParser.registerElementHook(new component_1.ComponentParserHook(resolver));
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
            exports_37("Parser", Parser);
        }
    }
});
System.register("runtime/view/factory", [], function(exports_38, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
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
            exports_38("ViewFactory", ViewFactory);
        }
    }
});
System.register("runtime/view/view", ["render/parser/parser"], function(exports_39, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
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
                    this._parser.parse(this._rootElement, this._hostElement, true);
                };
                View.prototype.destroy = function () { };
                return View;
            }());
            exports_39("View", View);
        }
    }
});
System.register("runtime/view/element", [], function(exports_40, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
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
            exports_40("ElementRef", ElementRef);
        }
    }
});
System.register("runtime/view/host", ["debug/debug", "runtime/view/view", "runtime/view/element"], function(exports_41, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    var debug_17, view_1, element_1;
    var HostElement;
    return {
        setters:[
            function (debug_17_1) {
                debug_17 = debug_17_1;
            },
            function (view_1_1) {
                view_1 = view_1_1;
            },
            function (element_1_1) {
                element_1 = element_1_1;
            }],
        execute: function() {
            HostElement = (function () {
                function HostElement(nativeElement) {
                    this._componentView = null;
                    this._nestedViews = []; // TODO: Implement embedded views
                    this._nativeElement = nativeElement;
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
                HostElement.prototype.initComponent = function (component, injector) {
                    this._component = component;
                    this._injector = injector;
                    var componentView = new view_1.View(this._nativeElement, this);
                    this._componentView = componentView;
                };
                // TODO    
                HostElement.prototype.attachView = function (view, viewIndex) { };
                HostElement.prototype.parseView = function (viewIndex) {
                    if (viewIndex === void 0) { viewIndex = -1; }
                    var view = this.getView(viewIndex);
                    debug_17.assert(view instanceof view_1.View, "No view with index \"" + viewIndex + "\"\" found!");
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
            exports_41("HostElement", HostElement);
        }
    }
});
System.register("runtime/component/reference", [], function(exports_42, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
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
            exports_42("ComponentReference", ComponentReference);
        }
    }
});
System.register("runtime/component/metadata", ["debug/debug"], function(exports_43, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var debug_18;
    var ComponentMetadataReference;
    return {
        setters:[
            function (debug_18_1) {
                debug_18 = debug_18_1;
            }],
        execute: function() {
            /**
             * Reference Object containing the component metadata
             *
             * @export
             * @class ComponentMetadataReference
             * @template C
             */
            ComponentMetadataReference = (function () {
                function ComponentMetadataReference(metadata) {
                    // Check if metadata is an object
                    debug_18.assert(typeof metadata === 'object' && !Array.isArray(metadata), "The metadata object must be an object and implement the ComponentMetadata class!", TypeError);
                    // Check if a selector is specified in the metadata.
                    // Every directive must have a selector
                    debug_18.assert(typeof metadata.selector === 'string', "The metadata object must specify a selector!", TypeError);
                    metadata.selector = metadata.selector.trim();
                    // Check if selector contains only one level of dom nodes
                    // Ok: .my-selector
                    // Not allowed: .parent .my-selector
                    debug_18.assert(metadata.selector.indexOf(' ') === -1, "The selector \"" + metadata.selector + "\" specified in the component metadata contains more than one levels of nodes. Only one is allowed!", SyntaxError);
                    // Check if selector is valid
                    debug_18.assert(!!metadata.selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/), "The selector \"" + metadata.selector + "\" specified in the component metadata is not valid", SyntaxError);
                    // Parsing the selector string to an array
                    // 'my-element.class1#id[attribute1].class2[attribute2="value"]'
                    // to
                    // ["my-element", ".class1", "#id", "[attribute1]", ".class2", "[attribute2="value"]"]   
                    var selectorList = metadata.selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');
                    for (var i = 0, max = selectorList.length; i < max; i++) {
                        var selector = selectorList[i];
                        if (!selector.length) {
                            continue;
                        }
                        // Check if the selector contains element names whicht are not allowed
                        // eg. custom elements without a "-" in it
                        debug_18.assert(!selector.match(/^\w+(-\w+)*$/) || !(document.createElement(selector) instanceof HTMLUnknownElement), "The selector \"" + metadata.selector + "\" specified in the component metadata contains an element name \"" + selector + "\" which is not allowed. \n                If you are using a custom element, there has to be a \"-\" char in it!)", SyntaxError);
                    }
                    this._selector = metadata.selector;
                    this._actions = metadata.actions;
                    this._template = metadata.template;
                    this._templateName = metadata.templateName;
                    this._providers = metadata.providers || [];
                }
                Object.defineProperty(ComponentMetadataReference.prototype, "selector", {
                    get: function () {
                        return this._selector;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ComponentMetadataReference.prototype, "actions", {
                    get: function () {
                        return this._actions || null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ComponentMetadataReference.prototype, "template", {
                    get: function () {
                        return this.template || null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ComponentMetadataReference.prototype, "templateName", {
                    get: function () {
                        return this.templateName || null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ComponentMetadataReference.prototype, "providers", {
                    get: function () {
                        return this._providers;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ComponentMetadataReference;
            }());
            exports_43("ComponentMetadataReference", ComponentMetadataReference);
        }
    }
});
System.register("runtime/component/factory", ["runtime/component/reference", "runtime/component/metadata", "runtime/view/host", "runtime/view/element", "runtime/annotations/annotations", "runtime/di/di"], function(exports_44, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
    var reference_1, metadata_3, host_2, element_2, annotations_3, di_3;
    var ComponentFactory;
    return {
        setters:[
            function (reference_1_1) {
                reference_1 = reference_1_1;
            },
            function (metadata_3_1) {
                metadata_3 = metadata_3_1;
            },
            function (host_2_1) {
                host_2 = host_2_1;
            },
            function (element_2_1) {
                element_2 = element_2_1;
            },
            function (annotations_3_1) {
                annotations_3 = annotations_3_1;
            },
            function (di_3_1) {
                di_3 = di_3_1;
            }],
        execute: function() {
            ComponentFactory = (function () {
                function ComponentFactory(componentClass) {
                    this._componentType = componentClass;
                    this._metaRef = annotations_3.Annotations.peek(componentClass).get(metadata_3.ComponentMetadataReference)[0];
                }
                Object.defineProperty(ComponentFactory.prototype, "metadataReference", {
                    get: function () {
                        return this._metaRef;
                    },
                    enumerable: true,
                    configurable: true
                });
                ComponentFactory.prototype.create = function (injector, nativeElement) {
                    var _this = this;
                    var hostElement = new host_2.HostElement(nativeElement);
                    var providers = Array.isArray(this._metaRef.providers) ? this._metaRef.providers : [];
                    providers = providers.concat([
                        di_3.provide(element_2.ElementRef, { useValue: hostElement.elementRef }),
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
            exports_44("ComponentFactory", ComponentFactory);
        }
    }
});
System.register("runtime/component/resolver", ["runtime/di/di", "runtime/component/factory", "runtime/annotations/annotations"], function(exports_45, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    var di_4, factory_1, annotations_4;
    var ComponentResolver;
    return {
        setters:[
            function (di_4_1) {
                di_4 = di_4_1;
            },
            function (factory_1_1) {
                factory_1 = factory_1_1;
            },
            function (annotations_4_1) {
                annotations_4 = annotations_4_1;
            }],
        execute: function() {
            ComponentResolver = (function () {
                function ComponentResolver() {
                }
                ComponentResolver.prototype.resolveComponent = function (componentClass) {
                    var factory = annotations_4.Annotations.peek(componentClass).getSingle(factory_1.ComponentFactory);
                    if (!(factory instanceof factory_1.ComponentFactory)) {
                        factory = new factory_1.ComponentFactory(componentClass);
                        annotations_4.Annotations.peek(componentClass).set(factory);
                    }
                    return factory;
                };
                ComponentResolver = __decorate([
                    di_4.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], ComponentResolver);
                return ComponentResolver;
            }());
            exports_45("ComponentResolver", ComponentResolver);
        }
    }
});
System.register("runtime/bootstrap/bootstrap", ["debug/debug", "utils/class/class", "runtime/component/resolver", "runtime/component/reference", "runtime/di/di", "utils/dom/dom", "render/parser/parser"], function(exports_46, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    var debug_19, class_2, resolver_2, reference_2, di_5, dom_2, parser_2;
    function bootstrap(appComponentType, customProviders, root) {
        if (customProviders === void 0) { customProviders = []; }
        if (root === void 0) { root = document.body; }
        if (customProviders instanceof Element) {
            root = customProviders;
            customProviders = [];
        }
        debug_19.assert(root instanceof Element, 'Root has to be an Element!', TypeError);
        debug_19.assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);
        var appRef;
        var providers = [
            new di_5.Provider(resolver_2.ComponentResolver, { useClass: resolver_2.ComponentResolver }),
            new di_5.Provider(parser_2.Parser, { useClass: parser_2.Parser }),
            new di_5.Provider(reference_2.ComponentReference, { useValue: appRef })
        ];
        var rootInjector = di_5.Injector.resolveAndCreate(providers.concat(customProviders));
        var componentResolver = rootInjector.get(resolver_2.ComponentResolver);
        var factory = componentResolver.resolveComponent(appComponentType);
        var element;
        var selector = factory.metadataReference.selector;
        if (dom_2.doesSelectorMatchElement(selector, root)) {
            element = root;
        }
        else {
            var elements = root.querySelectorAll(factory.metadataReference.selector);
            debug_19.assert(!!elements.length, "We could not find an element matching the selector \"" + factory.metadataReference.selector + "\" of the \"" + class_2.getClassName(appComponentType) + "\" component provided to the bootstrap function");
            debug_19.assert(elements.length === 1, "There are more than one elements matching the selector \"" + factory.metadataReference.selector + "\" of the \"" + class_2.getClassName(appComponentType) + "\" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!");
            element = elements[0];
        }
        appRef = factory.create(rootInjector, element);
        appRef.parse();
    }
    exports_46("bootstrap", bootstrap);
    return {
        setters:[
            function (debug_19_1) {
                debug_19 = debug_19_1;
            },
            function (class_2_1) {
                class_2 = class_2_1;
            },
            function (resolver_2_1) {
                resolver_2 = resolver_2_1;
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
            }],
        execute: function() {
        }
    }
});
System.register("runtime/lifecycle/lifecycle_hooks", [], function(exports_47, context_48) {
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
System.register("runtime/component/directive", ["runtime/component/metadata", "runtime/annotations/annotations", "runtime/di/di", "runtime/component/registry"], function(exports_48, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    var metadata_4, annotations_5, di_6, registry_2;
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
     * @param {ComponentMetadata} metadata Component metadata
     * @returns {ClassDecorator}
     */
    function Component(metadata) {
        return function (componentClass) {
            di_6.Injectable()(componentClass);
            var metaRef = new metadata_4.ComponentMetadataReference(metadata);
            annotations_5.Annotations.peek(componentClass).add(metaRef);
            registry_2.ComponentRegistry.register(componentClass, metaRef.selector);
        };
    }
    exports_48("Component", Component);
    return {
        setters:[
            function (metadata_4_1) {
                metadata_4 = metadata_4_1;
            },
            function (annotations_5_1) {
                annotations_5 = annotations_5_1;
            },
            function (di_6_1) {
                di_6 = di_6_1;
            },
            function (registry_2_1) {
                registry_2 = registry_2_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/runtime", ["runtime/bootstrap/bootstrap", "runtime/lifecycle/lifecycle_hooks", "runtime/component/directive", "runtime/view/element", "runtime/di/di"], function(exports_49, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    var exportedNames_1 = {
        'bootstrap': true,
        'Component': true,
        'ElementRef': true
    };
    function exportStar_2(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default"&& !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_49(exports);
    }
    return {
        setters:[
            function (bootstrap_1_1) {
                exports_49({
                    "bootstrap": bootstrap_1_1["bootstrap"]
                });
            },
            function (lifecycle_hooks_1_1) {
                exportStar_2(lifecycle_hooks_1_1);
            },
            function (directive_1_1) {
                exports_49({
                    "Component": directive_1_1["Component"]
                });
            },
            function (element_3_1) {
                exports_49({
                    "ElementRef": element_3_1["ElementRef"]
                });
            },
            function (di_7_1) {
                exportStar_2(di_7_1);
            }],
        execute: function() {
        }
    }
});
System.register("mojito/runtime", ["runtime/runtime"], function(exports_50, context_51) {
    "use strict";
    var __moduleName = context_51 && context_51.id;
    function exportStar_3(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_50(exports);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qaXRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliL2RlYnVnL2Fzc2VydC9hc3NlcnQudHMiLCJsaWIvZGVidWcvbG9nZ2VyL2xvZ2dlci50cyIsImxpYi9kZWJ1Zy9kZWJ1Zy50cyIsImxpYi9jb3JlL2dldC9nZXQudHMiLCJsaWIvY29yZS9hcnJheS9hcnJheS50cyIsImxpYi9jb3JlL21ldGEvbWV0YS50cyIsImxpYi9jb3JlL2l0ZXJhdG9yL2l0ZXJhdG9yLnRzIiwibGliL2NvcmUvd2F0Y2gvd2F0Y2gudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmUudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmFibGUudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmFibGVPYmplY3QudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmVyLnRzIiwibGliL2NvcmUvcHJvcGVydGllcy9wcm9wZXJ0eUV2ZW50cy50cyIsImxpYi9jb3JlL3Byb3BlcnRpZXMvbWFuZGF0b3J5X3NldC50cyIsImxpYi9jb3JlL3Byb3BlcnRpZXMvcHJvcGVydGllcy50cyIsImxpYi9jb3JlL29iamVjdC9vYmplY3QudHMiLCJsaWIvY29yZS9zZXQvc2V0LnRzIiwibGliL2NvcmUvbWFwL21hcC50cyIsImxpYi9jb3JlL29ic2VydmFibGUvb2JzZXJ2ZXMudHMiLCJsaWIvY29yZS9jb3JlLnRzIiwibGliL21vaml0by9jb3JlLnRzIiwibGliL3V0aWxzL2NsYXNzL2NsYXNzLnRzIiwibGliL3J1bnRpbWUvYW5ub3RhdGlvbnMvYW5ub3RhdGlvbnMudHMiLCJsaWIvdXRpbHMvc3RyaW5nL3N0cmluZ2lmeS50cyIsImxpYi9ydW50aW1lL2RpL21ldGFkYXRhLnRzIiwibGliL3J1bnRpbWUvZGkvZm9yd2FyZF9yZWYudHMiLCJsaWIvcnVudGltZS9kaS9wcm92aWRlci50cyIsImxpYi9ydW50aW1lL2RpL2luamVjdG9yLnRzIiwibGliL3J1bnRpbWUvZGkvZGVjb3JhdG9ycy50cyIsImxpYi9ydW50aW1lL2RpL2RpLnRzIiwibGliL3V0aWxzL2RvbS9kb20udHMiLCJsaWIvcmVuZGVyL3BhcnNlci9jb250ZXh0LnRzIiwibGliL3JlbmRlci9wYXJzZXIvZG9tX3BhcnNlci50cyIsImxpYi9yZW5kZXIvcGFyc2VyL2hvb2tzL2hvb2tzLnRzIiwibGliL3J1bnRpbWUvY29tcG9uZW50L3JlZ2lzdHJ5LnRzIiwibGliL3JlbmRlci9wYXJzZXIvaG9va3MvY29tcG9uZW50LnRzIiwibGliL3JlbmRlci9wYXJzZXIvcGFyc2VyLnRzIiwibGliL3J1bnRpbWUvdmlldy9mYWN0b3J5LnRzIiwibGliL3J1bnRpbWUvdmlldy92aWV3LnRzIiwibGliL3J1bnRpbWUvdmlldy9lbGVtZW50LnRzIiwibGliL3J1bnRpbWUvdmlldy9ob3N0LnRzIiwibGliL3J1bnRpbWUvY29tcG9uZW50L3JlZmVyZW5jZS50cyIsImxpYi9ydW50aW1lL2NvbXBvbmVudC9tZXRhZGF0YS50cyIsImxpYi9ydW50aW1lL2NvbXBvbmVudC9mYWN0b3J5LnRzIiwibGliL3J1bnRpbWUvY29tcG9uZW50L3Jlc29sdmVyLnRzIiwibGliL3J1bnRpbWUvYm9vdHN0cmFwL2Jvb3RzdHJhcC50cyIsImxpYi9ydW50aW1lL2xpZmVjeWNsZS9saWZlY3ljbGVfaG9va3MudHMiLCJsaWIvcnVudGltZS9jb21wb25lbnQvZGlyZWN0aXZlLnRzIiwibGliL3J1bnRpbWUvcnVudGltZS50cyIsImxpYi9tb2ppdG8vcnVudGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7O09BT0c7SUFDSCxnQkFBdUIsU0FBa0IsRUFBRSxPQUFlLEVBQUUsU0FBNEI7UUFDcEYsSUFBSSxXQUFXLEdBQUcsU0FBUyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2Is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