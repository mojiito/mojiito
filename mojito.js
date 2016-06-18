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
System.register("core/array/array", ["debug/debug", "core/meta/meta"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
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
            exports_4("CoreArray", CoreArray);
        }
    }
});
System.register("core/meta/meta", ["debug/debug"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
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
            exports_5("Meta", Meta);
        }
    }
});
System.register("core/iterator/iterator", ["debug/debug"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var debug_4;
    var CoreIterator;
    return {
        setters:[
            function (debug_4_1) {
                debug_4 = debug_4_1;
            }],
        execute: function() {
            CoreIterator = (function () {
                function CoreIterator(source) {
                    this._nextIndex = 0;
                    debug_4.assert(arguments.length === 1, 'CoreIterator must be created with one argument; an iterable object');
                    debug_4.assert(typeof source.length === 'number', 'The source property has to be a iterable object', TypeError);
                    this._source = source;
                }
                CoreIterator.prototype.next = function () {
                    var source = this._source;
                    return this._nextIndex < source.length ? { value: source[this._nextIndex++], done: false } : { done: true };
                };
                return CoreIterator;
            }());
            exports_6("CoreIterator", CoreIterator);
        }
    }
});
System.register("core/watch/watch", ["core/properties/properties"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var properties_1;
    function watchKey(obj, key) {
        if (!properties_1.isDefinedProperty(obj, key)) {
            properties_1.defineProperty(obj, key);
        }
    }
    exports_7("watchKey", watchKey);
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
    exports_7("watchPath", watchPath);
    return {
        setters:[
            function (properties_1_1) {
                properties_1 = properties_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/observable/observe", ["debug/assert/assert", "core/meta/meta", "core/watch/watch", "core/observable/observer"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
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
            console.log(source, part);
            if (i >= parts.length - 1) {
                console.log('end');
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
    exports_8("observe", observe);
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
System.register("core/observable/observable", [], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("core/observable/observableObject", ["core/object/object", "core/observable/observe"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
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
            exports_10("ObservableObject", ObservableObject);
        }
    }
});
System.register("core/observable/observer", ["debug/debug", "core/meta/meta"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var debug_5, meta_3;
    var Observer;
    function notifyObservers(obj, key) {
        var observer = meta_3.Meta.peek(obj).getProperty('observers', key);
        if (observer instanceof Observer) {
            observer.notify();
        }
    }
    exports_11("notifyObservers", notifyObservers);
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
            exports_11("Observer", Observer);
        }
    }
});
System.register("core/properties/propertyEvents", ["core/observable/observer"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var observer_2;
    function propertyWillChange(obj, key, newValue, oldValue) {
        if (typeof obj.propertyWillChange === 'function') {
            obj.propertyWillChange.call(obj, key);
        }
    }
    exports_12("propertyWillChange", propertyWillChange);
    function propertyDidChange(obj, key, newValue, oldValue) {
        if (typeof obj.propertyDidChange === 'function') {
            obj.propertyDidChange.call(obj, key);
        }
        observer_2.notifyObservers(obj, key);
    }
    exports_12("propertyDidChange", propertyDidChange);
    return {
        setters:[
            function (observer_2_1) {
                observer_2 = observer_2_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/properties/mandatory_set", ["core/meta/meta", "core/properties/propertyEvents"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
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
    exports_13("mandatory_set", mandatory_set);
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
System.register("core/properties/properties", ["debug/debug", "core/meta/meta", "core/properties/mandatory_set"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
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
    exports_14("defineProperty", defineProperty);
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
    exports_14("isDefinedProperty", isDefinedProperty);
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
System.register("core/object/object", ["debug/debug", "core/get/get", "core/set/set", "core/properties/properties", "core/meta/meta"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
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
            exports_15("CoreObject", CoreObject);
        }
    }
});
System.register("core/set/set", ["debug/debug"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
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
    exports_16("set", set);
    function setProperties(obj, properties) {
        for (var key in properties) {
            set(obj, key, properties[key]);
        }
        return obj;
    }
    exports_16("setProperties", setProperties);
    return {
        setters:[
            function (debug_8_1) {
                debug_8 = debug_8_1;
            }],
        execute: function() {
        }
    }
});
System.register("core/map/map", ["core/iterator/iterator"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
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
             * @extends {CoreIterator<any>}
             */
            CoreMapIterator = (function (_super) {
                __extends(CoreMapIterator, _super);
                /**
                 * Creates an instance of CoreMapIterator.
                 *
                 * @param {IIterable<any>} source Iterable object
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
                 * @returns {IIteratorItem<any>} The next item in the CoreMap
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
            exports_17("CoreMapIterator", CoreMapIterator);
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
                     * @type {IIterable<any>}
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
                 * @returns {CoreMapIterator} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
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
                    source.push([key, value]);
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
                CoreMap.create = function (source) {
                    return new CoreMap(source);
                };
                return CoreMap;
            }());
            exports_17("CoreMap", CoreMap);
        }
    }
});
System.register("core/observable/observes", ["debug/debug", "core/observable/observe", "core/observable/observableObject"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var debug_9, observe_2, observableObject_1;
    function observes() {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        debug_9.assert(arguments.length > 0, 'The observes decorator must be called with at least one property key');
        return function (target, propertyKey, descriptor) {
            debug_9.assert(arguments.length === 3, 'The observe decorator callback must be called with three arguments; a target, a propertyKey and a descriptor');
            debug_9.assert(target instanceof observableObject_1.ObservableObject, 'The target provided to the observe decorator callback must be an object and an instace of `ObservableObject`', TypeError);
            debug_9.assert(typeof propertyKey === 'string', 'The property key provided to the observe decorator callback must be a string', TypeError);
            //const source: any = target;  // needed for enabled noImplicitAny
            var callback = descriptor.value;
            debug_9.assert(typeof callback === 'function', 'The callback for the observer has to be a function', TypeError);
            for (var i = 0, max = keys.length; i < max; i++) {
                var key = keys[i];
                debug_9.assert(typeof key === 'string', 'The keys provided to the observe decorator callback must be strings', TypeError);
                observe_2.observe(target, key, callback, target);
            }
            return descriptor;
        };
    }
    exports_18("observes", observes);
    return {
        setters:[
            function (debug_9_1) {
                debug_9 = debug_9_1;
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
System.register("core/core", ["core/get/get", "core/set/set", "core/meta/meta", "core/object/object", "core/array/array", "core/map/map", "core/observable/observes", "core/observable/observableObject"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    return {
        setters:[
            function (get_2_1) {
                exports_19({
                    "get": get_2_1["get"]
                });
            },
            function (set_2_1) {
                exports_19({
                    "set": set_2_1["set"]
                });
            },
            function (meta_7_1) {
                exports_19({
                    "Meta": meta_7_1["Meta"]
                });
            },
            function (object_2_1) {
                exports_19({
                    "CoreObject": object_2_1["CoreObject"]
                });
            },
            function (array_1_1) {
                exports_19({
                    "CoreArray": array_1_1["CoreArray"]
                });
            },
            function (map_1_1) {
                exports_19({
                    "CoreMap": map_1_1["CoreMap"]
                });
            },
            function (observes_1_1) {
                exports_19({
                    "observes": observes_1_1["observes"]
                });
            },
            function (observableObject_2_1) {
                exports_19({
                    "ObservableObject": observableObject_2_1["ObservableObject"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("mojito/core", ["core/core"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_20(exports);
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
System.register("mojito/debug", ["debug/debug"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    function exportStar_2(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_21(exports);
    }
    return {
        setters:[
            function (debug_10_1) {
                exportStar_2(debug_10_1);
            }],
        execute: function() {
        }
    }
});
System.register("runtime/mojito/mojito", ["core/core"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var core_2;
    var Mojito;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            }],
        execute: function() {
            Mojito = (function () {
                function Mojito() {
                    var instance = core_2.get(self, Mojito.GLOBAL_NAMESPACE);
                    if (!instance) {
                        instance = this;
                        core_2.set(self, Mojito.GLOBAL_NAMESPACE, instance);
                    }
                }
                Mojito.getInstance = function () {
                    if (!core_2.get(Mojito, '_instance')) {
                        var instance = new Mojito();
                        Object.defineProperty(Mojito, '_instance', {
                            writable: false,
                            configurable: false,
                            enumerable: false,
                            value: instance
                        });
                    }
                    return core_2.get(Mojito, 'instance');
                };
                Mojito.GLOBAL_NAMESPACE = 'Mojito';
                return Mojito;
            }());
            exports_22("Mojito", Mojito);
        }
    }
});
System.register("runtime/directives/directive", ["debug/debug"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var debug_11;
    var directives;
    /**
     * Directives allow you to attach behavior (a class) to elements in the DOM
     * using a class decorator or the {@link registerDirective} function.
     *
     * A directive contains metadata (including the elements selector or name)
     * and a class which will be attached to the elements.
     *
     * Assume this HTML Template or DOM
     * ```html
     * <form class="form">
     *   <div>
     *     <div my-directive>
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
     * @Directive({ selector: '[my-directive]'})
     * class MyDirective {
     *  // Your Code
     * }
     *
     * @export
     * @param {IDirectiveMetadata} metadata Directive metadata
     * @returns {ClassDecorator}
     */
    function Directive(metadata) {
        return function (klass) {
            registerDirective(klass, metadata);
        };
    }
    exports_23("Directive", Directive);
    /**
     * Function for registering the class and directive metadata.
     * Normally you would not call this function directly.
     * Use the {@link Directive} class decorator.
     *
     * @export
     * @param {IClassDefinition} klass The directive klass which will be attached
     * @param {IDirectiveMetadata} metadata The directive metadata
     */
    function registerDirective(klass, metadata) {
        debug_11.assert(typeof metadata === 'object' && !Array.isArray(metadata), 'The metadata property for the directive must be an object and implement the IControllerMetadata interface!', TypeError);
        debug_11.assert(typeof metadata.name === 'string' || typeof metadata.selector === 'string', 'The directive metadata object must specify a name and/or a selector!');
        var name = metadata.name;
        if (!name) {
            name = '' + Math.floor(Math.random() * 10 + 1) * Date.now();
        }
        // Check if directive with a specific name is already registerd
        debug_11.assert(typeof directives[name] === 'undefined', "The directive with the name \"" + name + "\" has been already registerd!", ReferenceError);
        // add to directives object
        directives[name] = {
            klass: klass,
            metadata: metadata
        };
    }
    exports_23("registerDirective", registerDirective);
    return {
        setters:[
            function (debug_11_1) {
                debug_11 = debug_11_1;
            }],
        execute: function() {
            /**
             * Directives are stored here.
             */
            directives = {};
        }
    }
});
System.register("runtime/directives/controller", ["runtime/directives/directive"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var directive_1;
    function Controller(meta) {
        return directive_1.Directive(meta);
    }
    exports_24("Controller", Controller);
    return {
        setters:[
            function (directive_1_1) {
                directive_1 = directive_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/directives/component", ["runtime/directives/directive"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var directive_2;
    function Component(meta) {
        return directive_2.Directive(meta);
    }
    exports_25("Component", Component);
    return {
        setters:[
            function (directive_2_1) {
                directive_2 = directive_2_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/directives/application", ["runtime/directives/directive"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var directive_3;
    function Application(meta) {
        return directive_3.Directive(meta);
    }
    exports_26("Application", Application);
    return {
        setters:[
            function (directive_3_1) {
                directive_3 = directive_3_1;
            }],
        execute: function() {
        }
    }
});
System.register("runtime/directives/directives", ["runtime/directives/directive", "runtime/directives/controller", "runtime/directives/component", "runtime/directives/application"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    return {
        setters:[
            function (directive_4_1) {
                exports_27({
                    "Directive": directive_4_1["Directive"],
                    "IDirectiveMetadata": directive_4_1["IDirectiveMetadata"],
                    "registerDirective": directive_4_1["registerDirective"]
                });
            },
            function (controller_1_1) {
                exports_27({
                    "Controller": controller_1_1["Controller"],
                    "IControllerMetadata": controller_1_1["IControllerMetadata"]
                });
            },
            function (component_1_1) {
                exports_27({
                    "Component": component_1_1["Component"],
                    "IComponentMetadata": component_1_1["IComponentMetadata"]
                });
            },
            function (application_1_1) {
                exports_27({
                    "Application": application_1_1["Application"],
                    "IApplicationMetadata": application_1_1["IApplicationMetadata"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("runtime/runtime", ["runtime/mojito/mojito", "runtime/directives/directives"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    return {
        setters:[
            function (mojito_1_1) {
                exports_28({
                    "Mojito": mojito_1_1["Mojito"]
                });
            },
            function (directives_1_1) {
                exports_28({
                    "Directive": directives_1_1["Directive"],
                    "Component": directives_1_1["Component"],
                    "Controller": directives_1_1["Controller"],
                    "Application": directives_1_1["Application"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("mojito/runtime", ["runtime/runtime"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    function exportStar_3(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_29(exports);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qaXRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliL2RlYnVnL2Fzc2VydC9hc3NlcnQudHMiLCJsaWIvZGVidWcvZGVidWcudHMiLCJsaWIvY29yZS9nZXQvZ2V0LnRzIiwibGliL2NvcmUvYXJyYXkvYXJyYXkudHMiLCJsaWIvY29yZS9tZXRhL21ldGEudHMiLCJsaWIvY29yZS9pdGVyYXRvci9pdGVyYXRvci50cyIsImxpYi9jb3JlL3dhdGNoL3dhdGNoLnRzIiwibGliL2NvcmUvb2JzZXJ2YWJsZS9vYnNlcnZlLnRzIiwibGliL2NvcmUvb2JzZXJ2YWJsZS9vYnNlcnZhYmxlLnRzIiwibGliL2NvcmUvb2JzZXJ2YWJsZS9vYnNlcnZhYmxlT2JqZWN0LnRzIiwibGliL2NvcmUvb2JzZXJ2YWJsZS9vYnNlcnZlci50cyIsImxpYi9jb3JlL3Byb3BlcnRpZXMvcHJvcGVydHlFdmVudHMudHMiLCJsaWIvY29yZS9wcm9wZXJ0aWVzL21hbmRhdG9yeV9zZXQudHMiLCJsaWIvY29yZS9wcm9wZXJ0aWVzL3Byb3BlcnRpZXMudHMiLCJsaWIvY29yZS9vYmplY3Qvb2JqZWN0LnRzIiwibGliL2NvcmUvc2V0L3NldC50cyIsImxpYi9jb3JlL21hcC9tYXAudHMiLCJsaWIvY29yZS9vYnNlcnZhYmxlL29ic2VydmVzLnRzIiwibGliL2NvcmUvY29yZS50cyIsImxpYi9tb2ppdG8vY29yZS50cyIsImxpYi9tb2ppdG8vZGVidWcudHMiLCJsaWIvcnVudGltZS9tb2ppdG8vbW9qaXRvLnRzIiwibGliL3J1bnRpbWUvZGlyZWN0aXZlcy9kaXJlY3RpdmUudHMiLCJsaWIvcnVudGltZS9kaXJlY3RpdmVzL2NvbnRyb2xsZXIudHMiLCJsaWIvcnVudGltZS9kaXJlY3RpdmVzL2NvbXBvbmVudC50cyIsImxpYi9ydW50aW1lL2RpcmVjdGl2ZXMvYXBwbGljYXRpb24udHMiLCJsaWIvcnVudGltZS9kaXJlY3RpdmVzL2RpcmVjdGl2ZXMudHMiLCJsaWIvcnVu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