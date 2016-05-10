import { CoreIterator, IIteratorItem, IIterable } from '../iterator/iterator';
import { assert } from './../../debug/debug';

/**
 * Iterator for the methods of the CoreMap that return iterators (e.g. CoreMap.entries, CoreMap.keys and CoreMap.values)
 * 
 * @export
 * @class CoreMapIterator
 * @extends {CoreIterator<any>}
 */
export class CoreMapIterator extends CoreIterator<any> {

    /**
     * Store if the value of the iterator item should be:
     * undefined: [key, value]
     * 0: key
     * 1: value
     * 
     * @private
     * @type {number}
     */
    private _field: number;

    /**
     * Creates an instance of CoreMapIterator.
     * 
     * @param {IIterable<any>} source Iterable object
     * @param {number} [field] Set to 0 or 1 to modify the value of the iterator item
     */
    constructor(source: IIterable<any>, field?: number) {
        super(source);
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
    next(): IIteratorItem<any> {
        let item = super.next();
        if (item.value) {
            if (typeof this._field === 'number') {
                item.value = item.value[this._field];
            }
        }
        return item;
    }
}

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
     * @type {IIterable<any>}
     */
    private _source: IIterable<any> = [];

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
     * 
     * @readonly
     * @type {number}
     */
    get length(): number {
        !!console && !!console.warn && (console.warn("Don't use length property on CoreMaps!!"));
        return 0;
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
        let source = <Array<any>>this._source;
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
     * @returns {CoreMapIterator} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
     */
    entries(): CoreMapIterator {
        return new CoreMapIterator(this._source);
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
     * @returns {CoreMapIterator} Iterator object that contains the keys for each element in the Map object in insertion order
     */
    keys(): CoreMapIterator {
        return new CoreMapIterator(this._source, 0);
    }

    /**
     * Sets the value for the key in the Map object. Returns the Map object.
     * 
     * @param {*} key The key of the element to add to the Map object.
     * @param {*} value The value of the element to add to the Map object.
     * @returns {CoreMap} The Map object
     */
    set(key: any, value: any): CoreMap {
        let source = <Array<any>>this._source;
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
    values(): CoreMapIterator {
        return new CoreMapIterator(this._source, 1);
    }


    /**
     * (description)
     * 
     * @static
     * @returns {CoreMap} (description)
     */
    static create(): CoreMap {
        return new CoreMap();
    }
}