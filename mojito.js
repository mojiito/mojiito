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
define("debug/assert/assert", ["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.assert = assert;
});
define("debug/debug", ["require", "exports", "debug/assert/assert"], function (require, exports, assert_1) {
    "use strict";
    exports.assert = assert_1.assert;
});
define("core/get/get", ["require", "exports", "debug/debug"], function (require, exports, debug_1) {
    "use strict";
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
    exports.get = get;
});
define("core/observer/observer", ["require", "exports", "debug/debug", "core/object/object"], function (require, exports, debug_2, object_1) {
    "use strict";
    var Observable = (function () {
        function Observable(subject, key) {
        }
        Observable.prototype.subscribe = function (callback) {
        };
        return Observable;
    }());
    exports.Observable = Observable;
    var Observer = (function () {
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
    exports.Observer = Observer;
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
    exports.observes = observes;
});
define("core/array/array", ["require", "exports", "debug/debug", "core/meta/meta"], function (require, exports, debug_3, meta_1) {
    "use strict";
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
    var CoreArray = (function () {
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
    exports.CoreArray = CoreArray;
});
define("core/meta/meta", ["require", "exports", "debug/debug"], function (require, exports, debug_4) {
    "use strict";
    /**
     * The meta object contains information about computed property descriptors,
     * values of defined properties as well as any watched properties and other information.
     *
     * @export
     * @class Meta
     */
    var Meta = (function () {
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
    exports.Meta = Meta;
});
define("core/object/object", ["require", "exports", "debug/debug", "core/get/get", "core/set/set", "core/meta/meta"], function (require, exports, debug_5, get_1, set_1, meta_2) {
    "use strict";
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
    var CoreObject = (function () {
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
    exports.CoreObject = CoreObject;
});
define("core/set/set", ["require", "exports", "debug/debug", "core/object/object"], function (require, exports, debug_6, object_2) {
    "use strict";
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
    exports.set = set;
});
define("core/class/class", ["require", "exports", "core/object/object"], function (require, exports, object_3) {
    "use strict";
    var CoreClass = (function (_super) {
        __extends(CoreClass, _super);
        function CoreClass(propertyMap) {
            _super.call(this, propertyMap);
        }
        return CoreClass;
    }(object_3.CoreObject));
    exports.CoreClass = CoreClass;
});
define("debug", ["require", "exports", "debug/assert/assert"], function (require, exports, assert_2) {
    "use strict";
    exports.assert = assert_2.assert;
});
define("runtime/mojito/mojito", ["require", "exports", "core", "runtime", "debug"], function (require, exports, core_1, runtime_1, debug_7) {
    "use strict";
    var Mojito = (function () {
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
            return core_1.get(Mojito, 'instance');
        };
        Mojito.GLOBAL_NAMESPACE = 'Mojito';
        Mojito = __decorate([
            runtime_1.singleton
        ], Mojito);
        return Mojito;
    }());
    exports.Mojito = Mojito;
});
define("runtime/controller/controller", ["require", "exports", "core"], function (require, exports, core_2) {
    "use strict";
    var Controller = (function (_super) {
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
    exports.Controller = Controller;
});
define("runtime/application/application", ["require", "exports", "runtime/mojito/mojito", "debug", "core", "runtime/controller/controller"], function (require, exports, mojito_1, debug_8, core_3, controller_1) {
    "use strict";
    var Application = (function (_super) {
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
    exports.Application = Application;
});
define("runtime/service/service", ["require", "exports", "core"], function (require, exports, core_4) {
    "use strict";
    var Service = (function (_super) {
        __extends(Service, _super);
        function Service() {
            _super.apply(this, arguments);
        }
        return Service;
    }(core_4.CoreObject));
    exports.Service = Service;
});
define("runtime/instantiation/instantiation", ["require", "exports", "debug/debug"], function (require, exports, debug_9) {
    "use strict";
    function onBeforeInstantiation(TargetClass, callback) {
        return instantiation(TargetClass, callback);
    }
    exports.onBeforeInstantiation = onBeforeInstantiation;
    function onAfterInstantiation(TargetClass, callback) {
        return instantiation(TargetClass, null, callback);
    }
    exports.onAfterInstantiation = onAfterInstantiation;
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
    exports.instantiation = instantiation;
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
});
define("runtime/singleton/singleton", ["require", "exports", "debug/debug", "runtime/instantiation/instantiation"], function (require, exports, debug_10, instantiation_1) {
    "use strict";
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
    exports.singleton = singleton;
});
define("runtime/injectable/injectable", ["require", "exports", "debug/debug", "runtime/singleton/singleton"], function (require, exports, debug_11, singleton_1) {
    "use strict";
    function injectable(TargetClass) {
        debug_11.assert(typeof TargetClass === 'function', 'Decorator injectable has to be applied on a class!', TypeError);
        // injectable is basically just a singleton decorator
        return singleton_1.singleton(TargetClass);
    }
    exports.injectable = injectable;
});
define("runtime/inject/inject", ["require", "exports"], function (require, exports) {
    "use strict";
    function inject(InjectableClass) {
        return function (target, propertyName) {
            target[propertyName] = InjectableClass.instance;
        };
    }
    exports.inject = inject;
});
define("runtime/register/register", ["require", "exports", "runtime/mojito/mojito"], function (require, exports, mojito_2) {
    "use strict";
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
    exports.register = register;
});
define("runtime", ["require", "exports", "runtime/mojito/mojito", "runtime/application/application", "runtime/controller/controller", "runtime/service/service", "runtime/injectable/injectable", "runtime/inject/inject", "runtime/singleton/singleton", "runtime/register/register"], function (require, exports, mojito_3, application_1, controller_2, service_1, injectable_1, inject_1, singleton_2, register_1) {
    "use strict";
    exports.Mojito = mojito_3.Mojito;
    exports.Application = application_1.Application;
    //export { Component } from './runtime/component/component';
    exports.Controller = controller_2.Controller;
    exports.Service = service_1.Service;
    exports.injectable = injectable_1.injectable;
    exports.inject = inject_1.inject;
    exports.singleton = singleton_2.singleton;
    exports.register = register_1.register;
});
define("core/view/view", ["require", "exports", "core/class/class", "core/meta/meta", "debug/debug"], function (require, exports, class_1, meta_3, debug_12) {
    "use strict";
    var CoreView = (function (_super) {
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
    exports.CoreView = CoreView;
});
define("core", ["require", "exports", "core/get/get", "core/set/set", "core/meta/meta", "core/object/object", "core/array/array", "core/class/class", "core/view/view", "core/observer/observer"], function (require, exports, get_2, set_2, meta_4, object_4, array_1, class_2, view_1, observer_1) {
    "use strict";
    exports.get = get_2.get;
    exports.set = set_2.set;
    exports.Meta = meta_4.Meta;
    exports.CoreObject = object_4.CoreObject;
    exports.CoreArray = array_1.CoreArray;
    exports.CoreClass = class_2.CoreClass;
    exports.CoreView = view_1.CoreView;
    exports.Observer = observer_1.Observer;
    exports.observes = observer_1.observes;
});
define("mojito", ["require", "exports", "core", "runtime", "debug"], function (require, exports, core_5, runtime_2, debug_13) {
    "use strict";
    exports.CoreObject = core_5.CoreObject;
    exports.CoreArray = core_5.CoreArray;
    exports.CoreClass = core_5.CoreClass;
    exports.CoreView = core_5.CoreView;
    exports.Meta = core_5.Meta;
    exports.Mojito = runtime_2.Mojito;
    exports.Application = runtime_2.Application;
    exports.Controller = runtime_2.Controller;
    exports.Service = runtime_2.Service;
    exports.singleton = runtime_2.singleton;
    exports.inject = runtime_2.inject;
    exports.injectable = runtime_2.injectable;
    exports.register = runtime_2.register;
    exports.assert = debug_13.assert;
});
