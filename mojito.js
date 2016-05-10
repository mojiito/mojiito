var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
System.register("debug/debug", ["debug/assert/assert"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters:[
            function (assert_1_1) {
                exports_2({
                    "assert": assert_1_1["assert"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("core/get/get", ["debug/debug"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
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
    exports_3("get", get);
    return {
        setters:[
            function (debug_1_1) {
                debug_1 = debug_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/observer/observer", ["debug/debug", "core/object/object"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var debug_2, object_1;
    var Observable, Observer;
    function observes() {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        debug_2.assert(arguments.length === 1, 'The observes decorator must be called with one argument; an array of propertyKeys');
        return function (target, propertyKey, descriptor) {
            debug_2.assert(arguments.length === 3, 'The observe decorator callback must be called with three arguments; a target, a propertyKey and a descriptor');
            debug_2.assert(target instanceof object_1.CoreObject, 'The target provided to the observe decorator callback must be an object and an instace of `CoreObject`', TypeError);
            debug_2.assert(typeof propertyKey === 'string', 'The property key provided to the observe decorator callback must be a string', TypeError);
            //const source: any = target;  // needed for enabled noImplicitAny
            var callback = descriptor.value;
            debug_2.assert(typeof callback === 'function', 'The callback for the observer has to be a function', TypeError);
            for (var i = 0, max = keys.length; i < max; i++) {
                var key = keys[i];
                debug_2.assert(typeof key === 'string', 'The keys provided to the observe decorator callback must be strings', TypeError);
                (function (key, callback) {
                })(key, callback);
            }
            return descriptor;
        };
    }
    exports_4("observes", observes);
    return {
        setters:[
            function (debug_2_1) {
                debug_2 = debug_2_1;
            },
            function (object_1_1) {
                object_1 = object_1_1;
            }],
        execute: function() {
            Observable = (function () {
                function Observable(subject, key) {
                }
                Observable.prototype.subscribe = function (callback) {
                };
                return Observable;
            }());
            exports_4("Observable", Observable);
            Observer = (function () {
                function Observer(onNext, onError, onComplete) {
                    this.onNext = onNext;
                    this.onError = onError;
                    this.onComplete = onComplete;
                }
                Observer.prototype.next = function () { };
                Observer.prototype.error = function () { };
                Observer.prototype.complete = function () { };
                return Observer;
            }());
            exports_4("Observer", Observer);
        }
    }
});
System.register("core/array/array", ["debug/debug", "core/meta/meta"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var debug_3, meta_1;
    var CoreArray;
    return {
        setters:[
            function (debug_3_1) {
                debug_3 = debug_3_1;
            },
            function (meta_1_1) {
                meta_1 = meta_1_1;
            }],
        execute: function() {
            /**
             * Extends the native Array by observers, computed properties, ...
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
                    debug_3.assert(this instanceof CoreArray, 'A CoreArray can only be instantiated with `new` or `CoreArray.create()`');
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
                    debug_3.assert(Array.isArray(array) || typeof array === 'undefined', 'The Array provided to the create method must be an array', TypeError);
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
    var debug_4;
    var Meta;
    return {
        setters:[
            function (debug_4_1) {
                debug_4 = debug_4_1;
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
                    debug_4.assert(arguments.length === 1, 'createMember on an meta hash must be called with one arguments: a member key');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the createMember method on a meta hash must be a string', TypeError);
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
                    debug_4.assert(arguments.length === 1, 'peekMember on an meta hash must be called with one arguments: a member key');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the peekMember method on a meta hash must be a string', TypeError);
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
                    debug_4.assert(arguments.length === 1, 'getMember on an meta hash must be called with one arguments: a member key');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the getMember method on a meta hash must be a string', TypeError);
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
                    debug_4.assert(arguments.length === 1, 'hasMember on an meta hash must be called with one arguments: a member key');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the hasMember method on a meta hash must be a string', TypeError);
                    return !!this.getMember(memberKey);
                };
                /**
                 * Deletes all the properties of a member in the meta hash.
                 *
                 * @param  {string} memberKey The name(key) of the member to be cleared
                 * @returns {boolean} true if clear was successful, false if not
                 */
                Meta.prototype.clearMember = function (memberKey) {
                    debug_4.assert(arguments.length === 1, 'clearMember on an meta hash must be called with one arguments: a member key');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the clearMember method on a meta hash must be a string', TypeError);
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
                    debug_4.assert(arguments.length === 3 || arguments.length === 4, 'setProperty on an meta hash must be called with three arguments; a member key, a property key and a value; optional you can add a descriptor');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the setProperty method on a meta hash must be a string', TypeError);
                    debug_4.assert(typeof propertyKey === 'string', 'The property key provided to the setProperty method on a meta hash must be a string', TypeError);
                    debug_4.assert(typeof descriptor === 'undefined' || typeof descriptor === 'object', 'The descriptor provided to the setProperty method on a meta hash must be a PropertyDescriptor', TypeError);
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
                    debug_4.assert(arguments.length === 2 || arguments.length === 3, 'setProperties on an meta hash must be called with two arguments; a member key, and a  property map; optional you can add a descriptor');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the setProperty method on a meta hash must be a string', TypeError);
                    debug_4.assert(typeof propertyMap === 'object', 'The propertyMap provided to the setProperties method on a meta hash must be an object', TypeError);
                    debug_4.assert(typeof descriptor === 'undefined' || typeof descriptor === 'object', 'The descriptor provided to the setProperties method on a meta hash must be a PropertyDescriptor', TypeError);
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
                    debug_4.assert(arguments.length === 2, 'getProperty on an meta hash must be called with two arguments; a member key and a property key');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the getProperty method on a meta hash must be a string', TypeError);
                    debug_4.assert(typeof propertyKey === 'string', 'The property key provided to the getProperty method on a meta hash must be a string', TypeError);
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
                    debug_4.assert(arguments.length === 2, 'hasProperty on an meta hash must be called with two arguments; a member key and a property key');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the hasProperty method on a meta hash must be a string', TypeError);
                    debug_4.assert(typeof propertyKey === 'string', 'The property key provided to the hasProperty method on a meta hash must be a string', TypeError);
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
                    debug_4.assert(arguments.length === 2, 'deleteProperty on an meta hash must be called with two arguments; a member key and a property key');
                    debug_4.assert(typeof memberKey === 'string', 'The member key provided to the deleteProperty method on a meta hash must be a string', TypeError);
                    debug_4.assert(typeof propertyKey === 'string', 'The property key provided to the deleteProperty method on a meta hash must be a string', TypeError);
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
System.register("core/object/object", ["debug/debug", "core/get/get", "core/set/set", "core/meta/meta"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var debug_5, get_1, set_1, meta_2;
    var CoreObject;
    return {
        setters:[
            function (debug_5_1) {
                debug_5 = debug_5_1;
            },
            function (get_1_1) {
                get_1 = get_1_1;
            },
            function (set_1_1) {
                set_1 = set_1_1;
            },
            function (meta_2_1) {
                meta_2 = meta_2_1;
            }],
        execute: function() {
            /**
             * Extends the native Object by observers, computed properties, ...
             * It's the default Object of Mojito
             *
             * Usage:
             * ````
             * let a = new Mojito.Object();
             * // or
             * let b = Mojito.Object.create();
             * ````
             *
             * It's also possible to provide an object to the constructor.
             * The CoreObject will then be created with the properies, of
             * that provided object, predefined.
             *
             * Usage:
             * ````
             * let a = new Mojito.Object({a: 1});
             * // or
             * let b = Mojito.Object.create({a: 1});
             * ````
             *
             * @export
             * @class CoreObject
             * @extends {Observable}
             */
            CoreObject = (function () {
                /**
                 * Creates an instance of CoreObject.
                 *
                 * @param {Object} [obj] Object or property map to define properties
                 */
                function CoreObject(obj) {
                    debug_5.assert(this instanceof CoreObject, 'A class can only be instantiated with `new`');
                    debug_5.assert(typeof obj === 'object' || typeof obj === 'undefined', 'The object when provided to the constructor method must be an object', TypeError);
                    // extend the CoreObject with a Meta hash
                    meta_2.Meta.extend(this);
                    // defineProperties if an obj is provided
                    CoreObject.defineProperties(this, obj);
                }
                /**
                 * Retrieves the value of a property from the object.
                 *
                 * @param {string} propertyName The name(key) of the property
                 * @returns {*} Value of the property
                 */
                CoreObject.prototype.get = function (propertyName) {
                    debug_5.assert(arguments.length === 1, 'get must be called with one argument; a propertyName');
                    debug_5.assert(typeof propertyName === 'string', 'The propertyName to the get method must be a string', TypeError);
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
                    debug_5.assert(arguments.length === 2, 'set must be called with two arguments; a propertyName and value');
                    debug_5.assert(typeof propertyName === 'string', 'The propertyName to the set method must be a string', TypeError);
                    return set_1.set(this, propertyName, value);
                };
                /**
                 * Static method to provide functionality for `CoreObject.create()`
                 *
                 * @static
                 * @param {Object} [obj] Object or property map to define properties
                 * @returns {CoreObject} Newly created CoreObject
                 */
                CoreObject.create = function (obj) {
                    debug_5.assert(typeof obj === 'object' || typeof obj === 'undefined', 'The object when provided to the create method must be an object', TypeError);
                    return new CoreObject(obj);
                };
                /**
                 * Custom defineProperty method for handling observers,
                 * computed propertiese, ...
                 *
                 * @static
                 * @param {CoreObject} sourceObject The object where to define the property
                 * @param {string} propertyName The name(key) of the property to be defined
                 * @param {*} [value] The value to be set on the property
                 */
                CoreObject.defineProperty = function (sourceObject, propertyName, value) {
                    debug_5.assert(arguments.length === 2 || arguments.length === 3, 'defineProperty must be called with at least two arguments; a sourceObject, a propertyName and optional a value');
                    debug_5.assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperty method must be an object', TypeError);
                    debug_5.assert(typeof propertyName === 'string', 'The property propertyName to the defineProperty method must be a string', TypeError);
                    debug_5.assert(!(value instanceof meta_2.Meta), 'Defining a meta hash is not allowed');
                    // create the property if it is not already defined
                    if (!CoreObject.isDefinedProperty(sourceObject, propertyName)) {
                        Object.defineProperty(sourceObject, propertyName, {
                            get: function () {
                                return meta_2.Meta.peek(sourceObject).getProperty('values', propertyName);
                            },
                            set: function (newValue) {
                                var meta = meta_2.Meta.peek(sourceObject);
                                var oldValue = meta.getProperty('values', propertyName);
                                var observers = meta.getProperty('observers', propertyName);
                                meta.setProperty('values', propertyName, newValue);
                                if (Array.isArray(observers)) {
                                    observers.forEach(function (observer) {
                                        // only notify observer if value has changed
                                        if (newValue !== oldValue) {
                                        }
                                    });
                                }
                            }
                        });
                    }
                    // needed for enabled noImplicitAny
                    var source = sourceObject;
                    // set the new value if provided
                    if (typeof value !== 'undefined') {
                        source[propertyName] = value;
                    }
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
                    debug_5.assert(arguments.length === 2, 'isDefinedProperty must be called with two arguments; a sourceObject and a propertyName');
                    debug_5.assert(typeof sourceObject === 'object', 'The sourceObject provided to the isDefinedProperty method must be an object', TypeError);
                    debug_5.assert(typeof propertyName === 'string', 'The propertyName provided to the isDefinedProperty method must be a string', TypeError);
                    return sourceObject.hasOwnProperty(propertyName) && meta_2.Meta.peek(sourceObject).hasProperty('values', propertyName);
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
                    debug_5.assert(arguments.length === 1 || arguments.length === 2, 'defineProperties must be called with at least one arguments; a sourceObject and optional a propertyMap');
                    debug_5.assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperties method must be an object', TypeError);
                    debug_5.assert(typeof propertyMap === 'undefined' || typeof propertyMap === 'object', 'The propertyMap provided to the defineProperties method must be an object', TypeError);
                    if (propertyMap) {
                        CoreObject.defineProperties(sourceObject);
                    }
                    var properties = !!propertyMap ? propertyMap : sourceObject;
                    // replace every property with a defined one
                    for (var key in properties) {
                        var value = properties[key];
                        // defining Meta not allowed, skip it            
                        if (value instanceof meta_2.Meta) {
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
                return CoreObject;
            }());
            exports_7("CoreObject", CoreObject);
        }
    }
});
System.register("core/set/set", ["debug/debug", "core/object/object"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var debug_6, object_2;
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
        debug_6.assert(arguments.length === 3, 'Get must be called with three arguments; an object, a property name and a value');
        debug_6.assert(typeof obj !== 'undefined', 'Cannot call set on an undefined object', TypeError);
        debug_6.assert(typeof obj === 'object' || typeof obj === 'function', 'The first argument of the get method has be an object or a function', TypeError);
        debug_6.assert(typeof propertyName === 'string', 'The key provided to get method must be a string', TypeError);
        debug_6.assert(typeof value !== 'undefined', 'Cannot call set with an `undefined` value ', TypeError);
        var source = obj; // needed for enabled noImplicitAny    
        var properties = propertyName.split('.');
        var property = properties.slice(0, 1)[0];
        if (obj instanceof object_2.CoreObject) {
            object_2.CoreObject.defineProperties(obj);
        }
        if (properties.length === 1) {
            if (obj instanceof object_2.CoreObject) {
                object_2.CoreObject.defineProperty(obj, property, value);
            }
            else {
                source[property] = value;
            }
            return value;
        }
        if (!(property in obj)) {
            // if property is `undefined` create an object to fullfil the path
            source[property] = object_2.CoreObject.create();
        }
        else if (typeof source[property] !== 'object') {
            throw new TypeError('The property in the path has to be an object ');
        }
        return set(source[property], properties.slice(1).join('.'), value);
    }
    exports_8("set", set);
    return {
        setters:[
            function (debug_6_1) {
                debug_6 = debug_6_1;
            },
            function (object_2_1) {
                object_2 = object_2_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/iterator/iterator", ["debug/debug"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var debug_7;
    var CoreIterator;
    return {
        setters:[
            function (debug_7_1) {
                debug_7 = debug_7_1;
            }],
        execute: function() {
            CoreIterator = (function () {
                function CoreIterator(source) {
                    this._nextIndex = 0;
                    debug_7.assert(arguments.length === 1, 'CoreIterator must be created with one argument; an iterable object');
                    debug_7.assert(typeof source.length === 'number', 'The source property has to be a iterable object', TypeError);
                    this._source = source;
                }
                CoreIterator.prototype.next = function () {
                    var source = this._source;
                    return this._nextIndex < source.length ? { value: source[this._nextIndex++], done: false } : { done: true };
                };
                return CoreIterator;
            }());
            exports_9("CoreIterator", CoreIterator);
        }
    }
});
System.register("core/map/map", ["core/iterator/iterator"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var iterator_1;
    var CoreMapIterator, CoreMap;
    return {
        setters:[
            function (iterator_1_1) {
                iterator_1 = iterator_1_1;
            }],
        execute: function() {
            /**
             * Iterator for the methods of the CoreMap that return iterators (e.g. CoreMap.entries, CoreMap.keys and CoreMap.values)
             *
             * @export
             * @class CoreMapIterator
             * @extends {CoreIterator}
             */
            CoreMapIterator = (function (_super) {
                __extends(CoreMapIterator, _super);
                /**
                 * Creates an instance of CoreMapIterator.
                 *
                 * @param {IIterable} source Iterable object
                 * @param {number} [field] Set to 0 or 1 to modify the value of the iterator item
                 */
                function CoreMapIterator(source, field) {
                    _super.call(this, source);
                    this._field = field;
                }
                /**
                 * Returns the next item in the CoreMap.
                 * A zero arguments function that returns an object with two properties:
                 * done (boolean)
                 * Has the value true if the iterator is past the end of the iterated sequence. In this case value optionally specifies the return value of the iterator. The return values are explained here.
                 * Has the value false if the iterator was able to produce the next value in the sequence. This is equivalent of not specifying the done property altogether.
                 *
                 * value
                 * any JavaScript value returned by the iterator. Can be omitted when done is true.
                 *
                 * @returns {IIteratorItem} The next item in the CoreMap
                 */
                CoreMapIterator.prototype.next = function () {
                    var item = _super.prototype.next.call(this);
                    if (item.value) {
                        if (typeof this._field === 'number') {
                            item.value = item.value[this._field];
                        }
                    }
                    return item;
                };
                return CoreMapIterator;
            }(iterator_1.CoreIterator));
            exports_10("CoreMapIterator", CoreMapIterator);
            /**
             * Implementation of the ES6 Map.
             * The Map object is a simple key/value map.
             * Any value (both objects and primitive values) may be used as either a key or a value.
             *
             * @export
             * @class CoreMap
             */
            CoreMap = (function () {
                function CoreMap() {
                    /**
                     * Internal Array where all thoses keys and values are stored.
                     *
                     * @private
                     * @type {Array<Array<any>>}
                     */
                    this._source = [];
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
                     *
                     * @readonly
                     * @type {number}
                     */
                    get: function () {
                        !!console && !!console.warn && (console.warn("Don't use length property on CoreMaps!!"));
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
                 * @returns {CoreIterator} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
                 */
                CoreMap.prototype.entries = function () {
                    return new CoreMapIterator(this._source);
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
                            return source[i];
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
                 * @returns {CoreMapIterator} Iterator object that contains the keys for each element in the Map object in insertion order
                 */
                CoreMap.prototype.keys = function () {
                    return new CoreMapIterator(this._source, 0);
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
                    this._source.push([key, value]);
                    return this;
                };
                /**
                 * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
                 *
                 * @returns {CoreMapIterator} Iterator object that contains the values for each element in the Map object in insertion order
                 */
                CoreMap.prototype.values = function () {
                    return new CoreMapIterator(this._source, 1);
                };
                /**
                 * (description)
                 *
                 * @static
                 * @returns {CoreMap} (description)
                 */
                CoreMap.create = function () {
                    return new CoreMap();
                };
                return CoreMap;
            }());
            exports_10("CoreMap", CoreMap);
        }
    }
});
System.register("core/class/class", ["core/object/object"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var object_3;
    var CoreClass;
    return {
        setters:[
            function (object_3_1) {
                object_3 = object_3_1;
            }],
        execute: function() {
            CoreClass = (function (_super) {
                __extends(CoreClass, _super);
                function CoreClass(propertyMap) {
                    _super.call(this, propertyMap);
                }
                return CoreClass;
            }(object_3.CoreObject));
            exports_11("CoreClass", CoreClass);
        }
    }
});
System.register("runtime/mojito/mojito", ["core/core", "runtime/runtime"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var core_1, runtime_1;
    var Mojito;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (runtime_1_1) {
                runtime_1 = runtime_1_1;
            }],
        execute: function() {
            Mojito = (function () {
                function Mojito() {
                    var instance = core_1.get(self, Mojito.GLOBAL_NAMESPACE);
                    if (!instance) {
                        instance = this;
                        core_1.set(self, Mojito.GLOBAL_NAMESPACE, instance);
                    }
                }
                Mojito.prototype.register = function (TargetClass, meta) {
                    runtime_1.registerClass(TargetClass, meta);
                };
                Mojito.getInstance = function () {
                    if (!core_1.get(Mojito, '_instance')) {
                        var instance = new Mojito();
                        Object.defineProperty(Mojito, '_instance', {
                            writable: false,
                            configurable: false,
                            enumerable: false,
                            value: instance
                        });
                    }
                    return core_1.get(Mojito, 'instance');
                };
                Mojito.GLOBAL_NAMESPACE = 'Mojito';
                return Mojito;
            }());
            exports_12("Mojito", Mojito);
        }
    }
});
System.register("utils/class/class", ["debug/debug"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var debug_8;
    function getClassName(Klass) {
        debug_8.assert(arguments.length === 1, 'getClassName must be called with one arguments; a class');
        debug_8.assert(typeof Klass === 'function', 'The class provided to the getClassName function must be a function', TypeError);
        if (Klass['name']) {
            return Klass['name'];
        }
        else {
            return /^function\s+([\w\$]+)\s*\(/.exec(Klass.toString())[1];
        }
    }
    exports_13("getClassName", getClassName);
    return {
        setters:[
            function (debug_8_1) {
                debug_8 = debug_8_1;
            }],
        execute: function() {
        }
    }
});
System.register("utils/utils", ["utils/class/class"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    return {
        setters:[
            function (class_1_1) {
                exports_14({
                    "getClassName": class_1_1["getClassName"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("runtime/controller/controller", ["core/core"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var core_2;
    var Controller;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            }],
        execute: function() {
            Controller = (function (_super) {
                __extends(Controller, _super);
                function Controller() {
                    _super.call(this);
                }
                // _attachController(element: Element) {
                //     super._attachView(element);
                // }
                Controller.register = function (ControllerClass, meta) {
                    // const elements = meta.application.root.querySelectorAll(meta.selector);
                    // let instances: Array<Controller> = [];
                    // for (let i = 0, max = elements.length; i < max; i++) {
                    //     let element = elements[i];
                    //     let controllerInstance = new ControllerClass();
                    //     Meta.peek(controllerInstance).setProperties('controller', meta, {
                    //         writable: false,
                    //         configurable: false,
                    //         enumerable: true
                    //     });
                    //     instances.push(controllerInstance);
                    //     controllerInstance._attachController(element);
                    // }
                    // return instances;
                };
                return Controller;
            }(core_2.CoreView));
            exports_15("Controller", Controller);
        }
    }
});
System.register("runtime/application/application", ["utils/utils", "core/core"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var utils_1, core_3;
    var Application;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (core_3_1) {
                core_3 = core_3_1;
            }],
        execute: function() {
            Application = (function (_super) {
                __extends(Application, _super);
                function Application(root) {
                    // assert(arguments.length === 1, 'Application must be created with on argument: a name');
                    // assert(typeof name === 'string', 'The name provided to the Application must be a string', TypeError);
                    _super.call(this);
                    var meta = core_3.Meta.peek(this);
                    // meta.setProperties('values', {
                    //     root: root
                    // }, {
                    //     writable: false,
                    //     configurable: false,
                    //     enumerable: false
                    // });
                    // meta.createMember('controllers');
                    // meta.createMember('components');
                }
                Object.defineProperty(Application.prototype, "root", {
                    // get name() {
                    //     return Meta.peek(this).getProperty('values', 'name');
                    // }
                    // set name(value: string) {
                    //     throw new Error('Setting an application name directly is not allowed. The name has to be provided on the constructor');
                    // }
                    get: function () {
                        return core_3.Meta.peek(this).getProperty('values', 'root');
                    },
                    set: function (value) {
                        throw new Error('Setting the application root directly is not allowed.');
                    },
                    enumerable: true,
                    configurable: true
                });
                // registerController(ControllerClass: IController, meta: IControllerMeta): Array<Controller> {
                //     assert(arguments.length === 2, 'registerController must be called with on argument: a controller class');
                //     const controllers: Array<Controller> = Controller.register(ControllerClass, meta);
                //     let controllersList:Array<Controller> = Meta.peek(this).getProperty('controllers', ControllerClass.name);
                //     if (!Array.isArray(controllersList)) {
                //         Meta.peek(this).setProperty('controllers', ControllerClass.name, controllersList = []);
                //     }
                //     Array.prototype.push.apply(controllersList, controllers);
                //     return controllersList;
                // }
                // getControllers(): Object {
                //     return Meta.peek(this).getMember('controllers');
                // }
                // getControllersByClassName(className: string): Object {
                //     let controllersList: Array<Controller> = Meta.peek(this).getProperty('controllers', className);
                //     return Array.isArray(controllersList) ? controllersList : [];
                // }
                Application.register = function (ApplicationClass, meta) {
                    var name = utils_1.getClassName(ApplicationClass);
                    if (typeof meta === 'object') {
                        !!meta.name && (name = meta.name);
                    }
                };
                Application.applicationClassList = new core_3.CoreMap();
                return Application;
            }(core_3.CoreClass));
            exports_16("Application", Application);
        }
    }
});
System.register("runtime/service/service", ["core/core"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var core_4;
    var Service;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            }],
        execute: function() {
            Service = (function (_super) {
                __extends(Service, _super);
                function Service() {
                    _super.apply(this, arguments);
                }
                return Service;
            }(core_4.CoreObject));
            exports_17("Service", Service);
        }
    }
});
System.register("runtime/instantiation/instantiation", ["debug/debug"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var debug_9;
    function onBeforeInstantiation(TargetClass, callback) {
        return instantiation(TargetClass, callback);
    }
    exports_18("onBeforeInstantiation", onBeforeInstantiation);
    function onAfterInstantiation(TargetClass, callback) {
        return instantiation(TargetClass, null, callback);
    }
    exports_18("onAfterInstantiation", onAfterInstantiation);
    /**
     * @memberOf test
     */
    function instantiation(TargetClass, onBeforeInstantiation, onAfterInstantiation) {
        debug_9.assert(typeof TargetClass === 'function', 'TargetClass has to be a class!', TypeError);
        if (typeof onBeforeInstantiation === 'function') {
            addInstantiationCallback(TargetClass, '_onBeforeInstantiation', onBeforeInstantiation);
        }
        if (typeof onAfterInstantiation === 'function') {
            addInstantiationCallback(TargetClass, '_onAfterInstantiation', onAfterInstantiation);
        }
        if (TargetClass['_hasInstantiationHooks']) {
            return;
        }
        TargetClass['_hasInstantiationHooks'] = true;
        var OriginalClass = TargetClass;
        // a utility function to generate instances of a class
        function construct(constructor, args) {
            var C = function () {
                callInstantiationCallbacks(constructor['_onBeforeInstantiation']);
                var instance = constructor.apply(this, args);
                callInstantiationCallbacks(constructor['_onAfterInstantiation']);
                return instance;
            };
            C.prototype = constructor.prototype;
            return new C();
        }
        TargetClass = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return construct(OriginalClass, args);
        };
        // copy prototype so intanceof operator still works
        TargetClass.prototype = OriginalClass.prototype;
        // copy static methods
        var keys = Object.getOwnPropertyNames(OriginalClass);
        for (var i = 0, max = keys.length; i < max; i++) {
            var key = keys[i];
            if (typeof TargetClass[key] === 'undefined') {
                TargetClass[key] = OriginalClass[key];
            }
        }
        // copy name
        TargetClass['name'] = OriginalClass['name'];
        return TargetClass;
    }
    exports_18("instantiation", instantiation);
    function addInstantiationCallback(Klass, key, callback) {
        var callbacks = Klass[key];
        if (!Array.isArray(callbacks)) {
            Klass[key] = callbacks = [];
        }
        callbacks.push(callback);
    }
    function callInstantiationCallbacks(callbacks) {
        if (Array.isArray(callbacks)) {
            for (var index = 0; index < callbacks.length; index++) {
                var callback = callbacks[index];
                if (typeof callback === 'function') {
                    callback(this);
                }
            }
        }
    }
    return {
        setters:[
            function (debug_9_1) {
                debug_9 = debug_9_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/singleton/singleton", ["debug/debug", "runtime/instantiation/instantiation"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var debug_10, instantiation_1;
    function singleton(TargetClass) {
        debug_10.assert(typeof TargetClass === 'function', 'Decorator singleton has to be applied on a class!', TypeError);
        debug_10.assert(!TargetClass.instance, 'The class seems to already implement the singleton pattern');
        TargetClass = instantiation_1.onBeforeInstantiation(TargetClass, function (Klass) {
            debug_10.assert(typeof TargetClass['_allowInstantiation'] === 'undefined', 'It`s not allowed to instantiate singleton classes directly. Use `@singleton` instead!');
        });
        var instance = new TargetClass();
        Object.defineProperty(TargetClass, '_allowInstantiation', {
            writable: false,
            configurable: false,
            enumerable: false,
            value: false
        });
        Object.defineProperty(TargetClass, '_instance', {
            writable: false,
            configurable: false,
            enumerable: false,
            value: instance
        });
        Object.defineProperty(TargetClass, 'instance', {
            get: function () {
                return instance;
            },
            set: function (value) {
                throw new Error('Redefining the instance of a Singleton is not allowed!');
            }
        });
        return TargetClass;
    }
    exports_19("singleton", singleton);
    return {
        setters:[
            function (debug_10_1) {
                debug_10 = debug_10_1;
            },
            function (instantiation_1_1) {
                instantiation_1 = instantiation_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/injectable/injectable", ["debug/debug", "runtime/singleton/singleton"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var debug_11, singleton_1;
    function injectable(TargetClass) {
        debug_11.assert(typeof TargetClass === 'function', 'Decorator injectable has to be applied on a class!', TypeError);
        // injectable is basically just a singleton decorator
        return singleton_1.singleton(TargetClass);
    }
    exports_20("injectable", injectable);
    return {
        setters:[
            function (debug_11_1) {
                debug_11 = debug_11_1;
            },
            function (singleton_1_1) {
                singleton_1 = singleton_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/inject/inject", [], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    function inject(InjectableClass) {
        return function (target, propertyName) {
            target[propertyName] = InjectableClass.instance;
        };
    }
    exports_21("inject", inject);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("runtime/register/register", ["debug/debug"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var debug_12;
    function register(meta) {
        return function (TargetClass) {
            registerClass(TargetClass, meta);
        };
    }
    exports_22("register", register);
    function registerClass(TargetClass, meta) {
        debug_12.assert(arguments.length > 0 && arguments.length < 3, 'registerClass must be called with at least one argument; a TargetClass and optional a meta object');
        debug_12.assert(typeof TargetClass === 'function' && typeof TargetClass.register === 'function', 'The TargetClass has to be an Application, Controller or Component', TypeError);
        debug_12.assert(typeof meta === 'object' || typeof meta === 'undefined', 'Meta has to be an object if defined', TypeError);
        TargetClass.register(TargetClass, meta);
    }
    exports_22("registerClass", registerClass);
    return {
        setters:[
            function (debug_12_1) {
                debug_12 = debug_12_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/runtime", ["runtime/mojito/mojito", "runtime/application/application", "runtime/controller/controller", "runtime/service/service", "runtime/injectable/injectable", "runtime/inject/inject", "runtime/singleton/singleton", "runtime/register/register"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    return {
        setters:[
            function (mojito_1_1) {
                exports_23({
                    "Mojito": mojito_1_1["Mojito"]
                });
            },
            function (application_1_1) {
                exports_23({
                    "Application": application_1_1["Application"]
                });
            },
            function (controller_1_1) {
                exports_23({
                    "Controller": controller_1_1["Controller"]
                });
            },
            function (service_1_1) {
                exports_23({
                    "Service": service_1_1["Service"]
                });
            },
            function (injectable_1_1) {
                exports_23({
                    "injectable": injectable_1_1["injectable"]
                });
            },
            function (inject_1_1) {
                exports_23({
                    "inject": inject_1_1["inject"]
                });
            },
            function (singleton_2_1) {
                exports_23({
                    "singleton": singleton_2_1["singleton"]
                });
            },
            function (register_1_1) {
                exports_23({
                    "register": register_1_1["register"],
                    "registerClass": register_1_1["registerClass"],
                    "ITargetClass": register_1_1["ITargetClass"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("core/view/view", ["core/class/class", "core/meta/meta", "debug/debug"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var class_2, meta_3, debug_13;
    var CoreView;
    return {
        setters:[
            function (class_2_1) {
                class_2 = class_2_1;
            },
            function (meta_3_1) {
                meta_3 = meta_3_1;
            },
            function (debug_13_1) {
                debug_13 = debug_13_1;
            }],
        execute: function() {
            CoreView = (function (_super) {
                __extends(CoreView, _super);
                function CoreView() {
                    _super.apply(this, arguments);
                    this._isAttached = false;
                    this._isRendered = false;
                    this._isDestroyed = false;
                }
                Object.defineProperty(CoreView.prototype, "$", {
                    get: function () {
                        return function (selector) {
                            var element = meta_3.Meta.peek(this).getProperty('view', 'element');
                            debug_13.assert(this._isAttached, 'The views element is available after it got created. Use the `onDidCreateView` hook to detect when the view is ready.');
                            debug_13.assert(typeof selector === 'string' || typeof selector === 'undefined', 'The selector provided to $ has to be a string', TypeError);
                            if (typeof selector === 'string') {
                                debug_13.assert(!!element.querySelectorAll, 'The element does not support querySelectorAll', TypeError);
                                var elements = element.querySelectorAll(selector);
                                return elements.length === 1 ? elements.item(0) : elements;
                            }
                            return element;
                        };
                    },
                    set: function (value) {
                        throw new Error('Setting $ on a view is not allowed');
                    },
                    enumerable: true,
                    configurable: true
                });
                CoreView.prototype._attachView = function (element) {
                    debug_13.assert(!this._isAttached, 'The views is already attached. It`s not allowed to attach it again!');
                    var self = this;
                    var onDidAttachView = self['onDidAttachView'];
                    meta_3.Meta.peek(this).setProperty('view', 'element', element);
                    this._isAttached = true;
                    if (typeof onDidAttachView === 'function') {
                        onDidAttachView(element);
                    }
                };
                CoreView.prototype._renderView = function () { };
                return CoreView;
            }(class_2.CoreClass));
            exports_24("CoreView", CoreView);
        }
    }
});
System.register("core/core", ["core/get/get", "core/set/set", "core/meta/meta", "core/object/object", "core/array/array", "core/map/map", "core/class/class", "core/view/view", "core/observer/observer"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    return {
        setters:[
            function (get_2_1) {
                exports_25({
                    "get": get_2_1["get"]
                });
            },
            function (set_2_1) {
                exports_25({
                    "set": set_2_1["set"]
                });
            },
            function (meta_4_1) {
                exports_25({
                    "Meta": meta_4_1["Meta"]
                });
            },
            function (object_4_1) {
                exports_25({
                    "CoreObject": object_4_1["CoreObject"]
                });
            },
            function (array_1_1) {
                exports_25({
                    "CoreArray": array_1_1["CoreArray"]
                });
            },
            function (map_1_1) {
                exports_25({
                    "CoreMap": map_1_1["CoreMap"]
                });
            },
            function (class_3_1) {
                exports_25({
                    "CoreClass": class_3_1["CoreClass"]
                });
            },
            function (view_1_1) {
                exports_25({
                    "CoreView": view_1_1["CoreView"],
                    "onDidAttachView": view_1_1["onDidAttachView"],
                    "onDidRenderView": view_1_1["onDidRenderView"]
                });
            },
            function (observer_1_1) {
                exports_25({
                    "Observer": observer_1_1["Observer"],
                    "observes": observer_1_1["observes"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("mojito/core", ["core/core"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_26(exports);
    }
    return {
        setters:[
            function (core_5_1) {
                exportStar_1(core_5_1);
            }],
        execute: function() {
        }
    }
});
System.register("mojito/debug", ["debug/debug"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    function exportStar_2(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_27(exports);
    }
    return {
        setters:[
            function (debug_14_1) {
                exportStar_2(debug_14_1);
            }],
        execute: function() {
        }
    }
});
System.register("mojito/runtime", ["runtime/runtime"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    function exportStar_3(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_28(exports);
    }
    return {
        setters:[
            function (runtime_2_1) {
                exportStar_3(runtime_2_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qaXRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliL2RlYnVnL2Fzc2VydC9hc3NlcnQudHMiLCJsaWIvZGVidWcvZGVidWcudHMiLCJsaWIvY29yZS9nZXQvZ2V0LnRzIiwibGliL2NvcmUvb2JzZXJ2ZXIvb2JzZXJ2ZXIudHMiLCJsaWIvY29yZS9hcnJheS9hcnJheS50cyIsImxpYi9jb3JlL21ldGEvbWV0YS50cyIsImxpYi9jb3JlL29iamVjdC9vYmplY3QudHMiLCJsaWIvY29yZS9zZXQvc2V0LnRzIiwibGliL2NvcmUvaXRlcmF0b3IvaXRlcmF0b3IudHMiLCJsaWIvY29yZS9tYXAvbWFwLnRzIiwibGliL2NvcmUvY2xhc3MvY2xhc3MudHMiLCJsaWIvcnVudGltZS9tb2ppdG8vbW9qaXRvLnRzIiwibGliL3V0aWxzL2NsYXNzL2NsYXNzLnRzIiwibGliL3V0aWxzL3V0aWxzLnRzIiwibGliL3J1bnRpbWUvY29udHJvbGxlci9jb250cm9sbGVyLnRzIiwibGliL3J1bnRpbWUvYXBwbGljYXRpb24vYXBwbGljYXRpb24udHMiLCJsaWIvcnVudGltZS9zZXJ2aWNlL3NlcnZpY2UudHMiLCJsaWIvcnVudGltZS9pbnN0YW50aWF0aW9uL2luc3RhbnRpYXRpb24udHMiLCJsaWIvcnVudGltZS9zaW5nbGV0b24vc2luZ2xldG9uLnRzIiwibGliL3J1bnRpbWUvaW5qZWN0YWJsZS9pbmplY3RhYmxlLnRzIiwibGliL3J1bnRpbWUvaW5qZWN0L2luamVjdC50cyIsImxpYi9ydW50aW1lL3JlZ2lzdGVyL3JlZ2lzdGVyLnRzIiwibGliL3J1bnRpbWUvcnVudGltZS50cyIsImxpYi9jb3JlL3ZpZXcvdmlldy50cyIsImxpYi9jb3JlL2NvcmUudHMiLCJsaWIvbW9qaXRvL2NvcmUudHMiLCJsaWIvbW9qaXRvL2RlYnVnLnRzIiwibGliL21vaml0by9ydW50aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQUE7Ozs7Ozs7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