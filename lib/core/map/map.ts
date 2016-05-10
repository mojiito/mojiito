import { CoreIterator, IIteratorItem, IIterable } from '../iterator/iterator';
import { assert } from './../../debug/debug';

export class CoreMapIterator extends CoreIterator {

    private _field: number;

    constructor(source: IIterable, field?: number) {
        super(source);
        this._field = field;
    }    

    next(): IIteratorItem {
        let item = super.next();
        if (item.value) {
            if (typeof this._field === 'number') {
                item.value = item.value[this._field];
            }
        }
        return item;
    }
}

export class CoreMap {
    
    private _source: Array<Array<any>> = [];
    
    get size(): number {
        return this._source.length;
    }

    get length(): number {
        return this.size;
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
     * Currently not supported!
     * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
     */
    entries(): CoreIterator {
        return new CoreMapIterator(this._source);
    }

    /**
     * Calls callbackFn once for each key-value pair present in the Map object, in insertion order.
     * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
     * 
     * @param {(value: any, key: any, map: CoreMap) => void} callbackFn Function to execute for each element.
     * @param {(Object | Function)} [thisArg] Value to use as this when executing callback.
     */
    forEach(callbackFn: (value: any, key: any, map: CoreMap) => any, thisArg?: Object | Function): any {
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
                return source[i];
            }
        }
        return undefined;
    }

    /**
     * eturns a boolean asserting whether a value has been associated to the key in the Map object or not.
     * 
     * @param {*} key The key of the element to test for presence in the Map object.
     * @returns {boolean} Value associated to the key
     */
    has(key: any): boolean {
        return !!this.get(key);
    }

    /**
     * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
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
        let source = this._source;
        for (let i = 0, max = source.length >>> 0; i < max; i++) {
            if (key === source[i][0]) {
                source[i][1] = value;
                return this;
            }
        }
        this._source.push([key, value]);
        return this;
    }

    /**
     * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
     */
    values(): CoreMapIterator {
        return new CoreMapIterator(this._source, 1);
    }


    static create(): CoreMap {
        return new CoreMap();
    }
}