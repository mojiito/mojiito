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
System.register("core/class/class", ["core/object/object"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
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
            exports_9("CoreClass", CoreClass);
        }
    }
});
System.register("runtime/mojito/mojito", ["core/core", "runtime/runtime", "debug/debug"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var core_1, runtime_1, debug_7;
    var Mojito;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (runtime_1_1) {
                runtime_1 = runtime_1_1;
            },
            function (debug_7_1) {
                debug_7 = debug_7_1;
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
                Mojito.prototype.registerApplication = function (application) {
                    debug_7.assert(arguments.length === 1, 'registerApplication must be called with one argument: an application instance');
                    debug_7.assert(application instanceof runtime_1.Application, 'The argument provided to the registerApplication method must be an application instance', TypeError);
                    return core_1.Meta.peek(this).setProperty('applications', application.name, application);
                };
                Mojito.prototype.getApplication = function (applicationName) {
                    debug_7.assert(arguments.length === 1, 'getApplication must be called with one argument: an application name');
                    debug_7.assert(typeof applicationName === 'string', 'The applicationName provided to the getApplication method must be a string', TypeError);
                    return core_1.Meta.peek(this).getProperty('applications', applicationName);
                };
                Mojito.prototype.getApplications = function () {
                    return core_1.Meta.peek(this).getMember('applications');
                };
                Mojito.getInstance = function () {
                    debugger;
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
            exports_10("Mojito", Mojito);
        }
    }
});
System.register("runtime/controller/controller", ["core/core"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
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
                Controller.prototype._attachController = function (element) {
                    _super.prototype._attachView.call(this, element);
                };
                Controller.register = function (ControllerClass, meta) {
                    var elements = meta.application.root.querySelectorAll(meta.selector);
                    var instances = [];
                    for (var i = 0, max = elements.length; i < max; i++) {
                        var element = elements[i];
                        var controllerInstance = new ControllerClass();
                        core_2.Meta.peek(controllerInstance).setProperties('controller', meta, {
                            writable: false,
                            configurable: false,
                            enumerable: true
                        });
                        instances.push(controllerInstance);
                        controllerInstance._attachController(element);
                    }
                    return instances;
                };
                return Controller;
            }(core_2.CoreView));
            exports_11("Controller", Controller);
        }
    }
});
System.register("runtime/application/application", ["runtime/mojito/mojito", "debug/debug", "core/core", "runtime/controller/controller"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var mojito_1, debug_8, core_3, controller_1;
    var Application;
    return {
        setters:[
            function (mojito_1_1) {
                mojito_1 = mojito_1_1;
            },
            function (debug_8_1) {
                debug_8 = debug_8_1;
            },
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (controller_1_1) {
                controller_1 = controller_1_1;
            }],
        execute: function() {
            Application = (function (_super) {
                __extends(Application, _super);
                function Application(name) {
                    debug_8.assert(arguments.length === 1, 'Application must be created with on argument: a name');
                    debug_8.assert(typeof name === 'string', 'The name provided to the Application must be a string', TypeError);
                    debug_8.assert(!mojito_1.Mojito.getInstance().getApplication(name), 'An Application with the provided name has already been created');
                    _super.call(this);
                    var meta = core_3.Meta.peek(this);
                    var root = document.querySelector('[data-application="' + name + '"]'); // TODO: Use template engine when implemented
                    debug_8.assert(root instanceof Element, 'No application root was found!');
                    meta.setProperties('values', {
                        name: name,
                        root: root
                    }, {
                        writable: false,
                        configurable: false,
                        enumerable: false
                    });
                    meta.createMember('controllers');
                    meta.createMember('components');
                    mojito_1.Mojito.getInstance().registerApplication(this);
                }
                Object.defineProperty(Application.prototype, "name", {
                    get: function () {
                        return core_3.Meta.peek(this).getProperty('values', 'name');
                    },
                    set: function (value) {
                        throw new Error('Setting an application name directly is not allowed. The name has to be provided on the constructor');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Application.prototype, "root", {
                    get: function () {
                        return core_3.Meta.peek(this).getProperty('values', 'root');
                    },
                    set: function (value) {
                        throw new Error('Setting the application root directly is not allowed.');
                    },
                    enumerable: true,
                    configurable: true
                });
                Application.prototype.registerController = function (ControllerClass, meta) {
                    debug_8.assert(arguments.length === 2, 'registerController must be called with on argument: a controller class');
                    var controllers = controller_1.Controller.register(ControllerClass, meta);
                    var controllersList = core_3.Meta.peek(this).getProperty('controllers', ControllerClass.name);
                    if (!Array.isArray(controllersList)) {
                        core_3.Meta.peek(this).setProperty('controllers', ControllerClass.name, controllersList = []);
                    }
                    Array.prototype.push.apply(controllersList, controllers);
                    return controllersList;
                };
                Application.prototype.getControllers = function () {
                    return core_3.Meta.peek(this).getMember('controllers');
                };
                Application.prototype.getControllersByClassName = function (className) {
                    var controllersList = core_3.Meta.peek(this).getProperty('controllers', className);
                    return Array.isArray(controllersList) ? controllersList : [];
                };
                Application.create = function (name) {
                    debug_8.assert(arguments.length === 1, 'Application must be created with on argument: a name');
                    debug_8.assert(typeof name === 'string', 'The name provided to the create method must be a string', TypeError);
                    return new Application(name);
                };
                return Application;
            }(core_3.CoreClass));
            exports_12("Application", Application);
        }
    }
});
System.register("runtime/service/service", ["core/core"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
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
            exports_13("Service", Service);
        }
    }
});
System.register("runtime/instantiation/instantiation", ["debug/debug"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var debug_9;
    function onBeforeInstantiation(TargetClass, callback) {
        return instantiation(TargetClass, callback);
    }
    exports_14("onBeforeInstantiation", onBeforeInstantiation);
    function onAfterInstantiation(TargetClass, callback) {
        return instantiation(TargetClass, null, callback);
    }
    exports_14("onAfterInstantiation", onAfterInstantiation);
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
    exports_14("instantiation", instantiation);
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
System.register("runtime/singleton/singleton", ["debug/debug", "runtime/instantiation/instantiation"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
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
    exports_15("singleton", singleton);
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
System.register("runtime/injectable/injectable", ["debug/debug", "runtime/singleton/singleton"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var debug_11, singleton_1;
    function injectable(TargetClass) {
        debug_11.assert(typeof TargetClass === 'function', 'Decorator injectable has to be applied on a class!', TypeError);
        // injectable is basically just a singleton decorator
        return singleton_1.singleton(TargetClass);
    }
    exports_16("injectable", injectable);
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
System.register("runtime/inject/inject", [], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    function inject(InjectableClass) {
        return function (target, propertyName) {
            target[propertyName] = InjectableClass.instance;
        };
    }
    exports_17("inject", inject);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("runtime/register/register", ["runtime/mojito/mojito"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var mojito_2;
    function register(obj) {
        return function (TargetClass) {
            var applicationName = obj.application;
            var application = mojito_2.Mojito.getInstance().getApplication(applicationName);
            application.registerController(TargetClass, {
                application: application,
                selector: obj.selector
            });
        };
    }
    exports_18("register", register);
    return {
        setters:[
            function (mojito_2_1) {
                mojito_2 = mojito_2_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/runtime", ["runtime/mojito/mojito", "runtime/application/application", "runtime/controller/controller", "runtime/service/service", "runtime/injectable/injectable", "runtime/inject/inject", "runtime/singleton/singleton", "runtime/register/register"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    return {
        setters:[
            function (mojito_3_1) {
                exports_19({
                    "Mojito": mojito_3_1["Mojito"]
                });
            },
            function (application_1_1) {
                exports_19({
                    "Application": application_1_1["Application"]
                });
            },
            function (controller_2_1) {
                exports_19({
                    "Controller": controller_2_1["Controller"]
                });
            },
            function (service_1_1) {
                exports_19({
                    "Service": service_1_1["Service"]
                });
            },
            function (injectable_1_1) {
                exports_19({
                    "injectable": injectable_1_1["injectable"]
                });
            },
            function (inject_1_1) {
                exports_19({
                    "inject": inject_1_1["inject"]
                });
            },
            function (singleton_2_1) {
                exports_19({
                    "singleton": singleton_2_1["singleton"]
                });
            },
            function (register_1_1) {
                exports_19({
                    "register": register_1_1["register"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("core/view/view", ["core/class/class", "core/meta/meta", "debug/debug"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var class_1, meta_3, debug_12;
    var CoreView;
    return {
        setters:[
            function (class_1_1) {
                class_1 = class_1_1;
            },
            function (meta_3_1) {
                meta_3 = meta_3_1;
            },
            function (debug_12_1) {
                debug_12 = debug_12_1;
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
                            debug_12.assert(this._isAttached, 'The views element is available after it got created. Use the `onDidCreateView` hook to detect when the view is ready.');
                            debug_12.assert(typeof selector === 'string' || typeof selector === 'undefined', 'The selector provided to $ has to be a string', TypeError);
                            if (typeof selector === 'string') {
                                debug_12.assert(!!element.querySelectorAll, 'The element does not support querySelectorAll', TypeError);
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
                    debug_12.assert(!this._isAttached, 'The views is already attached. It`s not allowed to attach it again!');
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
            }(class_1.CoreClass));
            exports_20("CoreView", CoreView);
        }
    }
});
System.register("core/core", ["core/get/get", "core/set/set", "core/meta/meta", "core/object/object", "core/array/array", "core/class/class", "core/view/view", "core/observer/observer"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    return {
        setters:[
            function (get_2_1) {
                exports_21({
                    "get": get_2_1["get"]
                });
            },
            function (set_2_1) {
                exports_21({
                    "set": set_2_1["set"]
                });
            },
            function (meta_4_1) {
                exports_21({
                    "Meta": meta_4_1["Meta"]
                });
            },
            function (object_4_1) {
                exports_21({
                    "CoreObject": object_4_1["CoreObject"]
                });
            },
            function (array_1_1) {
                exports_21({
                    "CoreArray": array_1_1["CoreArray"]
                });
            },
            function (class_2_1) {
                exports_21({
                    "CoreClass": class_2_1["CoreClass"]
                });
            },
            function (view_1_1) {
                exports_21({
                    "CoreView": view_1_1["CoreView"],
                    "onDidAttachView": view_1_1["onDidAttachView"],
                    "onDidRenderView": view_1_1["onDidRenderView"]
                });
            },
            function (observer_1_1) {
                exports_21({
                    "Observer": observer_1_1["Observer"],
                    "observes": observer_1_1["observes"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("mojito/core", ["core/core"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_22(exports);
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
System.register("mojito/debug", ["debug/debug"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    function exportStar_2(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_23(exports);
    }
    return {
        setters:[
            function (debug_13_1) {
                exportStar_2(debug_13_1);
            }],
        execute: function() {
        }
    }
});
System.register("mojito/runtime", ["runtime/runtime"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    function exportStar_3(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_24(exports);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qaXRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliL2RlYnVnL2Fzc2VydC9hc3NlcnQudHMiLCJsaWIvZGVidWcvZGVidWcudHMiLCJsaWIvY29yZS9nZXQvZ2V0LnRzIiwibGliL2NvcmUvb2JzZXJ2ZXIvb2JzZXJ2ZXIudHMiLCJsaWIvY29yZS9hcnJheS9hcnJheS50cyIsImxpYi9jb3JlL21ldGEvbWV0YS50cyIsImxpYi9jb3JlL29iamVjdC9vYmplY3QudHMiLCJsaWIvY29yZS9zZXQvc2V0LnRzIiwibGliL2NvcmUvY2xhc3MvY2xhc3MudHMiLCJsaWIvcnVudGltZS9tb2ppdG8vbW9qaXRvLnRzIiwibGliL3J1bnRpbWUvY29udHJvbGxlci9jb250cm9sbGVyLnRzIiwibGliL3J1bnRpbWUvYXBwbGljYXRpb24vYXBwbGljYXRpb24udHMiLCJsaWIvcnVudGltZS9zZXJ2aWNlL3NlcnZpY2UudHMiLCJsaWIvcnVudGltZS9pbnN0YW50aWF0aW9uL2luc3RhbnRpYXRpb24udHMiLCJsaWIvcnVudGltZS9zaW5nbGV0b24vc2luZ2xldG9uLnRzIiwibGliL3J1bnRpbWUvaW5qZWN0YWJsZS9pbmplY3RhYmxlLnRzIiwibGliL3J1bnRpbWUvaW5qZWN0L2luamVjdC50cyIsImxpYi9ydW50aW1lL3JlZ2lzdGVyL3JlZ2lzdGVyLnRzIiwibGliL3J1bnRpbWUvcnVudGltZS50cyIsImxpYi9jb3JlL3ZpZXcvdmlldy50cyIsImxpYi9jb3JlL2NvcmUudHMiLCJsaWIvbW9qaXRvL2NvcmUudHMiLCJsaWIvbW9qaXRvL2RlYnVnLnRzIiwibGliL21vaml0by9ydW50aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQUE7Ozs7Ozs7T0FPRztJQUNILGdCQUF1QixTQUFrQixFQUFFLE9BQWUsRUFBRSxTQUE0QjtRQUNwRixJQUFJLFdBQVcsR0FBRyxTQUFTLEdBQUcsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUNoRCxF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