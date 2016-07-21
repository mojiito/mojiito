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
        let CustomError = ErrorType ? ErrorType : Error;
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
            class Logger {
                /**
                 * Creates an instance of Logger with a specific private {@link LogLevel}.
                 *
                 * @param {LogLevel} level Specified LogLevel
                 */
                constructor(level) {
                    this.privatelevel = LogLevel.debug;
                    this.privatelevel = level;
                }
                log(level, message, type) {
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
                    if (!!console && typeof console[method] === 'function') {
                        console[method](typeof message === 'function' ? message() : message);
                    }
                }
                static log(level, message, type) {
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
                static setGlobalLevel(level) {
                    Logger.globalLoggerInstance.privatelevel = level;
                }
            }
            Logger.globalLevel = LogLevel.debug;
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
        const source = obj; // needed for enabled noImplicitAny    
        const properties = propertyName.split('.');
        const property = properties.slice(0, 1)[0];
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
            class CoreArray {
                /**
                 * Creates an instance of CoreArray.
                 *
                 * @param {Array<any>} [array] Array to create CoreArray from
                 */
                constructor(array) {
                    debug_2.assert(this instanceof CoreArray, 'A CoreArray can only be instantiated with `new` or `CoreArray.create()`');
                    const source = [];
                    if (Array.isArray(array)) {
                        for (let i = 0, max = array.length; i < max; i++) {
                            source.push(array[i]);
                        }
                    }
                    meta_1.Meta.peek(this).setProperty('values', 'source', source, {
                        writable: false,
                        enumerable: true,
                        configurable: false
                    });
                }
                /**
                 * Length of the array
                 *
                 * @type {number}
                 */
                get length() {
                    const source = meta_1.Meta.peek(this).getProperty('values', 'source');
                    return source.length >>> 0;
                }
                /**
                 * Length of the array
                 */
                set length(value) {
                    throw new Error('Setting a length of a CoreArray is not allowed');
                }
                /**
                 * Source of the CoreArray
                 *
                 * @type {Array<any>}
                 */
                get source() {
                    return meta_1.Meta.peek(this).getProperty('values', 'source');
                }
                /**
                 * Source of the CoreArray
                 */
                set source(value) {
                    throw new Error('Setting the source of a CoreArray is not allowed');
                }
                concat(...values) {
                    for (let index = 0, max = values.length; index < max; index++) {
                        let element = values[index];
                        if (element instanceof CoreArray) {
                            values[index] = element.toArray();
                        }
                    }
                    const result = this.source.concat.apply(this.source, values);
                    return new CoreArray(result);
                }
                /**
                 * Returns the element at a specific position.
                 *
                 * @param {number} index Position of the element
                 * @returns {*} The found element
                 */
                elementAt(index) {
                    return this.source[index];
                }
                /**
                 * Tests whether all elements in the array pass the test
                 * implemented by the provided function.
                 *
                 * @param {Function} callback Function to test for each element.
                 * @param {*} [thisArg] Value to use as this when executing callback.
                 * @returns {boolean} true if every element passes the test, false if not
                 */
                every(callback, thisArg) {
                    return this.source.every.call(this.source, (value, index, array) => {
                        return callback.call(thisArg ? thisArg : this, value, index, this);
                    }, thisArg);
                }
                /**
                 * Creates a new array with all elements that pass the test
                 * implemented by the provided function.
                 *
                 * @param {Function} callback Function to test each element of the CoreArray
                 * @param {*} [thisArg] Value to use as this when executing callback
                 * @returns {CoreArray} New CoreArray with all elements that pass
                 */
                filter(callback, thisArg) {
                    const result = this.source.filter.call(this.source, (value, index, array) => {
                        return callback.call(thisArg ? thisArg : this, value, index, this);
                    }, thisArg);
                    return new CoreArray(result);
                }
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
                filterBy(key, value, thisArg) {
                    return this.filter(function (elementValue) {
                        return typeof elementValue === 'object' && elementValue[key]
                            && (typeof value === 'undefined' && !!elementValue[key]
                                || typeof value !== 'undefined' && elementValue[key] === value);
                    }, thisArg);
                }
                /**
                 * Returns a value in the array, if an element in the array
                 * satisfies the provided testing function.
                 * Otherwise `undefined` is returned.
                 *
                 * @param {Function} predicate Function to execute on each value in the array.
                 * @param {*} [thisArg] Object to use as this when executing callback.
                 * @returns {*} value of the found element or `undefined`
                 */
                find(predicate, thisArg) {
                    const source = this.source;
                    const fn = source['find'];
                    if (typeof fn === 'function') {
                        return fn.call(source, (element, index, array) => {
                            return predicate.call(thisArg ? thisArg : this, element, index, this);
                        }, thisArg);
                    }
                    else {
                        let value;
                        for (let i = 0, max = source.length >>> 0; i < max; i++) {
                            value = source[i];
                            if (predicate.call(thisArg ? thisArg : this, value, i, this)) {
                                return value;
                            }
                        }
                        return undefined;
                    }
                }
                /**
                 * Returns a object in the array, if the property of the
                 * object is equal to the provided value
                 *
                 * @param {string} propertyName name of the property to look for
                 * @param {*} value value of the property in the object to check for
                 * @returns {*} found object or `undefined`
                 */
                findBy(propertyName, value) {
                    const source = this.source;
                    const fn = source['find'];
                    let obj;
                    for (let i = 0, max = source.length >>> 0; i < max; i++) {
                        obj = source[i];
                        if (typeof obj === 'object' && obj[propertyName] === value) {
                            return obj;
                        }
                    }
                    return undefined;
                }
                /**
                 * returns an index in the array, if an element in the array
                 * satisfies the provided testing function.
                 * Otherwise -1 is returned
                 *
                 * @param {Function} predicate Function to execute on each value in the array
                 * @param {*} [thisArg] Object to use as this when executing callback.
                 * @returns {number} index of the found element or -1
                 */
                findIndex(predicate, thisArg) {
                    const source = this.source;
                    const fn = source['findIndex'];
                    if (typeof fn === 'function') {
                        return fn.call(source, (element, index, array) => {
                            return predicate.call(thisArg ? thisArg : this, element, index, this);
                        }, thisArg);
                    }
                    else {
                        let value;
                        for (let i = 0, max = source.length >>> 0; i < max; i++) {
                            value = source[i];
                            if (predicate.call(thisArg ? thisArg : this, value, i, this)) {
                                return i;
                            }
                        }
                        return -1;
                    }
                }
                /**
                 * Executes a provided function once per array element.
                 *
                 * @param {Function} callback Function to execute for each element.
                 * @param {*} [thisArg] Value to use as this when executing callback.
                 * @returns {void}
                 */
                forEach(callback, thisArg) {
                    const source = this.source;
                    const fn = source['forEach'];
                    if (typeof fn === 'function') {
                        return fn.call(source, (currentValue, index, array) => {
                            callback.call(thisArg ? thisArg : this, currentValue, index, this);
                        }, thisArg);
                    }
                    else {
                        for (let i = 0, max = source.length >>> 0; i < max; i++) {
                            callback.call(thisArg, source[i], i, this);
                        }
                    }
                }
                /**
                 * Determines whether an array includes a certain element, returning true or false as appropriate.
                 *
                 * @param {*} searchElement The element to search for.
                 * @param {number} [fromIndex] The position in this array at which to begin searching for searchElement.
                 * @returns {boolean} true if searchElement is found, false if not
                 */
                includes(searchElement, fromIndex) {
                    const source = this.source;
                    const fn = source['includes'];
                    if (typeof fn === 'function') {
                        return fn.apply(this.source, arguments);
                    }
                    else {
                        for (let i = fromIndex >>> 0, max = source.length >>> 0; i < max; i++) {
                            if (source[i] === searchElement) {
                                return true;
                            }
                        }
                        return false;
                    }
                }
                /**
                 * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
                 *
                 * @param {*} searchElement Element to locate in the array.
                 * @param {number} [fromIndex] The index to start the search at.
                 * @returns {number} Position of the found element, -1 if not found
                 */
                indexOf(searchElement, fromIndex) {
                    return this.source.indexOf.apply(this.source, arguments);
                }
                /**
                 * Joins all elements of an array into a string.
                 *
                 * @param {string} [separator] Specifies a string to separate each element of the array.
                 * @returns {string} String of the joined elements
                 */
                join(separator) {
                    return this.source.join.apply(this.source, arguments);
                }
                /**
                 * returns the last index at which a given element can be
                 * found in the array, or -1 if it is not present.
                 * The array is searched backwards, starting at fromIndex.
                 *
                 * @param {*} searchElement Element to locate in the array.
                 * @param {number} [fromIndex] The index at which to start searching backwards.
                 * @returns {number} Position of the found element, -1 if not found
                 */
                lastIndexOf(searchElement, fromIndex) {
                    return this.source.lastIndexOf.apply(this.source, arguments);
                }
                /**
                 * Creates a new array with the results of calling a provided function on every element in this array.
                 *
                 * @param {Function} callback Function that produces an element of the new Array
                 * @param {*} [thisArg] Value to use as this when executing callback.
                 * @returns {CoreArray} Created array
                 */
                map(callback, thisArg) {
                    const result = this.source.concat.call(this.source, (currentValue, index, array) => {
                        callback.call(thisArg ? thisArg : this, currentValue, index, this);
                    }, thisArg);
                    return new CoreArray(result);
                }
                /**
                 * Removes the last element from an array and returns that element.
                 *
                 * @returns {*} Removed element
                 */
                pop() {
                    return this.source.pop.apply(this.source, arguments);
                }
                push(...elements) {
                    let length = this.source.push.apply(this.source, arguments);
                    return length;
                }
                /**
                 * Applies a function against an accumulator and each value
                 * of the array (from left-to-right) to reduce it to a single value.
                 *
                 * @param {Function} callback Function to execute on each value in the array.
                 * @param {*} initialValue Value to use as the first argument to the first call of the callback.
                 * @returns {*} The value returned would be that of the last callback invocation.
                 */
                reduce(callback, initialValue) {
                    return this.source.reduce.call(this.source, (previousValue, currentValue, currentIndex, array) => {
                        callback.call(this, previousValue, currentValue, currentIndex, this);
                    });
                }
                /**
                 * Applies a function against an accumulator and each value
                 * of the array (from right-to-left) has to reduce it to a single value.
                 *
                 * @param {Function} callback Function to execute on each value in the array.
                 * @param {*} initialValue Object to use as the first argument to the first call of the callback.
                 * @returns {*} The value returned would be that of the last callback invocation.
                 */
                reduceRight(callback, initialValue) {
                    return this.source.reduceRight.call(this.source, (previousValue, currentValue, currentIndex, array) => {
                        callback.call(this, previousValue, currentValue, currentIndex, this);
                    });
                }
                /**
                 * Reverses an array in place.
                 * The first array element becomes the last and the last becomes the first.
                 *
                 * @returns {CoreArray} The reversed array
                 */
                reverse() {
                    return this.source.reverse.apply(this.source, arguments);
                }
                /**
                 * Removes the first element from an array and returns that element.
                 * This method changes the length of the array.
                 *
                 * @returns {*} The first element of the array
                 */
                shift() {
                    return this.source.shift.apply(this.source, arguments);
                }
                /**
                 * Returns a shallow copy of a portion of an array into a new array object.
                 *
                 * @param {number} [begin] Zero-based index at which to begin extraction.
                 * @param {number} [end] Zero-based index at which to end extraction.
                 * @returns {CoreArray} New sliced array
                 */
                slice(begin, end) {
                    const result = this.source.slice.apply(this.source, arguments);
                    return new CoreArray(result);
                }
                /**
                 * Tests whether some element in the array passes the test
                 * implemented by the provided function.
                 *
                 * @param {Function} callback Function to test for each element.
                 * @param {*} [thisArg] Value to use as this when executing callback.
                 */
                some(callback, thisArg) {
                    return this.source.some.call(this.source, (currentValue, index, array) => {
                        callback.call(thisArg ? thisArg : this, currentValue, index, this);
                    }, thisArg);
                }
                /**
                 * Sorts the elements of an array in place and returns the array.
                 * The default sort order is according to string Unicode code points.
                 *
                 * @param {Function} [compareFunction] Specifies a function that defines the sort order.
                 * @returns {CoreArray} Returns the sorted CoreArray
                 */
                sort(compareFunction) {
                    this.source.sort.apply(this, arguments);
                    return this;
                }
                splice(start, deleteCount, ...elements) {
                    const result = this.source.splice.apply(this.source, arguments);
                    return new CoreArray(result);
                }
                /**
                 * Converts the CoreArray to a native Array
                 *
                 * @returns {Array<any>} The converted native Array
                 */
                toArray() {
                    return this.source;
                }
                unshift(...elements) {
                    return this.source.unshift.apply(this.source, arguments);
                }
                /**
                 * Static method to provide functionality for `CoreArray.create()`
                 *
                 * @static
                 * @param {Array<any>} [array] Elements to insert initially
                 * @returns {CoreArray} Newly created CoreArray
                 */
                static create(array) {
                    debug_2.assert(Array.isArray(array) || typeof array === 'undefined', 'The Array provided to the create method must be an array', TypeError);
                    return new CoreArray(array);
                }
            }
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
            class Meta {
                /**
                 * Creates the member on a meta hash
                 *
                 * @param  {string} memberKey The name(key) of the member to be created
                 * @returns {Object} The created member object
                 */
                createMember(memberKey) {
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
                }
                /**
                 * Checks if the member is already there, otherwise
                 * it will create it. The member gets returned.
                 *
                 * @param  {string} memberKey The name(key) of the member to be peeked
                 * @returns {Object} The peeked member object
                 */
                peekMember(memberKey) {
                    debug_3.assert(arguments.length === 1, 'peekMember on an meta hash must be called with one arguments: a member key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the peekMember method on a meta hash must be a string', TypeError);
                    const member = this.createMember(memberKey);
                    return member ? member : this.getMember(memberKey);
                }
                /**
                 * Returns the member of the meta hash
                 * or `undefined` it does not exist
                 *
                 * @param  {string} memberKey The name(key) of the member to be returned
                 * @returns {Object} The member object or `undefined`
                 */
                getMember(memberKey) {
                    debug_3.assert(arguments.length === 1, 'getMember on an meta hash must be called with one arguments: a member key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the getMember method on a meta hash must be a string', TypeError);
                    const source = this; // needed for enabled noImplicitAny
                    memberKey = '_' + memberKey;
                    return source[memberKey];
                }
                /**
                 * Checks if the meta hash has a specific member
                 *
                 * @param  {string} memberKey The name(key) of the member to be checked
                 * @returns {boolean} true if member exists, false if not
                 */
                hasMember(memberKey) {
                    debug_3.assert(arguments.length === 1, 'hasMember on an meta hash must be called with one arguments: a member key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the hasMember method on a meta hash must be a string', TypeError);
                    return !!this.getMember(memberKey);
                }
                /**
                 * Deletes all the properties of a member in the meta hash.
                 *
                 * @param  {string} memberKey The name(key) of the member to be cleared
                 * @returns {boolean} true if clear was successful, false if not
                 */
                clearMember(memberKey) {
                    debug_3.assert(arguments.length === 1, 'clearMember on an meta hash must be called with one arguments: a member key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the clearMember method on a meta hash must be a string', TypeError);
                    let member = this.getMember(memberKey);
                    if (member) {
                        let status = true;
                        for (let propertyKey in member) {
                            status = this.deleteProperty(memberKey, propertyKey) ? status : false;
                        }
                        return status;
                    }
                    // No member to be cleared found -> false
                    return false;
                }
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
                setProperty(memberKey, propertyKey, value, descriptor) {
                    debug_3.assert(arguments.length === 3 || arguments.length === 4, 'setProperty on an meta hash must be called with three arguments; a member key, a property key and a value; optional you can add a descriptor');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the setProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyKey === 'string', 'The property key provided to the setProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof descriptor === 'undefined' || typeof descriptor === 'object', 'The descriptor provided to the setProperty method on a meta hash must be a PropertyDescriptor', TypeError);
                    let member = this.getMember(memberKey);
                    let isValueSet = false;
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
                }
                setProperties(memberKey, propertyMap, descriptor) {
                    debug_3.assert(arguments.length === 2 || arguments.length === 3, 'setProperties on an meta hash must be called with two arguments; a member key, and a  property map; optional you can add a descriptor');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the setProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyMap === 'object', 'The propertyMap provided to the setProperties method on a meta hash must be an object', TypeError);
                    debug_3.assert(typeof descriptor === 'undefined' || typeof descriptor === 'object', 'The descriptor provided to the setProperties method on a meta hash must be a PropertyDescriptor', TypeError);
                    const map = propertyMap;
                    for (let propertyName in propertyMap) {
                        this.setProperty(memberKey, propertyName, map[propertyName], descriptor);
                    }
                }
                /**
                 * Returns the property of a member in the meta hash
                 * or `undefined` if the property or the member do not exist.
                 *
                 * @param  {string} memberKey The name(key) of the member where to look for the property
                 * @param  {string} propertyKey The name(key) of the requeste property
                 * @returns {*} The requested property
                 */
                getProperty(memberKey, propertyKey) {
                    debug_3.assert(arguments.length === 2, 'getProperty on an meta hash must be called with two arguments; a member key and a property key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the getProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyKey === 'string', 'The property key provided to the getProperty method on a meta hash must be a string', TypeError);
                    const member = this.peekMember(memberKey);
                    return member[propertyKey];
                }
                /**
                 * Checks if the member of the meta hash has a specific property
                 *
                 * @param  {string} memberKey The name(key) of the member where to look for the property
                 * @param  {string} propertyKey The name(key) of the property to be checked
                 * @returns {boolean} true if the property was found, false if not
                 */
                hasProperty(memberKey, propertyKey) {
                    debug_3.assert(arguments.length === 2, 'hasProperty on an meta hash must be called with two arguments; a member key and a property key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the hasProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyKey === 'string', 'The property key provided to the hasProperty method on a meta hash must be a string', TypeError);
                    return !!this.getProperty(memberKey, propertyKey);
                }
                /**
                 * Deletes a property of a member in the meta hash
                 *
                 * @param  {string} memberKey The name(key) of the member where to delete the property
                 * @param  {string} propertyKey The name(key) of the property to be deleted
                 * @returns {boolean} true if deletion was successful, false if not
                 */
                deleteProperty(memberKey, propertyKey) {
                    debug_3.assert(arguments.length === 2, 'deleteProperty on an meta hash must be called with two arguments; a member key and a property key');
                    debug_3.assert(typeof memberKey === 'string', 'The member key provided to the deleteProperty method on a meta hash must be a string', TypeError);
                    debug_3.assert(typeof propertyKey === 'string', 'The property key provided to the deleteProperty method on a meta hash must be a string', TypeError);
                    const source = this; // needed for enabled noImplicitAny
                    if (source.hasProperty(memberKey, propertyKey)) {
                        memberKey = '_' + memberKey;
                        source[memberKey][propertyKey] = null;
                        delete source[memberKey][propertyKey];
                        return !source[memberKey][propertyKey];
                    }
                    return false;
                }
                static extend(obj) {
                    var meta = new Meta();
                    Object.defineProperty(obj, Meta.META_FIELD, {
                        writable: false,
                        configurable: false,
                        enumerable: false,
                        value: meta
                    });
                    return meta;
                }
                static peek(obj) {
                    debug_3.assert(arguments.length === 1, 'Meta.peek on an object or array must be called with one arguments; the object or array');
                    debug_3.assert(typeof obj === 'object', 'The object or array provided to the Meta.peek method must be a object or array', TypeError);
                    const source = obj; // needed for enabled noImplicitAny
                    let meta = source[Meta.META_FIELD];
                    if (!meta) {
                        meta = Meta.extend(obj);
                    }
                    return meta;
                }
            }
            Meta.META_FIELD = '__mojito_meta__';
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
            class Iterator {
                constructor(source) {
                    this._nextIndex = 0;
                    debug_4.assert(arguments.length === 1, 'CoreIterator must be created with one argument; an iterable object');
                    debug_4.assert(typeof source.length === 'number', 'The source property has to be a iterable object', TypeError);
                    this._source = source;
                }
                next() {
                    let source = this._source;
                    return this._nextIndex < source.length ? { value: source[this._nextIndex++], done: false } : { done: true };
                }
            }
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
        let parts = path.split('.');
        let source = obj;
        for (let i = 0, max = parts.length; i < max; i++) {
            let part = parts[i];
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
        let parts = keyOrPath.split('.');
        let source = obj;
        for (let i = 0, max = parts.length; i < max; i++) {
            let part = parts[i];
            if (i >= parts.length - 1) {
                let observer = meta_2.Meta.peek(source).getProperty('observers', part);
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
            class ObservableObject extends object_1.CoreObject {
                constructor(obj) {
                    super(obj);
                }
                observe(keysOrPaths, callback) {
                    return observe_1.observe(this, keysOrPaths, callback, this);
                }
                unobserve() {
                }
                static create(obj) {
                    return new ObservableObject(obj);
                }
            }
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
        let observer = meta_3.Meta.peek(obj).getProperty('observers', key);
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
            class Observer {
                constructor(callback, thisArg) {
                    this._callbacks = [];
                    debug_5.assert(arguments.length < 3, 'The observer must be created with none or one or two arguments; optional a callback function and a context');
                    debug_5.assert(typeof callback === 'undefined' || typeof callback === 'function', 'The callback provided to the observer must be a function', TypeError);
                    if (callback) {
                        this.subscribe(callback, thisArg);
                    }
                }
                subscribe(callback, thisArg) {
                    debug_5.assert(arguments.length === 2, 'The subscribe method must be called with one or two arguments; a callback function and optional a context');
                    debug_5.assert(typeof callback === 'function', 'The callback provided to the subscribe method must be a function', TypeError);
                    this._callbacks.push({ fn: callback, thisArg: thisArg });
                }
                unsubscribe() {
                }
                notify(thisArg) {
                    let callbacks = this._callbacks;
                    for (let i = 0, max = callbacks.length; i < max; i++) {
                        let callback = callbacks[i];
                        callback.fn.call(thisArg ? thisArg : callback.thisArg);
                    }
                }
            }
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
        const meta = meta_4.Meta.peek(obj);
        let oldValue = meta.getProperty('values', propertyName);
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
                get() {
                    return meta_5.Meta.peek(obj).getProperty('values', propertyName);
                },
                set(value) {
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
            class CoreObject {
                /**
                 * Creates an instance of CoreObject.
                 *
                 * @param {Object} [obj] Object or property map to define properties
                 */
                constructor(obj) {
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
                get(propertyName) {
                    debug_7.assert(arguments.length === 1, 'get must be called with one argument; a propertyName');
                    debug_7.assert(typeof propertyName === 'string', 'The propertyName to the get method must be a string', TypeError);
                    return get_1.get(this, propertyName);
                }
                /**
                 * Sets the provided key or path on the object to the value.
                 *
                 * @param {string} propertyName The name(key) of the property
                 * @param {*} value Value to be set on the property
                 * @returns {*} Value which has been set on the property
                 */
                set(propertyName, value) {
                    debug_7.assert(arguments.length === 2, 'set must be called with two arguments; a propertyName and value');
                    debug_7.assert(typeof propertyName === 'string', 'The propertyName to the set method must be a string', TypeError);
                    return set_1.set(this, propertyName, value);
                }
                /**
                 * Returns the Meta hash of this CoreObject
                 *
                 * @returns {Meta} The Meta hash/map
                 */
                getMeta() {
                    return meta_6.Meta.peek(this);
                }
                /**
                 * Static method to provide functionality for `CoreObject.create()`
                 *
                 * @static
                 * @param {Object} [obj] Object or property map to define properties
                 * @returns {CoreObject} Newly created CoreObject
                 */
                static create(obj) {
                    debug_7.assert(typeof obj === 'object' || typeof obj === 'undefined', 'The object when provided to the create method must be an object', TypeError);
                    return new this(obj);
                }
                /**
                 * Custom defineProperty method for change detection
                 *
                 * @static
                 * @param {CoreObject} sourceObject The object where to define the property
                 * @param {string} propertyName The name(key) of the property to be defined
                 * @param {*} [value] The value to be set on the property
                 */
                static defineProperty(sourceObject, propertyName, value) {
                    debug_7.assert(arguments.length === 2 || arguments.length === 3, 'defineProperty must be called with at least two arguments; a sourceObject, a propertyName and optional a value');
                    debug_7.assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperty method must be an object', TypeError);
                    debug_7.assert(typeof propertyName === 'string', 'The propertyName provided to the defineProperty method must be a string', TypeError);
                    debug_7.assert(!(value instanceof meta_6.Meta), 'Defining a meta hash is not allowed');
                    properties_2.defineProperty(sourceObject, propertyName, value);
                }
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
                static defineProperties(sourceObject, propertyMap) {
                    debug_7.assert(arguments.length === 1 || arguments.length === 2, 'defineProperties must be called with at least one arguments; a sourceObject and optional a propertyMap');
                    debug_7.assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperties method must be an object', TypeError);
                    debug_7.assert(typeof propertyMap === 'undefined' || typeof propertyMap === 'object', 'The propertyMap provided to the defineProperties method must be an object', TypeError);
                    if (propertyMap) {
                        CoreObject.defineProperties(sourceObject);
                    }
                    const properties = !!propertyMap ? propertyMap : sourceObject;
                    // replace every property with a defined one
                    for (var key in properties) {
                        let value = properties[key];
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
                }
                /**
                 * Checks if property is already defined by mojito's
                 * defineProperty method.
                 *
                 * @static
                 * @param {CoreObject} sourceObject The object where to look for the property
                 * @param {string} propertyName The name(key) of the defined property
                 * @returns {boolean} true if property is defined, false if not
                 */
                static isDefinedProperty(sourceObject, propertyName) {
                    debug_7.assert(arguments.length === 2, 'isDefinedProperty must be called with two arguments; a sourceObject and a propertyName');
                    debug_7.assert(typeof sourceObject === 'object', 'The sourceObject provided to the isDefinedProperty method must be an object', TypeError);
                    debug_7.assert(typeof propertyName === 'string', 'The propertyName provided to the isDefinedProperty method must be a string', TypeError);
                    return properties_2.isDefinedProperty(sourceObject, propertyName);
                }
            }
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
        const source = obj; // needed for enabled noImplicitAny    
        const properties = propertyName.split('.');
        const property = properties.slice(0, 1)[0];
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
            class CoreMap {
                constructor(source) {
                    /**
                     * Internal Array where all thoses keys and values are stored.
                     *
                     * @private
                     * @type {Array<[any, any]}
                     */
                    this._source = [];
                    if (Array.isArray(source)) {
                        for (let i = 0, max = source.length; i < max; i++) {
                            let item = source[i];
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
                /**
                 * Returns the number of key/value pairs in the Map object.
                 *
                 * @readonly
                 * @type {number}
                 */
                get size() {
                    return this._source.length;
                }
                /**
                 * The value of the length property is 0.
                 * To fulfill the ES2015 specification the Map must implement
                 * a length property even if it always returns 0:
                 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map#Properties
                 *
                 * @readonly
                 * @type {number}
                 */
                get length() {
                    debug_9.Logger.log(debug_9.LogLevel.debug, `Don't use length property on CoreMaps!!`, debug_9.LogType.warn);
                    return 0;
                }
                /**
                 * Removes all key/value pairs from the Map object.
                 */
                clear() {
                    this._source = [];
                }
                /**
                 * Removes any value associated to the key and returns the value that Map.has(key) would have previously returned.
                 * Map.prototype.has(key) will return false afterwards.
                 *
                 * @param {*} key The key of the element to remove from the Map object.
                 */
                delete(key) {
                    let source = this._source;
                    for (let i = 0, max = source.length >>> 0; i < max; i++) {
                        if (source[i][0] === key) {
                            source.splice(i, 1);
                            break;
                        }
                    }
                }
                /**
                 * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
                 *
                 * @returns {Iterator<[any,any]>} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
                 */
                entries() {
                    return new iterator_1.Iterator(this._source);
                }
                /**
                 * Calls callbackFn once for each key-value pair present in the Map object, in insertion order.
                 * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
                 *
                 * @param {(value: any, key: any, map: CoreMap) => void} callbackFn Function to execute for each element.
                 * @param {(Object | Function)} [thisArg] Value to use as this when executing callback.
                 */
                forEach(callbackFn, thisArg) {
                    let source = this._source;
                    for (let i = 0, max = source.length >>> 0; i < max; i++) {
                        let entry = source[i];
                        callbackFn.call(thisArg, entry[1], entry[0], this);
                    }
                }
                /**
                 * Returns the value associated to the key, or undefined if there is none.
                 *
                 * @param {*} key The key of the element to return from the Map object.
                 * @returns {*} Value associated to the key, or undefined
                 */
                get(key) {
                    let source = this._source;
                    for (let i = 0, max = source.length >>> 0; i < max; i++) {
                        if (key === source[i][0]) {
                            return source[i][1];
                        }
                    }
                    return undefined;
                }
                /**
                 * Returns a boolean asserting whether a value has been associated to the key in the Map object or not.
                 *
                 * @param {*} key The key of the element to test for presence in the Map object.
                 * @returns {boolean} Value associated to the key
                 */
                has(key) {
                    return !!this.get(key);
                }
                /**
                 * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
                 *
                 * @returns {Iterator<any>} Iterator object that contains the keys for each element in the Map object in insertion order
                 */
                keys() {
                    let keys = [];
                    this.forEach((value, key) => {
                        keys.push(key);
                    });
                    return new iterator_1.Iterator(keys);
                }
                /**
                 * Sets the value for the key in the Map object. Returns the Map object.
                 *
                 * @param {*} key The key of the element to add to the Map object.
                 * @param {*} value The value of the element to add to the Map object.
                 * @returns {CoreMap} The Map object
                 */
                set(key, value) {
                    let source = this._source;
                    for (let i = 0, max = source.length >>> 0; i < max; i++) {
                        if (key === source[i][0]) {
                            source[i][1] = value;
                            return this;
                        }
                    }
                    source.push([key, value]);
                    return this;
                }
                /**
                 * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
                 *
                 * @returns {CoreMapIterator} Iterator object that contains the values for each element in the Map object in insertion order
                 */
                values() {
                    let keys = [];
                    this.forEach((value, key) => {
                        keys.push(value);
                    });
                    return new iterator_1.Iterator(keys);
                }
                static create(source) {
                    return new CoreMap(source);
                }
            }
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
            class TypedMap extends CoreMap {
                constructor(source) {
                    super(source);
                }
                /**
                 * Removes any value associated to the key and returns the value that Map.has(key) would have previously returned.
                 * Map.prototype.has(key) will return false afterwards.
                 *
                 * @param {K} key The key of the element to remove from the Map object.
                 */
                delete(key) {
                    super.delete(key);
                }
                /**
                 * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
                 *
                 * @returns {Iterator<[K, V]>} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
                 */
                entries() {
                    return super.entries();
                }
                /**
                 * Calls callbackFn once for each key-value pair present in the Map object, in insertion order.
                 * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
                 *
                 * @param {(value: any, key: any, map: TypedMap) => void} callbackFn Function to execute for each element.
                 * @param {(Object | Function)} [thisArg] Value to use as this when executing callback.
                 */
                forEach(callbackFn, thisArg) {
                    super.forEach.apply(this, arguments);
                }
                /**
                 * Returns the value associated to the key, or undefined if there is none.
                 *
                 * @param {K} key The key of the element to return from the Map object.
                 * @returns {V} Value associated to the key, or undefined
                 */
                get(key) {
                    return super.get(key);
                }
                /**
                 * Returns a boolean asserting whether a value has been associated to the key in the Map object or not.
                 *
                 * @param {*} key The key of the element to test for presence in the Map object.
                 * @returns {boolean} Value associated to the key
                 */
                has(key) {
                    return super.has(key);
                }
                /**
                 * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
                 *
                 * @returns {Iterator<any>} Iterator object that contains the keys for each element in the Map object in insertion order
                 */
                keys() {
                    return super.keys();
                }
                /**
                 * Sets the value for the key in the Map object. Returns the Map object.
                 *
                 * @param {K} key The key of the element to add to the Map object.
                 * @param {V} value The value of the element to add to the Map object.
                 * @returns {TypedMap<K,V>} The Map object
                 */
                set(key, value) {
                    return super.set(key, value);
                }
                /**
                 * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
                 *
                 * @returns {CoreMapIterator} Iterator object that contains the values for each element in the Map object in insertion order
                 */
                values() {
                    return super.values();
                }
                static create(source) {
                    return new TypedMap(source);
                }
            }
            exports_18("TypedMap", TypedMap);
        }
    }
});
System.register("core/observable/observes", ["debug/debug", "core/observable/observe", "core/observable/observableObject"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var debug_10, observe_2, observableObject_1;
    function observes(...keys) {
        debug_10.assert(arguments.length > 0, 'The observes decorator must be called with at least one property key');
        return function (target, propertyKey, descriptor) {
            debug_10.assert(arguments.length === 3, 'The observe decorator callback must be called with three arguments; a target, a propertyKey and a descriptor');
            debug_10.assert(target instanceof observableObject_1.ObservableObject, 'The target provided to the observe decorator callback must be an object and an instace of `ObservableObject`', TypeError);
            debug_10.assert(typeof propertyKey === 'string', 'The property key provided to the observe decorator callback must be a string', TypeError);
            //const source: any = target;  // needed for enabled noImplicitAny
            const callback = descriptor.value;
            debug_10.assert(typeof callback === 'function', 'The callback for the observer has to be a function', TypeError);
            for (let i = 0, max = keys.length; i < max; i++) {
                let key = keys[i];
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
            class Annotations {
                constructor(classType) {
                    this._map = new map_2.CoreMap();
                    this._classType = classType;
                }
                get(annotationType) {
                    return this._map.get(annotationType);
                }
                getSingle(annotationType) {
                    let annotations = this.get(annotationType);
                    return Array.isArray(annotations) && annotations.length ? annotations[0] : null;
                }
                add(annotation) {
                    debug_11.assert(class_1.isClassInstance(annotation), `Annotation ${annotation} has to be an instance of a class`, TypeError);
                    let annotations = this.get(annotation['constructor']);
                    if (annotations === undefined) {
                        annotations = [];
                        this._map.set(annotation['constructor'], annotations);
                    }
                    annotations.push(annotation);
                }
                set(annotation) {
                    this._map.delete(annotation['constructor']);
                    this.add(annotation);
                }
                static peek(classType) {
                    if (this.isAnnotated(classType)) {
                        return Reflect.getMetadata('annotations', classType);
                    }
                    let annotations = new Annotations(classType);
                    Reflect.defineMetadata('annotations', annotations, classType);
                    return annotations;
                }
                static isAnnotated(classType) {
                    return Reflect.hasMetadata('annotations', classType);
                }
            }
            exports_23("Annotations", Annotations);
        }
    }
});
System.register("utils/string/stringify", ["utils/class/class"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var class_2;
    function stringify(token) {
        if (typeof token === 'string') {
            return token;
        }
        if (token === undefined || token === null) {
            return '' + token;
        }
        if (typeof token === 'function') {
            return class_2.getClassName(token);
        }
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
        setters:[
            function (class_2_1) {
                class_2 = class_2_1;
            }],
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
            class InjectableMetadata {
                constructor() {
                }
                toString() { return `@Injectable()`; }
            }
            exports_25("InjectableMetadata", InjectableMetadata);
            class InjectMetadata {
                constructor(token) {
                    this.token = token;
                }
                toString() { return `@Inject(${stringify_1.stringify(this.token)})`; }
            }
            exports_25("InjectMetadata", InjectMetadata);
        }
    }
});
System.register("runtime/di/provider", ["runtime/annotations/annotations", "runtime/di/metadata", "debug/debug", "utils/string/stringify"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var annotations_1, metadata_1, debug_12, stringify_2;
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
    function provide(token, { useClass, useValue, useFactory, dependencies }) {
        return new Provider(token, {
            useClass: useClass,
            useValue: useValue,
            useFactory: useFactory,
            dependencies: dependencies,
        });
    }
    exports_26("provide", provide);
    /**
     * Resolves an array of Providers or stuff that can be converted to a Provider
     *
     * @internal
     * @export
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @returns {ResolvedProvider[]}
     */
    function resolveProviders(providers) {
        let resolved = [];
        for (let i = 0, max = providers.length; i < max; i++) {
            let p = providers[i];
            if (p instanceof Provider) {
                resolved.push(resolveProvider(p));
            }
            else if (p instanceof Function) {
                resolved.push(resolveProvider(provide(p, { useClass: p })));
            }
            else if (Array.isArray(p)) {
                resolveProviders(p).map(resolvedP => resolved.push(resolvedP));
            }
            else {
                throw new TypeError(`${p} is not a valid provider!`);
            }
        }
        return resolved;
    }
    exports_26("resolveProviders", resolveProviders);
    /**
     * Resolves a single Provider and returns an ResolvedProvider
     *
     * @internal
     * @export
     * @param {Provider} provider
     * @returns {ResolvedProvider}
     */
    function resolveProvider(provider) {
        return new ResolvedProvider(provider.token, ResolvedFactory.resolve(provider));
    }
    exports_26("resolveProvider", resolveProvider);
    return {
        setters:[
            function (annotations_1_1) {
                annotations_1 = annotations_1_1;
            },
            function (metadata_1_1) {
                metadata_1 = metadata_1_1;
            },
            function (debug_12_1) {
                debug_12 = debug_12_1;
            },
            function (stringify_2_1) {
                stringify_2 = stringify_2_1;
            }],
        execute: function() {
            /**
             * Describes how the {@link Injector} should instantiate a given token.
             *
             * @export
             * @class Provider
             */
            class Provider {
                constructor(token, { useClass, useValue, useFactory, dependencies }) {
                    this.token = token;
                    this.useClass = useClass;
                    this.useValue = useValue;
                    this.useFactory = useFactory;
                    this.dependencies = dependencies;
                }
            }
            exports_26("Provider", Provider);
            /**
             * An internal resolved representation of a {@link Provider} used by the {@link Injector}.
             *
             * @export
             * @class ResolvedProvider
             */
            class ResolvedProvider {
                constructor(token, resolvedFactory) {
                    this._token = token;
                    this._resolvedFactory = resolvedFactory;
                }
                get token() {
                    return this._token;
                }
                get resolvedFactory() {
                    return this._resolvedFactory;
                }
            }
            exports_26("ResolvedProvider", ResolvedProvider);
            /**
             * An internal resolved representation of a factory function created by resolving {@link Provider}.
             *
             * A ResolvedFactory is basically a function which creates
             * and returns the item (class, value,.. ) provided.
             *
             * @export
             * @class ResolvedFactory
             */
            class ResolvedFactory {
                constructor(provider) {
                    this._dependencies = [];
                    let factoryFn;
                    if (provider.useClass) {
                        let dependencyTokens = annotations_1.Annotations.peek(provider.useClass).get(metadata_1.InjectMetadata);
                        if (Array.isArray(dependencyTokens)) {
                            let isInjectable = !!annotations_1.Annotations.peek(provider.useClass).get(metadata_1.InjectableMetadata);
                            debug_12.assert(!!isInjectable, `Cannot resolve all parameters for ${stringify_2.stringify(provider.useClass)}! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject`);
                            for (let i = 0, max = dependencyTokens.length; i < max; i++) {
                                let dep = dependencyTokens[i];
                                if (dep instanceof metadata_1.InjectMetadata) {
                                    this._dependencies.push(dep.token);
                                }
                            }
                        }
                        factoryFn = (dependecies = []) => {
                            return new (Function.prototype.bind.apply(provider.useClass, [null].concat(dependecies)));
                        };
                    }
                    else if (provider.useFactory) {
                        factoryFn = provider.useFactory;
                    }
                    else {
                        factoryFn = () => provider.useValue;
                    }
                    this._factoryFn = factoryFn;
                }
                get factory() {
                    return this._factoryFn;
                }
                get dependencies() {
                    return this._dependencies || [];
                }
                static resolve(provider) {
                    return new ResolvedFactory(provider);
                }
            }
            exports_26("ResolvedFactory", ResolvedFactory);
        }
    }
});
System.register("runtime/di/injector", ["core/core", "runtime/di/provider", "debug/debug", "utils/string/stringify"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var core_2, provider_1, debug_13, stringify_3;
    var Injector;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (provider_1_1) {
                provider_1 = provider_1_1;
            },
            function (debug_13_1) {
                debug_13 = debug_13_1;
            },
            function (stringify_3_1) {
                stringify_3 = stringify_3_1;
            }],
        execute: function() {
            /**
             * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
             * constructor dependencies.
             *
             * @export
             * @class Injector
             */
            class Injector {
                /**
                 * Creates an instance of Injector.
                 *
                 * @param {ResolvedProvider[]} providers
                 * @param {Injector} [parent=null]
                 */
                constructor(providers, parent = null) {
                    this._parent = null;
                    this._providers = [];
                    this._values = new core_2.CoreMap();
                    this._parent = parent;
                    this._providers = providers;
                }
                /**
                 * The parent of this injector
                 *
                 * @readonly
                 * @type {Injector}
                 */
                get parent() {
                    return this._parent || null;
                }
                /**
                 * Turns an array of provider definitions into an array of resolved providers.
                 *
                 * @static
                 * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
                 * @returns {ResolvedProvider[]}
                 */
                static resolve(providers) {
                    return provider_1.resolveProviders(providers);
                }
                /**
                 * Resolves an array of providers and creates an injector from those providers.
                 *
                 * @static
                 * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
                 * @param {Injector} [parent=null]
                 * @returns
                 */
                static resolveAndCreate(providers, parent = null) {
                    let resolvedProviders = Injector.resolve(providers);
                    return Injector.fromResolvedProviders(resolvedProviders, parent);
                }
                /**
                 * Creates an injector from previously resolved providers.
                 *
                 * @static
                 * @param {ResolvedProvider[]} providers
                 * @param {Injector} [parent=null]
                 * @returns
                 */
                static fromResolvedProviders(providers, parent = null) {
                    return new Injector(providers, parent);
                }
                /**
                 * Resolves an array of providers and creates a child injector from those providers.
                 *
                 * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
                 * @returns {Injector}
                 */
                resolveAndCreateChild(providers) {
                    let resolvedProviders = Injector.resolve(providers);
                    return this.createChildFromResolved(resolvedProviders);
                }
                /**
                 * Creates a child injector from previously resolved providers.
                 *
                 * @param {ResolvedProvider[]} providers
                 * @returns {Injector}
                 */
                createChildFromResolved(providers) {
                    return Injector.fromResolvedProviders(providers, this);
                }
                /**
                 * Gets the value of the resolved provider matching the token
                 *
                 * @param {*} token
                 * @returns {*}
                 */
                get(token) {
                    let value = this._values.get(token);
                    if (value) {
                        return value;
                    }
                    for (let i = 0, max = this._providers.length; i < max; i++) {
                        let provider = this._providers[i];
                        if (provider.token === token) {
                            let resolvedFactory = provider.resolvedFactory;
                            let resolvedDepts = [];
                            for (let j = 0, max = resolvedFactory.dependencies.length; j < max; j++) {
                                let deptToken = resolvedFactory.dependencies[j];
                                let dept = this.get(deptToken);
                                debug_13.assert(!!dept, `Cannot resolve all parameters for ${stringify_3.stringify(resolvedFactory.factory)}! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject`);
                                resolvedDepts.push(dept);
                            }
                            value = resolvedFactory.factory(resolvedDepts);
                            this._values.set(token, value);
                            return value;
                        }
                    }
                    return this._parent ? this._parent.get(token) : null;
                }
            }
            exports_27("Injector", Injector);
        }
    }
});
System.register("runtime/di/decorators", ["debug/debug", "runtime/annotations/annotations", "runtime/di/metadata"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var debug_14, annotations_2, metadata_2;
    function Inject(token) {
        return function (target, propertyKey, parameterIndex) {
            debug_14.assert(typeof token !== 'undefined', 'Parameter decorator @Inject needs a token, please provide one!', TypeError);
            annotations_2.Annotations.peek(target).add(new metadata_2.InjectMetadata(token));
        };
    }
    exports_28("Inject", Inject);
    function Injectable() {
        return function (target) {
            debug_14.assert(typeof target === 'function', 'Class decorator @Injectable has to be applied on a class!', TypeError);
            annotations_2.Annotations.peek(target).add(new metadata_2.InjectableMetadata());
        };
    }
    exports_28("Injectable", Injectable);
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
System.register("runtime/di/di", ["runtime/di/decorators", "runtime/di/injector", "runtime/di/provider"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    return {
        setters:[
            function (decorators_1_1) {
                exports_29({
                    "Injectable": decorators_1_1["Injectable"],
                    "Inject": decorators_1_1["Inject"]
                });
            },
            function (injector_1_1) {
                exports_29({
                    "Injector": injector_1_1["Injector"]
                });
            },
            function (provider_2_1) {
                exports_29({
                    "Provider": provider_2_1["Provider"],
                    "ResolvedProvider": provider_2_1["ResolvedProvider"],
                    "provide": provider_2_1["provide"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("utils/dom/dom", [], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    function convertNodeListToArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }
    exports_30("convertNodeListToArray", convertNodeListToArray);
    /**
     * Checks if a selector matches an element.
     *
     * @export
     * @param {string} selector
     * @param {Element} element
     * @returns Returns true if selector matches, false if not
     */
    function doesSelectorMatchElement(selector, element) {
        let results = convertNodeListToArray(element.parentElement.querySelectorAll(selector));
        return results.length ? results.indexOf(element) !== -1 : false;
    }
    exports_30("doesSelectorMatchElement", doesSelectorMatchElement);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("render/dom_parser/dom_parser", ["debug/debug", "runtime/di/di"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var debug_15, di_1;
    var DOMParser;
    return {
        setters:[
            function (debug_15_1) {
                debug_15 = debug_15_1;
            },
            function (di_1_1) {
                di_1 = di_1_1;
            }],
        execute: function() {
            let DOMParser = class DOMParser {
                constructor() {
                    this.elementHooks = [];
                    this.attributeHooks = [];
                }
                parseTree(rootElement) {
                    this.parseNode(rootElement, []);
                }
                parseNode(element, context) {
                    if (!(element instanceof HTMLElement)) {
                        throw new Error('The property element has to be an HTMLElement');
                    }
                    if (!Array.isArray(context)) {
                        context = [];
                    }
                    // Skip script and styles elements
                    const tagName = element.tagName.toUpperCase();
                    if (tagName.toUpperCase() === 'SCRIPT' || tagName.toUpperCase() === 'STYLES') {
                        return;
                    }
                    const elementHooks = this.elementHooks;
                    const parseFunctions = [];
                    const afterParseFunctions = [];
                    let localContext = [];
                    let filteredContext = context.filter((context) => !!context);
                    for (let i = 0, max = elementHooks.length; i < max; i++) {
                        var elementHook = elementHooks[i];
                        if (elementHook.predicate(element)) {
                            if (elementHook.onBeforeParse) {
                                try {
                                    localContext = localContext.concat(elementHook.onBeforeParse(element, filteredContext));
                                }
                                catch (ex) {
                                    debug_15.Logger.log(debug_15.LogLevel.error, ex, debug_15.LogType.error);
                                }
                            }
                            (function (hook, element) {
                                if (hook.onParse)
                                    parseFunctions.push((context) => { hook.onParse(element, context); });
                                if (hook.onAfterParse)
                                    afterParseFunctions.push((context) => { hook.onAfterParse(element, context); });
                            })(elementHook, element);
                        }
                    }
                    const attributes = element.attributes;
                    const attributeHooks = this.attributeHooks;
                    let diff = 0;
                    for (let i = 0, max = attributes.length; i < max; i++) {
                        let attribute = attributes[i - diff];
                        for (let j = 0, max = attributeHooks.length; j < max; j++) {
                            let attributeHook = attributeHooks[j];
                            if (attributeHook.predicate(attribute)) {
                                if (attributeHook.onBeforeParse) {
                                    try {
                                        localContext = localContext.concat(attributeHook.onBeforeParse(element, attribute, filteredContext));
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
                                        parseFunctions.push((context) => { hook.onParse(element, attribute, context); });
                                    if (hook.onAfterParse)
                                        afterParseFunctions.push((context) => { hook.onAfterParse(element, attribute, context); });
                                })(attributeHook, element, attribute);
                            }
                        }
                    }
                    context.unshift(localContext.length ? localContext : null);
                    filteredContext = context.filter((context) => !!context);
                    for (let i = 0, max = parseFunctions.length; i < max; i++) {
                        parseFunctions[i](filteredContext);
                    }
                    // loop through child nodes and recursively parse them       
                    const nodes = element.childNodes;
                    for (let i = 0, max = nodes.length; i < max; i++) {
                        let node = nodes[i];
                        let nodeType = node.nodeType;
                        if (nodeType !== Node.ELEMENT_NODE && nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                            continue;
                        }
                        if (node instanceof HTMLElement) {
                            this.parseNode(node, context);
                        }
                    }
                    for (let i = 0, max = afterParseFunctions.length; i < max; i++) {
                        afterParseFunctions[i](filteredContext);
                    }
                    context.shift();
                }
                registerElementHook(hook) {
                    this.elementHooks.push(hook);
                }
                registerAttributeHook(hook) {
                    this.attributeHooks.push(hook);
                }
            };
            DOMParser = __decorate([
                di_1.Injectable(), 
                __metadata('design:paramtypes', [])
            ], DOMParser);
            exports_31("DOMParser", DOMParser);
        }
    }
});
System.register("runtime/component/registry", [], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var ComponentRegistry;
    return {
        setters:[],
        execute: function() {
            class ComponentRegistry {
                static get selectors() { return this._selectors; }
                static get componentTypes() { return this._componentTypes; }
                static register(componentType, selector) {
                    if (this._componentTypes.indexOf(componentType) === -1 && this._selectors.indexOf(selector) === -1) {
                        this._componentTypes.push(componentType);
                        this._selectors.push(selector);
                    }
                }
                static bySelector(selector) {
                    let index = this._selectors.indexOf(selector);
                    return index !== -1 ? this._componentTypes[index] : null;
                }
            }
            ComponentRegistry._componentTypes = [];
            ComponentRegistry._selectors = [];
            exports_32("ComponentRegistry", ComponentRegistry);
        }
    }
});
System.register("render/parser/parser", ["runtime/di/di", "render/dom_parser/dom_parser", "utils/dom/dom", "runtime/component/registry", "runtime/component/resolver"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var di_2, dom_parser_1, dom_1, registry_1, resolver_1;
    var Parser;
    return {
        setters:[
            function (di_2_1) {
                di_2 = di_2_1;
            },
            function (dom_parser_1_1) {
                dom_parser_1 = dom_parser_1_1;
            },
            function (dom_1_1) {
                dom_1 = dom_1_1;
            },
            function (registry_1_1) {
                registry_1 = registry_1_1;
            },
            function (resolver_1_1) {
                resolver_1 = resolver_1_1;
            }],
        execute: function() {
            let Parser = class Parser {
                constructor(resolver) {
                    this._domParser = new dom_parser_1.DOMParser();
                    // console.log(resolver);
                    let selectors = registry_1.ComponentRegistry.selectors;
                    let index = -1;
                    this._domParser.registerElementHook({
                        predicate: (element) => {
                            for (let i = 0, max = selectors.length; i < max; i++) {
                                if (dom_1.doesSelectorMatchElement(selectors[i], element)) {
                                    index = i;
                                    return true;
                                }
                            }
                            return false;
                        },
                        onBeforeParse: (element) => {
                            let componentType = registry_1.ComponentRegistry.componentTypes[index];
                            console.log(componentType);
                            return true;
                        }
                    });
                }
                parse(root) {
                    this._domParser.parseTree(root);
                }
            };
            Parser = __decorate([
                di_2.Injectable(),
                __param(0, di_2.Inject(resolver_1.ComponentResolver)), 
                __metadata('design:paramtypes', [resolver_1.ComponentResolver])
            ], Parser);
            exports_33("Parser", Parser);
        }
    }
});
System.register("runtime/view/factory", [], function(exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    var ViewFactory;
    return {
        setters:[],
        execute: function() {
            class ViewFactory {
                constructor(viewType) {
                    this._viewType = viewType;
                }
                create(element) {
                    let view = new this._viewType(element);
                    return view;
                }
            }
            exports_34("ViewFactory", ViewFactory);
        }
    }
});
System.register("runtime/view/view", ["render/parser/parser"], function(exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var parser_1;
    var View;
    return {
        setters:[
            function (parser_1_1) {
                parser_1 = parser_1_1;
            }],
        execute: function() {
            class View {
                constructor(element, hostElement) {
                    this._rootElement = element;
                    this._hostElement = hostElement;
                    this._parser = this._hostElement.injector.get(parser_1.Parser);
                    console.log(this._hostElement.injector);
                }
                get rootElement() {
                    return this._rootElement;
                }
                parse() {
                    this._parser.parse(this._rootElement);
                }
                destroy() { }
            }
            exports_35("View", View);
        }
    }
});
System.register("runtime/view/element", [], function(exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var ElementRef;
    return {
        setters:[],
        execute: function() {
            class ElementRef {
                constructor(nativeElement) {
                    this.nativeElement = nativeElement;
                }
            }
            exports_36("ElementRef", ElementRef);
        }
    }
});
System.register("runtime/view/view_container", [], function(exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var ViewContainerRef;
    return {
        setters:[],
        execute: function() {
            class ViewContainerRef {
                constructor(element) {
                    this._element = element;
                }
                get injector() {
                    return this._element.injector;
                }
                // TODO: implement!    
                createEmbeddedView() { }
                // TODO: implement!
                createComponent(componentFactory, injector, nativeElement) {
                }
                parse() {
                    this._element.parseView();
                }
                // TODO: implement!
                destroy() {
                }
            }
            exports_37("ViewContainerRef", ViewContainerRef);
        }
    }
});
System.register("runtime/view/view_element", ["debug/debug", "runtime/view/view_container", "runtime/view/view", "runtime/view/element"], function(exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var debug_16, view_container_1, view_1, element_1;
    var ViewElement;
    return {
        setters:[
            function (debug_16_1) {
                debug_16 = debug_16_1;
            },
            function (view_container_1_1) {
                view_container_1 = view_container_1_1;
            },
            function (view_1_1) {
                view_1 = view_1_1;
            },
            function (element_1_1) {
                element_1 = element_1_1;
            }],
        execute: function() {
            class ViewElement {
                constructor(nativeElement) {
                    this._componentView = null;
                    this._nestedViews = []; // TODO: Implement embedded views
                    this._nativeElement = nativeElement;
                }
                get component() { return this._component; }
                get elementRef() { return new element_1.ElementRef(this._nativeElement); }
                get viewContainerRef() { return new view_container_1.ViewContainerRef(this); }
                get injector() { return this._injector; }
                ;
                initComponent(component, injector) {
                    this._component = component;
                    this._injector = injector;
                    let componentView = new view_1.View(this._nativeElement, this);
                    this._componentView = componentView;
                }
                // TODO    
                attachView(view, viewIndex) { }
                parseView(viewIndex = -1) {
                    let view = this.getView(viewIndex);
                    debug_16.assert(view instanceof view_1.View, `No view with index "${viewIndex}"" found!`);
                    view.parse();
                }
                getView(viewIndex = -1) {
                    return viewIndex === -1 ? this._componentView : this._nestedViews[viewIndex];
                }
            }
            exports_38("ViewElement", ViewElement);
        }
    }
});
System.register("runtime/component/reference", [], function(exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var ComponentReference;
    return {
        setters:[],
        execute: function() {
            class ComponentReference {
                constructor(hostElement, componentType) {
                    this._hostElement = hostElement;
                    this._componentType = componentType;
                }
                get hostElement() {
                    return this._hostElement;
                }
                get viewContainerRef() {
                    return this._hostElement.viewContainerRef;
                }
                get instance() {
                    return this._hostElement.component;
                }
                get injector() {
                    return this._hostElement.injector;
                }
                get componentType() {
                    return this._componentType;
                }
                destroy() {
                    // TODO!
                }
            }
            exports_39("ComponentReference", ComponentReference);
        }
    }
});
System.register("runtime/component/metadata", ["debug/debug"], function(exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    var debug_17;
    var ComponentMetadataReference;
    return {
        setters:[
            function (debug_17_1) {
                debug_17 = debug_17_1;
            }],
        execute: function() {
            /**
             * Reference Object containing the component metadata
             *
             * @export
             * @class ComponentMetadataReference
             * @template C
             */
            class ComponentMetadataReference {
                constructor(metadata) {
                    // Check if metadata is an object
                    debug_17.assert(typeof metadata === 'object' && !Array.isArray(metadata), `The metadata object must be an object and implement the ComponentMetadata class!`, TypeError);
                    // Check if a selector is specified in the metadata.
                    // Every directive must have a selector
                    debug_17.assert(typeof metadata.selector === 'string', `The metadata object must specify a selector!`, TypeError);
                    metadata.selector = metadata.selector.trim();
                    // Check if selector contains only one level of dom nodes
                    // Ok: .my-selector
                    // Not allowed: .parent .my-selector
                    debug_17.assert(metadata.selector.indexOf(' ') === -1, `The selector "${metadata.selector}" specified in the component metadata contains more than one levels of nodes. Only one is allowed!`, SyntaxError);
                    // Check if selector is valid
                    debug_17.assert(!!metadata.selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/), `The selector "${metadata.selector}" specified in the component metadata is not valid`, SyntaxError);
                    // Parsing the selector string to an array
                    // 'my-element.class1#id[attribute1].class2[attribute2="value"]'
                    // to
                    // ["my-element", ".class1", "#id", "[attribute1]", ".class2", "[attribute2="value"]"]   
                    let selectorList = metadata.selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');
                    for (let i = 0, max = selectorList.length; i < max; i++) {
                        let selector = selectorList[i];
                        if (!selector.length) {
                            continue;
                        }
                        // Check if the selector contains element names whicht are not allowed
                        // eg. custom elements without a "-" in it
                        debug_17.assert(!selector.match(/^\w+(-\w+)*$/) || !(document.createElement(selector) instanceof HTMLUnknownElement), `The selector "${metadata.selector}" specified in the component metadata contains an element name "${selector}" which is not allowed. 
                If you are using a custom element, there has to be a "-" char in it!)`, SyntaxError);
                    }
                    this._selector = metadata.selector;
                    this._actions = metadata.actions;
                    this._template = metadata.template;
                    this._templateName = metadata.templateName;
                    this._providers = metadata.providers || [];
                }
                get selector() {
                    return this._selector;
                }
                get actions() {
                    return this._actions || null;
                }
                get template() {
                    return this.template || null;
                }
                get templateName() {
                    return this.templateName || null;
                }
                get providers() {
                    return this._providers;
                }
            }
            exports_40("ComponentMetadataReference", ComponentMetadataReference);
        }
    }
});
System.register("runtime/component/factory", ["runtime/component/reference", "runtime/component/metadata", "runtime/view/view_element", "runtime/view/element", "runtime/annotations/annotations", "runtime/di/di"], function(exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    var reference_1, metadata_3, view_element_1, element_2, annotations_3, di_3;
    var ComponentFactory;
    return {
        setters:[
            function (reference_1_1) {
                reference_1 = reference_1_1;
            },
            function (metadata_3_1) {
                metadata_3 = metadata_3_1;
            },
            function (view_element_1_1) {
                view_element_1 = view_element_1_1;
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
            class ComponentFactory {
                constructor(componentClass) {
                    this._componentType = componentClass;
                    this._metaRef = annotations_3.Annotations.peek(componentClass).get(metadata_3.ComponentMetadataReference)[0];
                }
                get metadataReference() {
                    return this._metaRef;
                }
                create(injector, nativeElement) {
                    let hostElement = new view_element_1.ViewElement(nativeElement);
                    let providers = Array.isArray(this._metaRef.providers) ? this._metaRef.providers : [];
                    providers = providers.concat([
                        di_3.provide(element_2.ElementRef, { useValue: hostElement.elementRef }),
                        di_3.provide(hostElement, { useClass: this._componentType })
                    ]);
                    let inj = injector.resolveAndCreateChild(providers);
                    let component = inj.get(hostElement);
                    hostElement.initComponent(component, inj);
                    let ref = new reference_1.ComponentReference(hostElement, this._componentType);
                    return ref;
                }
            }
            exports_41("ComponentFactory", ComponentFactory);
        }
    }
});
System.register("runtime/component/resolver", ["runtime/di/di", "runtime/component/factory", "runtime/annotations/annotations"], function(exports_42, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
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
            let ComponentResolver = class ComponentResolver {
                resolveComponent(componentClass) {
                    let factory = annotations_4.Annotations.peek(componentClass).getSingle(factory_1.ComponentFactory);
                    if (!(factory instanceof factory_1.ComponentFactory)) {
                        factory = new factory_1.ComponentFactory(componentClass);
                        annotations_4.Annotations.peek(componentClass).set(factory);
                    }
                    return factory;
                }
            };
            ComponentResolver = __decorate([
                di_4.Injectable(), 
                __metadata('design:paramtypes', [])
            ], ComponentResolver);
            exports_42("ComponentResolver", ComponentResolver);
        }
    }
});
System.register("runtime/bootstrap/bootstrap", ["debug/debug", "utils/class/class", "runtime/component/resolver", "runtime/di/di", "utils/dom/dom", "render/parser/parser"], function(exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var debug_18, class_3, resolver_2, di_5, dom_2, parser_2;
    function bootstrap(appComponentType, customProviders = [], root = document.body) {
        if (customProviders instanceof Element) {
            root = customProviders;
            customProviders = [];
        }
        debug_18.assert(root instanceof Element, 'Root has to be an Element!', TypeError);
        debug_18.assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);
        let providers = [
            new di_5.Provider(resolver_2.ComponentResolver, { useClass: resolver_2.ComponentResolver }),
            new di_5.Provider(parser_2.Parser, { useClass: parser_2.Parser })
        ];
        let rootInjector = di_5.Injector.resolveAndCreate(providers.concat(customProviders));
        let componentResolver = rootInjector.get(resolver_2.ComponentResolver);
        let factory = componentResolver.resolveComponent(appComponentType);
        let element;
        let selector = factory.metadataReference.selector;
        if (dom_2.doesSelectorMatchElement(selector, root)) {
            element = root;
        }
        else {
            let elements = root.querySelectorAll(factory.metadataReference.selector);
            debug_18.assert(!!elements.length, `We could not find an element matching the selector "${factory.metadataReference.selector}" of the "${class_3.getClassName(appComponentType)}" component provided to the bootstrap function`);
            debug_18.assert(elements.length === 1, `There are more than one elements matching the selector "${factory.metadataReference.selector}" of the "${class_3.getClassName(appComponentType)}" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!`);
            element = elements[0];
        }
        let appRef = factory.create(rootInjector, element);
        appRef.viewContainerRef.parse();
    }
    exports_43("bootstrap", bootstrap);
    return {
        setters:[
            function (debug_18_1) {
                debug_18 = debug_18_1;
            },
            function (class_3_1) {
                class_3 = class_3_1;
            },
            function (resolver_2_1) {
                resolver_2 = resolver_2_1;
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
System.register("runtime/lifecycle/lifecycle_hooks", [], function(exports_44, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
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
            exports_44("LifecycleHooks", LifecycleHooks);
            class OnInit {
            }
            exports_44("OnInit", OnInit);
            class OnChanges {
            }
            exports_44("OnChanges", OnChanges);
            class OnRender {
            }
            exports_44("OnRender", OnRender);
            class OnDestroy {
            }
            exports_44("OnDestroy", OnDestroy);
        }
    }
});
System.register("runtime/component/directive", ["runtime/component/metadata", "runtime/annotations/annotations", "runtime/di/di", "runtime/component/registry"], function(exports_45, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
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
            let metaRef = new metadata_4.ComponentMetadataReference(metadata);
            annotations_5.Annotations.peek(componentClass).add(metaRef);
            registry_2.ComponentRegistry.register(componentClass, metaRef.selector);
        };
    }
    exports_45("Component", Component);
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
System.register("runtime/runtime", ["runtime/bootstrap/bootstrap", "runtime/lifecycle/lifecycle_hooks", "runtime/component/directive", "runtime/view/element", "runtime/di/di"], function(exports_46, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
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
        exports_46(exports);
    }
    return {
        setters:[
            function (bootstrap_1_1) {
                exports_46({
                    "bootstrap": bootstrap_1_1["bootstrap"]
                });
            },
            function (lifecycle_hooks_1_1) {
                exportStar_2(lifecycle_hooks_1_1);
            },
            function (directive_1_1) {
                exports_46({
                    "Component": directive_1_1["Component"]
                });
            },
            function (element_3_1) {
                exports_46({
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
System.register("mojito/runtime", ["runtime/runtime"], function(exports_47, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    function exportStar_3(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_47(exports);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qaXRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliL2RlYnVnL2Fzc2VydC9hc3NlcnQudHMiLCJsaWIvZGVidWcvbG9nZ2VyL2xvZ2dlci50cyIsImxpYi9kZWJ1Zy9kZWJ1Zy50cyIsImxpYi9jb3JlL2dldC9nZXQudHMiLCJsaWIvY29yZS9hcnJheS9hcnJheS50cyIsImxpYi9jb3JlL21ldGEvbWV0YS50cyIsImxpYi9jb3JlL2l0ZXJhdG9yL2l0ZXJhdG9yLnRzIiwibGliL2NvcmUvd2F0Y2gvd2F0Y2gudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmUudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmFibGUudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmFibGVPYmplY3QudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmVyLnRzIiwibGliL2NvcmUvcHJvcGVydGllcy9wcm9wZXJ0eUV2ZW50cy50cyIsImxpYi9jb3JlL3Byb3BlcnRpZXMvbWFuZGF0b3J5X3NldC50cyIsImxpYi9jb3JlL3Byb3BlcnRpZXMvcHJvcGVydGllcy50cyIsImxpYi9jb3JlL29iamVjdC9vYmplY3QudHMiLCJsaWIvY29yZS9zZXQvc2V0LnRzIiwibGliL2NvcmUvbWFwL21hcC50cyIsImxpYi9jb3JlL29ic2VydmFibGUvb2JzZXJ2ZXMudHMiLCJsaWIvY29yZS9jb3JlLnRzIiwibGliL21vaml0by9jb3JlLnRzIiwibGliL3V0aWxzL2NsYXNzL2NsYXNzLnRzIiwibGliL3J1bnRpbWUvYW5ub3RhdGlvbnMvYW5ub3RhdGlvbnMudHMiLCJsaWIvdXRpbHMvc3RyaW5nL3N0cmluZ2lmeS50cyIsImxpYi9ydW50aW1lL2RpL21ldGFkYXRhLnRzIiwibGliL3J1bnRpbWUvZGkvcHJvdmlkZXIudHMiLCJsaWIvcnVudGltZS9kaS9pbmplY3Rvci50cyIsImxpYi9ydW50aW1lL2RpL2RlY29yYXRvcnMudHMiLCJsaWIvcnVudGltZS9kaS9kaS50cyIsImxpYi91dGlscy9kb20vZG9tLnRzIiwibGliL3JlbmRlci9kb21fcGFyc2VyL2RvbV9wYXJzZXIudHMiLCJsaWIvcnVudGltZS9jb21wb25lbnQvcmVnaXN0cnkudHMiLCJsaWIvcmVuZGVyL3BhcnNlci9wYXJzZXIudHMiLCJsaWIvcnVudGltZS92aWV3L2ZhY3RvcnkudHMiLCJsaWIvcnVudGltZS92aWV3L3ZpZXcudHMiLCJsaWIvcnVudGltZS92aWV3L2VsZW1lbnQudHMiLCJsaWIvcnVudGltZS92aWV3L3ZpZXdfY29udGFpbmVyLnRzIiwibGliL3J1bnRpbWUvdmlldy92aWV3X2VsZW1lbnQudHMiLCJsaWIvcnVudGltZS9jb21wb25lbnQvcmVmZXJlbmNlLnRzIiwibGliL3J1bnRpbWUvY29tcG9uZW50L21ldGFkYXRhLnRzIiwibGliL3J1bnRpbWUvY29tcG9uZW50L2ZhY3RvcnkudHMiLCJsaWIvcnVudGltZS9jb21wb25lbnQvcmVzb2x2ZXIudHMiLCJsaWIvcnVudGltZS9ib290c3RyYXAvYm9vdHN0cmFwLnRzIiwibGliL3J1bnRpbWUvbGlmZWN5Y2xlL2xpZmVjeWNsZV9ob29rcy50cyIsImxpYi9ydW50aW1lL2NvbXBvbmVudC9kaXJlY3RpdmUudHMiLCJsaWIvcnVudGltZS9ydW50aW1lLnRzIiwibGliL21vaml0by9ydW50aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7O09BT0c7SUFDSCxnQkFBdUIsU0FBa0IsRUFBRSxPQUFlLEVBQUUsU0FBNEI7UUFDcEYsSUFBSSxXQUFXLEdBQUcsU0FBUyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxJQUFJLFdBQVcsQ0FBQyxvQkFBb0IsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUMxRCxDQUFDO0lBQ0wsQ0FBQztJQUxELDJCQUtDLENBQUE7Ozs7Ozs7Ozs7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