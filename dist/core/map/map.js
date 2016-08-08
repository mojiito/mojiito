"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require('../iterator/iterator');
var debug_1 = require('./../../debug/debug');
/**
 * Implementation of the ES6 Map.
 * The Map object is a simple key/value map.
 * Any value (both objects and primitive values) may be used as either a key or a value.
 *
 * @export
 * @class CoreMap
 * @implements {IIterable<any>}
 */
var CoreMap = (function () {
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
            debug_1.Logger.log(debug_1.LogLevel.debug, "Don't use length property on CoreMaps!!", debug_1.LogType.warn);
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
exports.CoreMap = CoreMap;
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
var TypedMap = (function (_super) {
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
exports.TypedMap = TypedMap;
//# sourceMappingURL=map.js.map