import { assert } from './../../debug/debug';
import { Meta } from '../meta/meta';
import { IObservable, Observer } from '../observer/observer';
import { CoreObject } from '../object/object';

const INSTANCE_CALLBACKS_FIELD = '__mojito_instance_callbacks__';

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
        return Meta.peek(this).getProperty('values', 'source');
    }

    /**
     * Source of the CoreArray
     */
    set source(value: Array<any>) {
        assert(!this.source, 'Redefining the source of a CoreArray is not allowed');
        Meta.peek(this).setProperty('values', 'source', value);
        CoreArray.defineElements(this, value);
    }

    /**
     * Creates an instance of CoreArray.
     * 
     * @param {Array<any>} [array] Array to create CoreArray from
     */
    constructor(array?: Array<any>) {
        // extend the CoreObject with a Meta hash
        Meta.extend(this);

        // needed for enabled noImplicitAny
        const instance: any = this;
        instance['source'] = Array.isArray(array) ? array : [];
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
        const result: Array<any> = this.source.concat.apply(this.source, arguments);
        return new CoreArray(result);
    }

    /**
     * Tests whether all elements in the array pass the test 
     * implemented by the provided function.
     * 
     * @param {Function} callback Function to test for each element.
     * @param {*} [thisArg] Value to use as this when executing callback.
     * @returns {boolean} true if every element passes the test, false if not
     */
    every(callback: Function, thisArg?: any): boolean {
        return this.source.every.apply(this.source, arguments);
    }

    filter(callback: Function, thisArg?: any): CoreArray {
        const result: Array<any> = this.source.filter.apply(this.source, arguments);
        return new CoreArray(result);
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
    find(predicate: Function, thisArg?: any): any {
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
    findIndex(predicate: Function, thisArg?: any): number {
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
    forEach(callback: Function, thisArg?: any): void {
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
     * @returns {number} position of the found element, -1 if not found
     */
    indexOf(searchElement: any, fromIndex?: number): number {
        return this.source.indexOf.apply(this.source, arguments);
    }

    /**
     * Joins all elements of an array into a string.
     * 
     * @param {string} [separator] Specifies a string to separate each element of the array.
     * @returns {string} string of the joined elements
     */
    join(separator?: string): string {
        return this.source.join.apply(this.source, arguments);
    }

    keys() { }

    lastIndexOf() { }

    map() { }

    pop() { }

    push() { }

    reduce() { }

    reduceRight() { }

    reverse() { }

    shift() { }

    slice() { }

    some() { }

    sort() { }

    splice() { }

    toLocaleString() { }

    toSource() { }

    unshift() { }

    values() { }

    static defineElements(sourceArray: CoreArray, elementsArray?: Array<any>): CoreArray {

        if (elementsArray) {
            CoreArray.defineElements(sourceArray);
        }

        const elements: any = !!elementsArray ? elementsArray : sourceArray;
        
        // replace every property with a defined one
        for (var key in elements) {
            let value = elements[key];

            if (isNaN(parseInt(key))) {
                continue;
            }

            // defining Meta not allowed, skip it            
            if (elements[key] instanceof Meta) {
                continue;
            }
            
            // skip instance callbacks          
            if (key === INSTANCE_CALLBACKS_FIELD) {
                continue;
            }

            CoreArray.defineElement(sourceArray, key, value);
        }

        return sourceArray;
    }

    static isDefinedElement(sourceArray: CoreArray, index: number): boolean {
        // needed for enabled noImplicitAny
        const source: any = sourceArray;
        return typeof index === 'number' && Meta.peek(sourceArray).getProperty('values', 'source')[index] === source[index];
    }

    static defineElement(sourceArray: CoreArray, index: number, value: any): CoreArray {
        if (!CoreArray.isDefinedElement(sourceArray, index)) {
            ((sourceArray: CoreArray, index: number) => {
                Object.defineProperty(sourceArray, index + '', {
                    configurable: false,
                    get(): number {
                        return Meta.peek(sourceArray).getProperty('values', 'source')[index];
                    },

                    set(newValue: any) {
                        Meta.peek(sourceArray).getProperty('values', 'source')[index] = newValue;
                    }
                });
            })(sourceArray, index);
        }

        return sourceArray;
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

}