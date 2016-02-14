import { assert } from './../../debug/debug';
import { Meta } from '../meta/meta';
import { IObservable, Observer } from '../observer/observer';
import { CoreObject } from '../object/object';

const INSTANCE_CALLBACKS_FIELD = '__mojito_instance_callbacks__';

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
export class CoreArray {

    /**
     * Length of the array
     * 
     * @type {number}
     */
    get length(): number {
        const source = Meta.peek(this).getProperty('values', 'source');
        return source.length >>> 0
    }

    /**
     * Length of the array
     */
    set length(value: number) {
        throw new Error('Setting a length of a CoreArray is not allowed');
    }

    /**
     * Source of the CoreArray
     * 
     * @type {Array<any>}
     */
    get source(): Array<any> {
        this._diff();
        return Meta.peek(this).getProperty('values', 'source');
    }

    /**
     * Source of the CoreArray
     */
    set source(value: Array<any>) {
        throw new Error('Setting the source of a CoreArray is not allowed');
    }

    /**
     * Creates an instance of CoreArray.
     * 
     * @param {Array<any>} [array] Array to create CoreArray from
     */
    constructor(array?: Array<any>) {

        let source: Array<any> = [];
        let self: any = this;

        if (Array.isArray(array)) {
            for (let i = 0, max = array.length; i < max; i++) {
                source.push(array[i]);
                self[i] = source[i];
            }
        }
        
        // extend the CoreObject with a Meta hash
        Meta.peek(this).setProperty('values', 'source', source, {
            writable: false,
            enumerable: true,
            configurable: false
        });
    }


    /**
     * creates a new array consisting of the elements in the object 
     * on which it is called, followed in order by, for each argument, 
     * the elements of that argument (if the argument is an array) 
     * or the argument itself (if the argument is not an array)
     * 
     * @param {...Array<any>[]} values Arrays to concatenate into a new array
     */
    concat(...values: Array<any>[]): CoreArray;
    /**
     * creates a new array consisting of the elements in the object 
     * on which it is called, followed in order by, for each argument, 
     * the elements of that argument (if the argument is an array) 
     * or the argument itself (if the argument is not an array)
     * 
     * @param {...any[]} values Values to concatenate into a new array
     */
    concat(...values: any[]): CoreArray;
    concat(...values: any[]): CoreArray {
        this._diff();
        const result: Array<any> = this.source.concat.apply(this.source, arguments);
        return new CoreArray(result);
    }

    elementAt(index: number): any  {
        this._diff();
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
    every(callback: (value: any, index: number, array: any[]) => boolean, thisArg?: any): boolean {
        this._diff();
        return this.source.every.apply(this.source, arguments);
    }

    /**
     * Creates a new array with all elements that pass the test 
     * implemented by the provided function.
     * 
     * @param {Function} callback Function to test each element of the CoreArray
     * @param {*} [thisArg] Value to use as this when executing callback
     * @returns {CoreArray} New CoreArray with all elements that pass
     */
    filter(callback: (value: any, index: number, array: any[]) => boolean, thisArg?: any): CoreArray {
        this._diff();
        const result: Array<any> = this.source.filter.apply(this.source, arguments);
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
    filterBy(key: string, value?: string, thisArg?: any): CoreArray {
        this._diff();
        return this.filter(function(elementValue: any) {
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
    find(predicate: (element: any, index: number, array: any[]) => boolean, thisArg?: any): any {
        this._diff();
        const source: any = this.source;
        const fn = source['find'];
        if (typeof fn === 'function') {
            return fn.apply(source, arguments);
        } else {
            let value: any;
            for (var i = 0, max = source.length >>> 0; i < max; i++) {
                value = source[i];
                if (predicate.call(thisArg, value, i, this)) {
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
    findBy(propertyName: string, value: any): any {
        this._diff();
        const source: any = this.source;
        const fn = source['find'];
        let obj: any;
        for (var i = 0, max = source.length >>> 0; i < max; i++) {
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
    findIndex(predicate: (element: any, index: number, array: any[]) => boolean, thisArg?: any): number {
        this._diff();
        const source: any = this.source;
        const fn = source['findIndex'];
        if (typeof fn === 'function') {
            return fn.apply(source, arguments);
        } else {
            let value: any;
            for (var i = 0, max = source.length >>> 0; i < max; i++) {
                value = source[i];
                if (predicate.call(thisArg, value, i, this)) {
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
    forEach(callback: (currentValue: any, index: number, array: any[]) => void, thisArg?: any): void {
        this._diff();
        const source: any = this.source;
        const fn = source['forEach'];
        if (typeof fn === 'function') {
            return fn.apply(source, arguments);
        } else {
            for (var i = 0, max = source.length >>> 0; i < max; i++) {
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
    includes(searchElement: any, fromIndex?: number): boolean {
        this._diff();
        const source: any = this.source;
        const fn = source['includes'];
        if (typeof fn === 'function') {
            return fn.apply(this.source, arguments);
        } else {
            for (var i = fromIndex >>> 0, max = source.length >>> 0; i < max; i++) {
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
    indexOf(searchElement: any, fromIndex?: number): number {
        this._diff();
        return this.source.indexOf.apply(this.source, arguments);
    }

    /**
     * Joins all elements of an array into a string.
     * 
     * @param {string} [separator] Specifies a string to separate each element of the array.
     * @returns {string} String of the joined elements
     */
    join(separator?: string): string {
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
    lastIndexOf(searchElement: any, fromIndex?: number): number {
        this._diff();
        return this.source.lastIndexOf.apply(this.source, arguments);
    }

    /**
     * Creates a new array with the results of calling a provided function on every element in this array.
     * 
     * @param {Function} callback Function that produces an element of the new Array
     * @param {*} [thisArg] Value to use as this when executing callback.
     * @returns {CoreArray} Created array
     */
    map(callback: (currentValue: any, index: number, array: any[]) => any, thisArg?: any): CoreArray {
        this._diff();
        const result: Array<any> = this.source.concat.apply(this.source, arguments);
        return new CoreArray(result);
    }

    /**
     * Removes the last element from an array and returns that element.
     * 
     * @returns {*} Removed element
     */
    pop(): any {
        this._diff();
        return this.source.pop.apply(this.source, arguments);
    }

    /**
     * adds one element to the end of an array and returns the new length of the array.
     * 
     * @param {*} element The element to add to the end of the array.
     */
    push(element: any): number;
    /**
     * adds elements to the end of an array and returns the new length of the array.
     * 
     * @param {...any[]} elements The elements to add to the end of the array.
     */
    push(...elements: any[]): number;
    push(...elements: any[]): number {
        this._diff();
        return this.source.push.apply(this.source, arguments);
    }

    /**
     * Applies a function against an accumulator and each value 
     * of the array (from left-to-right) to reduce it to a single value.
     * 
     * @param {Function} callback Function to execute on each value in the array.
     * @param {*} initialValue Value to use as the first argument to the first call of the callback.
     * @returns {*} The value returned would be that of the last callback invocation.
     */
    reduce(callback: (previousValue: any, currentValue: any, currentIndex: any, array: any[]) => any, initialValue: any): any {
        this._diff();
        return this.source.reduce.apply(this.source, arguments);
    }

    /**
     * Applies a function against an accumulator and each value 
     * of the array (from right-to-left) has to reduce it to a single value.
     * 
     * @param {Function} callback Function to execute on each value in the array.
     * @param {*} initialValue Object to use as the first argument to the first call of the callback.
     * @returns {*} The value returned would be that of the last callback invocation.
     */
    reduceRight(callback: (previousValue: any, currentValue: any, currentIndex: any, array: any[]) => any, initialValue: any): any {
        this._diff();
        return this.source.reduceRight.apply(this.source, arguments);
    }

    /**
     * Reverses an array in place. 
     * The first array element becomes the last and the last becomes the first.
     * 
     * @returns {CoreArray} The reversed array
     */
    reverse(): CoreArray {
        this._diff();
        return this.source.reverse.apply(this.source, arguments);
    }

    /**
     * Removes the first element from an array and returns that element. 
     * This method changes the length of the array.
     * 
     * @returns {*} The first element of the array
     */
    shift(): any {
        this._diff();
        return this.source.shift.apply(this.source, arguments);
    }

    /**
     * Returns a shallow copy of a portion of an array into a new array object.
     * 
     * @param {number} [begin] Zero-based index at which to begin extraction.
     * @param {number} [end] Zero-based index at which to end extraction.
     * @returns {CoreArray} New sliced array
     */
    slice(begin?: number, end?: number): CoreArray {
        this._diff();
        const result: Array<any> = this.source.slice.apply(this.source, arguments);
        return new CoreArray(result);
    }

    /**
     * Tests whether some element in the array passes the test 
     * implemented by the provided function.
     * 
     * @param {Function} callback Function to test for each element.
     * @param {*} [thisArg] Value to use as this when executing callback.
     */
    some(callback: (currentValue: any, index: number, array: any[]) => boolean, thisArg?: any): boolean {
        this._diff();
        return this.source.some.apply(this.source, arguments);
    }

    /**
     * Sorts the elements of an array in place and returns the array. 
     * The default sort order is according to string Unicode code points.
     * 
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * @returns {CoreArray} Returns the sorted CoreArray
     */
    sort(compareFunction?: (valueA: any, valueB: any) => number): CoreArray {
        this._diff();
        this.source.sort.apply(this.source, arguments);
        return this;
    }

    /**
     * Changes the content of an array by removing existing elements.
     * 
     * @param {number} start Index at which to start changing the array.
     * @param {number} deleteCount An integer indicating the number of old array elements to remove.
     */
    splice(start: number, deleteCount: number): CoreArray;
    /**
     * Changes the content of an array by removing existing elements and/or adding new elements.
     * 
     * @param {number} start Index at which to start changing the array.
     * @param {number} deleteCount An integer indicating the number of old array elements to remove.
     * @param {...any[]} elements The elements to add to the array, beginning at the start index.
     */
    splice(start: number, deleteCount: number, ...elements: any[]): CoreArray;
    splice(start: number, deleteCount: number, ...elements: any[]): CoreArray {
        this._diff();
        const result: Array<any> = this.source.splice.apply(this.source, arguments);
        return new CoreArray(result);
    }

    /**
     * Converts the CoreArray to a native Array
     * 
     * @returns {Array<any>} The converted native Array
     */
    toArray(): Array<any> {
        this._diff();
        return this.source;
    }

    /**
     * Adds one element to the beginning of an array and returns the new length of the array.
     * 
     * @param {*} element The element to add to the front of the array.
     * @return {number} The new length of the array.
     */
    unshift(element: any): number;
    /**
     * Adds elements to the beginning of an array and returns the new length of the array.
     * 
     * @param {...any[]} elements The elements to add to the front of the array.
     * @return {number} The new length of the array.
     */
    unshift(...elements: any[]): number;
    unshift(...elements: any[]): number {
        this._diff();
        return this.source.unshift.apply(this.source, arguments);
    }
    
    /**
     * Static method to provide functionality for `CoreArray.create()`
     * 
     * @static
     * @param {Array<any>} [array] Elements to insert initially
     * @returns {CoreArray} Newly created CoreArray
     */
    static create(array?: Array<any>): CoreArray {
        assert(Array.isArray(array) || typeof array === 'undefined', 'The Array provided to the create method must be an array', TypeError);
        return new CoreArray(array);
    }
    
    /**
     * Adds an instance callback to class.
     * Only for internal usage. Mostly needed for decorators.
     * 
     * @static
     * @param {CoreObject} sourceObject The object where to add a callback
     * @param {Function} callback The callback which will be added
     */
    static _addInstanceCallback(sourceObject: CoreObject, callback: Function): void {
        assert(arguments.length === 2, '_addInstanceCallback must be called with two arguments; a sourceObject and a callback function');
        assert(typeof sourceObject === 'object', 'The sourceObject provided to the _addInstanceCallback method must be an object', TypeError);
        assert(typeof callback === 'function', 'The callback provided to the _addInstanceCallback method must be a function', TypeError);
        
        // needed for enabled noImplicitAny
        const source: any = sourceObject;
        let callbacks: Function[] = source[INSTANCE_CALLBACKS_FIELD];
        if (!Array.isArray(callbacks)) {
            callbacks = [];
            Object.defineProperty(source, INSTANCE_CALLBACKS_FIELD, {
                writable: true,
                enumerable: true,
                configurable: false,
                value: callbacks
            });
        }
        callbacks.push(callback);
    }
    
    /**
     * Calls every instance callback on a class.
     * Only for internal usage. Mostly needed for decorators.
     * 
     * @static
     * @param {CoreObject} sourceObject The object where to call all the callbacks
     */
    static _applyInstanceCallbacks(sourceObject: CoreObject): void {
        assert(arguments.length === 1, '_applyInstanceCallbacks must be called with one argument; a sourceObject');
        assert(sourceObject instanceof CoreObject, 'The sourceObject provided to the _applyInstanceCallbacks method must be a CoreObject', TypeError);
        
        // needed for enabled noImplicitAny
        const source: any = sourceObject;
        let callbacks: Function[] = source[INSTANCE_CALLBACKS_FIELD];
        if (Array.isArray(callbacks)) {
            //delete Object.getPrototypeOf(this)['_callbacks'];
            callbacks.forEach(function(callback: Function) {
                callback(source);
            });
        }
    }
    
    /**
     * ATTENTION: Do not call directly
     * Does a diff between the CoreArray instance and the source array.
     * Overrides source array elements with instance elements if they differ.
     * Basically enabless []-accessor for this array proxy.
     * 
     * @private
     * @returns {void} (description)
     */
    private _diff(): void {
        const source: any = Meta.peek(this).getProperty('values', 'source');
        const sourceLength = source.length >>> 0;
        let keys = Object.getOwnPropertyNames(this).filter(function(value: string) {
            return !!parseInt(value, 10)
        });
        if (keys.length === sourceLength) {
            return;
        }
        for (var i = 0, max = keys.length; i < max; i++) {
            let index = parseInt(keys[i], 10);
            let sourceElement = source[index];
            let element = sourceElement;
            if (element !== sourceElement) {
                sourceElement = element;
            }
        }
    }
}