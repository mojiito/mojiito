import { Iterator, IIteratorItem, IIterable } from '../iterator/iterator';
import { assert, Logger, LogLevel, LogType } from './../../debug/debug';

/**
 * Implementation of the ES6 Map.
 * The Map object is a simple key/value map.
 * Any value (both objects and primitive values) may be used as either a key or a value.
 * 
 * @export
 * @class CoreMap
 * @implements {IIterable<any>}
 */
export class CoreMap implements IIterable<any>{

    /**
     * Internal Array where all thoses keys and values are stored.
     * 
     * @private
     * @type {Array<[any, any]}
     */
    private _source: Array<[any, any]> = [];

    /**
     * Returns the number of key/value pairs in the Map object.
     * 
     * @readonly
     * @type {number}
     */
    get size(): number {
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
    get length(): number {
        Logger.log(LogLevel.debug, `Don't use length property on CoreMaps!!`, LogType.warn);
        return 0;
    }

    /**
     * Creates an instance of an empty CoreMap.
     */
    constructor();
    /**
     * Creates an instance of CoreMap with data provided by an object.
     * The properties of the object will get stored as key/value paired arrays (eg: [key, value]).
     * The key will be the property name
     * The value will be the coresponding property value
     * 
     * @param {Object} source The provided source object
     */
    constructor(source: Object);
    /**
     * Creates an instance of CoreMap out of an array.
     * Every item of the provided array must be an array with two items - a key and a value.
     * 
     * @param {Array<[any, any]>} source The provided source array
     */
    constructor(source: Array<[any, any]>);
    constructor(source?: any) {
        if (Array.isArray(source)) {
            for (let i = 0, max = source.length; i < max; i++) {
                let item = <Array<[any, any]>>source[i];
                if (item.length === 2) {
                    this._source.push([item[0], item[1]]);
                } else {
                    throw new TypeError('The items in the provided source array must have the following structure [key, value]');
                }
            }
        } else if(typeof source === 'object') {
            for (var key in source) {
                this._source.push([key, source[key]]);
            }
        }
    }

    /**
     * Removes all key/value pairs from the Map object.
     */
    clear(): void {
        this._source = [];
    }

    /**
     * Removes any value associated to the key and returns the value that Map.has(key) would have previously returned.
     * Map.prototype.has(key) will return false afterwards.
     * 
     * @param {*} key The key of the element to remove from the Map object.
     */
    delete(key: any): void {
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
    entries(): Iterator<[any,any]> {
        return new Iterator(this._source);
    }

    /**
     * Calls callbackFn once for each key-value pair present in the Map object, in insertion order.
     * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
     * 
     * @param {(value: any, key: any, map: CoreMap) => void} callbackFn Function to execute for each element.
     * @param {(Object | Function)} [thisArg] Value to use as this when executing callback.
     */
    forEach(callbackFn: (value: any, key: any, map: CoreMap) => any, thisArg?: Object | Function): void {
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
    get(key: any): any {
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
    has(key: any): boolean {
        return !!this.get(key);
    }

    /**
     * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
     * 
     * @returns {Iterator<any>} Iterator object that contains the keys for each element in the Map object in insertion order
     */
    keys(): Iterator<any> {
        let keys: Array<any> = [];
        this.forEach((value, key) => {
            keys.push(key);
        });
        return new Iterator(keys);
    }

    /**
     * Sets the value for the key in the Map object. Returns the Map object.
     * 
     * @param {*} key The key of the element to add to the Map object.
     * @param {*} value The value of the element to add to the Map object.
     * @returns {CoreMap} The Map object
     */
    set(key: any, value: any): CoreMap {
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
    values(): Iterator<any> {
        let keys: Array<any> = [];
        this.forEach((value, key) => {
            keys.push(value);
        });
        return new Iterator(keys);
    }

    /**
     * Creates an instance of an empty CoreMap.
     * 
     * @static
     * @returns {CoreMap} Created empty CoreMap
     */
    static create(): CoreMap;
    /**
     * Creates an instance of CoreMap with data provided by an object.
     * The properties of the object will get stored as key/value paired arrays (eg: [key, value]).
     * The key will be the property name
     * The value will be the coresponding property value
     * 
     * @static
     * @param {Object} source The provided source object
     * @returns {CoreMap} Created CoreMap
     */
    static create(source: Object): CoreMap;
    /**
     * Creates an instance of CoreMap out of an array.
     * Every item of the provided array must be an array with two items - a key and a value.
     * 
     * @static
     * @param {Array<[any, any]>} source The provided source array
     * @returns {CoreMap} Created CoreMap
     */
    static create(source: Array<[any, any]>): CoreMap;
    static create(source?: any): CoreMap {
        return new CoreMap(source);
    }
}

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
export class TypedMap<K, V> extends CoreMap {
    /**
     * Creates an instance of an empty TypedMap.
     */
    constructor();
    /**
     * Creates an instance of TypedMap out of an array.
     * Every item of the provided array must be an array with two items - a key and a value.
     * 
     * @param {Array<[K, V]>} source The provided source array
     */
    constructor(source: Array<[K, V]>);
    constructor(source?: any) {
        super(source);
    }

    /**
     * Removes any value associated to the key and returns the value that Map.has(key) would have previously returned.
     * Map.prototype.has(key) will return false afterwards.
     * 
     * @param {K} key The key of the element to remove from the Map object.
     */
    delete(key: K): void {
        super.delete(key);
    }

    /**
     * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
     * 
     * @returns {Iterator<[K, V]>} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
     */
    entries(): Iterator<[K, V]> {
        return super.entries();
    }

    /**
     * Calls callbackFn once for each key-value pair present in the Map object, in insertion order.
     * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
     * 
     * @param {(value: any, key: any, map: TypedMap) => void} callbackFn Function to execute for each element.
     * @param {(Object | Function)} [thisArg] Value to use as this when executing callback.
     */
    forEach(callbackFn: (value: V, key: K, map: TypedMap<K, V>) => any, thisArg?: Object | Function): void {
        super.forEach.apply(this, arguments);
    }
    
    /**
     * Returns the value associated to the key, or undefined if there is none.
     * 
     * @param {K} key The key of the element to return from the Map object.
     * @returns {V} Value associated to the key, or undefined
     */
    get(key: K): V {
        return super.get(key);
    }

    /**
     * Returns a boolean asserting whether a value has been associated to the key in the Map object or not.
     * 
     * @param {*} key The key of the element to test for presence in the Map object.
     * @returns {boolean} Value associated to the key
     */
    has(key: K): boolean {
        return super.has(key);
    }

    /**
     * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
     * 
     * @returns {Iterator<any>} Iterator object that contains the keys for each element in the Map object in insertion order
     */
    keys(): Iterator<K> {
        return super.keys();
    }

    /**
     * Sets the value for the key in the Map object. Returns the Map object.
     * 
     * @param {K} key The key of the element to add to the Map object.
     * @param {V} value The value of the element to add to the Map object.
     * @returns {TypedMap<K,V>} The Map object
     */
    set(key: K, value: V): TypedMap<K,V> {
        return super.set(key, value);
    }

    /**
     * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
     * 
     * @returns {CoreMapIterator} Iterator object that contains the values for each element in the Map object in insertion order
     */
    values(): Iterator<V> {
        return super.values();
    }

    /**
     * Creates an instance of an empty CoreMap.
     * 
     * @static
     * @template K
     * @template V
     * @returns {TypedMap<K,V>} Created empty TypedMap
     */
    static create<K,V>(): TypedMap<K,V>;
    /**
     * Creates an instance of CoreMap out of an array.
     * Every item of the provided array must be an array with two items - a key and a value.
     * 
     * @static
     * @template K
     * @template V
     * @param {Array<[K, V]>} source The provided source array
     * @returns {TypedMap<K,V>} Created TypedMap
     */
    static create<K,V>(source: Array<[K, V]>): TypedMap<K,V>;
    static create<K,V>(source?: any): TypedMap<K,V> {
        return new TypedMap<K, V>(source);
    }
}