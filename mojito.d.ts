declare module "debug/assert/assert" {
    /**
     * Writes an error message to the console if the assertion is false.
     * If the assertion is true, nothing happens.
     *
     * @param  {boolean} assertion
     * @param  {string} message
     * @returns void
     */
    export function assert(assertion: boolean, message: string, ErrorType?: ErrorConstructor): void;
}
declare module "debug/logger/logger" {
    /**
     * Specifies the different log levels for the logger.
     * From low to high level, these are:
     * - info
     * - debug
     * - error
     * - critical
     * - none
     *
     * @export
     * @enum {number}
     */
    export enum LogLevel {
        /**
         * Logs all levels
         */
        info = 0,
        /**
         * Logs debug, error and critical levels
         */
        debug = 1,
        /**
         * Only logs error and critical levels
         */
        error = 2,
        /**
         * Only logs critical levels
         */
        critical = 3,
        /**
         * Logs nothing
         */
        none = 4,
    }
    /**
     * Specifies the type of the log message (equal to the console log functions)
     *
     * @export
     * @enum {number}
     */
    export enum LogType {
        /**
         * Like console.log
         */
        log = 0,
        /**
         * Like console.info
         */
        info = 1,
        /**
         * Like console.debug
         */
        debug = 2,
        /**
         * Like console.warn
         */
        warn = 3,
        /**
         * Like console.error
         */
        error = 4,
    }
    /**
     * Handles logging, checks if log levels match, allowes global loggin
     * or creating a logger instance for specific case.
     *
     * @export
     * @class Logger
     */
    export class Logger {
        static globalLevel: LogLevel;
        static globalLoggerInstance: Logger;
        private privatelevel;
        /**
         * Creates an instance of Logger with a specific private {@link LogLevel}.
         *
         * @param {LogLevel} level Specified LogLevel
         */
        constructor(level: LogLevel);
        /**
         * Logs a message string to the console,
         * taking care of private log levels and log types.
         *
         * @param {LogLevel} level The {@link LogLevel} of the message
         * @param {string} message The message as a string
         * @param {LogType} [type] The {@link LogType} of  the message
         */
        log(level: LogLevel, message: string, type?: LogType): void;
        /**
         * Logs a string returned by a message function to the console,
         * taking care of private log levels and log types.
         *
         * @param {LogLevel} level The {@link LogLevel} of the message
         * @param {() => string} message The message as a function which has to return a string
         * @param {LogType} [type] The {@link LogType} of  the message
         */
        log(level: LogLevel, message: () => string, type?: LogType): void;
        /**
         * Global log function.
         * Logs a message string to the console,
         * taking care of global log levels and log types.
         *
         * @static
         * @param {LogLevel} level The {@link LogLevel} of the message
         * @param {string} message The message as a string
         * @param {LogType} [type] The {@link LogType} of  the message
         */
        static log(level: LogLevel, message: string, type?: LogType): void;
        /**
         * Global log function.
         * Logs a string returned by a message function to the console,
         * taking care of global log levels and log types.
         *
         * @static
         * @param {LogLevel} level The {@link LogLevel} of the message
         * @param {() => string} message The message as a function which has to return a string
         * @param {LogType} [type] The {@link LogType} of  the message
         */
        static log(level: LogLevel, message: () => string, type?: LogType): void;
        /**
         * Sets the global {@link LogLevel}
         *
         * @static
         * @param {LogLevel} level The {@link LogLevel} which will be set.
         */
        static setGlobalLevel(level: LogLevel): void;
    }
}
declare module "debug/debug" {
    export { assert } from "debug/assert/assert";
    export { Logger, LogLevel, LogType } from "debug/logger/logger";
}
declare module "core/get/get" {
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
    export function get(obj: Object, propertyName: string): any;
}
declare module "core/array/array" {
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
    export class CoreArray {
        /**
         * Length of the array
         *
         * @type {number}
         */
        /**
         * Length of the array
         */
        length: number;
        /**
         * Source of the CoreArray
         *
         * @type {Array<any>}
         */
        /**
         * Source of the CoreArray
         */
        source: Array<any>;
        /**
         * Creates an instance of CoreArray.
         *
         * @param {Array<any>} [array] Array to create CoreArray from
         */
        constructor(array?: Array<any>);
        /**
         * creates a new array consisting of the elements in the object
         * on which it is called, followed in order by, for each argument,
         * the elements of that argument (if the argument is an array)
         * or the argument itself (if the argument is not an array)
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat}
         *
         * @param {...Array<any>[]} values Arrays to concatenate into a new array
         * @returns {CoreArray} new array consisting of the elements in the object on which it is called
         */
        concat(...values: Array<any>[]): CoreArray;
        /**
         * Creates a new array consisting of the elements in the object
         * on which it is called, followed in order by, for each argument,
         * the elements of that argument (if the argument is an array)
         * or the argument itself (if the argument is not an array)
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat}
         *
         * @param {...any[]} values Values to concatenate into a new array
         * @returns {CoreArray} new array consisting of the elements in the object on which it is called
         */
        concat(...values: any[]): CoreArray;
        /**
         * Returns the element at a specific position.
         *
         * @param {number} index Position of the element
         * @returns {*} The found element
         */
        elementAt(index: number): any;
        /**
         * Tests whether all elements in the array pass the test
         * implemented by the provided function.
         *
         * @param {Function} callback Function to test for each element.
         * @param {*} [thisArg] Value to use as this when executing callback.
         * @returns {boolean} true if every element passes the test, false if not
         */
        every(callback: (value: any, index: number, array: CoreArray) => boolean, thisArg?: any): boolean;
        /**
         * Creates a new array with all elements that pass the test
         * implemented by the provided function.
         *
         * @param {Function} callback Function to test each element of the CoreArray
         * @param {*} [thisArg] Value to use as this when executing callback
         * @returns {CoreArray} New CoreArray with all elements that pass
         */
        filter(callback: (value: any, index: number, array: any[]) => boolean, thisArg?: any): CoreArray;
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
        filterBy(key: string, value?: string, thisArg?: any): CoreArray;
        /**
         * Returns a value in the array, if an element in the array
         * satisfies the provided testing function.
         * Otherwise `undefined` is returned.
         *
         * @param {Function} predicate Function to execute on each value in the array.
         * @param {*} [thisArg] Object to use as this when executing callback.
         * @returns {*} value of the found element or `undefined`
         */
        find(predicate: (element: any, index: number, array: any[]) => boolean, thisArg?: any): any;
        /**
         * Returns a object in the array, if the property of the
         * object is equal to the provided value
         *
         * @param {string} propertyName name of the property to look for
         * @param {*} value value of the property in the object to check for
         * @returns {*} found object or `undefined`
         */
        findBy(propertyName: string, value: any): any;
        /**
         * returns an index in the array, if an element in the array
         * satisfies the provided testing function.
         * Otherwise -1 is returned
         *
         * @param {Function} predicate Function to execute on each value in the array
         * @param {*} [thisArg] Object to use as this when executing callback.
         * @returns {number} index of the found element or -1
         */
        findIndex(predicate: (element: any, index: number, array: any[]) => boolean, thisArg?: any): number;
        /**
         * Executes a provided function once per array element.
         *
         * @param {Function} callback Function to execute for each element.
         * @param {*} [thisArg] Value to use as this when executing callback.
         * @returns {void}
         */
        forEach(callback: (currentValue: any, index: number, array: any[]) => void, thisArg?: any): void;
        /**
         * Determines whether an array includes a certain element, returning true or false as appropriate.
         *
         * @param {*} searchElement The element to search for.
         * @param {number} [fromIndex] The position in this array at which to begin searching for searchElement.
         * @returns {boolean} true if searchElement is found, false if not
         */
        includes(searchElement: any, fromIndex?: number): boolean;
        /**
         * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
         *
         * @param {*} searchElement Element to locate in the array.
         * @param {number} [fromIndex] The index to start the search at.
         * @returns {number} Position of the found element, -1 if not found
         */
        indexOf(searchElement: any, fromIndex?: number): number;
        /**
         * Joins all elements of an array into a string.
         *
         * @param {string} [separator] Specifies a string to separate each element of the array.
         * @returns {string} String of the joined elements
         */
        join(separator?: string): string;
        /**
         * returns the last index at which a given element can be
         * found in the array, or -1 if it is not present.
         * The array is searched backwards, starting at fromIndex.
         *
         * @param {*} searchElement Element to locate in the array.
         * @param {number} [fromIndex] The index at which to start searching backwards.
         * @returns {number} Position of the found element, -1 if not found
         */
        lastIndexOf(searchElement: any, fromIndex?: number): number;
        /**
         * Creates a new array with the results of calling a provided function on every element in this array.
         *
         * @param {Function} callback Function that produces an element of the new Array
         * @param {*} [thisArg] Value to use as this when executing callback.
         * @returns {CoreArray} Created array
         */
        map(callback: (currentValue: any, index: number, array: any[]) => any, thisArg?: any): CoreArray;
        /**
         * Removes the last element from an array and returns that element.
         *
         * @returns {*} Removed element
         */
        pop(): any;
        /**
         * adds one element to the end of an array and returns the new length of the array.
         *
         * @param {*} element The element to add to the end of the array.
         * @return {number} The new length property of the array.
         */
        push(element: any): number;
        /**
         * adds elements to the end of an array and returns the new length of the array.
         *
         * @param {...any[]} elements The elements to add to the end of the array.
         * @return {number} The new length property of the array.
         */
        push(...elements: any[]): number;
        /**
         * Applies a function against an accumulator and each value
         * of the array (from left-to-right) to reduce it to a single value.
         *
         * @param {Function} callback Function to execute on each value in the array.
         * @param {*} initialValue Value to use as the first argument to the first call of the callback.
         * @returns {*} The value returned would be that of the last callback invocation.
         */
        reduce(callback: (previousValue: any, currentValue: any, currentIndex: any, array: any[]) => any, initialValue: any): any;
        /**
         * Applies a function against an accumulator and each value
         * of the array (from right-to-left) has to reduce it to a single value.
         *
         * @param {Function} callback Function to execute on each value in the array.
         * @param {*} initialValue Object to use as the first argument to the first call of the callback.
         * @returns {*} The value returned would be that of the last callback invocation.
         */
        reduceRight(callback: (previousValue: any, currentValue: any, currentIndex: any, array: any[]) => any, initialValue: any): any;
        /**
         * Reverses an array in place.
         * The first array element becomes the last and the last becomes the first.
         *
         * @returns {CoreArray} The reversed array
         */
        reverse(): CoreArray;
        /**
         * Removes the first element from an array and returns that element.
         * This method changes the length of the array.
         *
         * @returns {*} The first element of the array
         */
        shift(): any;
        /**
         * Returns a shallow copy of a portion of an array into a new array object.
         *
         * @param {number} [begin] Zero-based index at which to begin extraction.
         * @param {number} [end] Zero-based index at which to end extraction.
         * @returns {CoreArray} New sliced array
         */
        slice(begin?: number, end?: number): CoreArray;
        /**
         * Tests whether some element in the array passes the test
         * implemented by the provided function.
         *
         * @param {Function} callback Function to test for each element.
         * @param {*} [thisArg] Value to use as this when executing callback.
         */
        some(callback: (currentValue: any, index: number, array: any[]) => boolean, thisArg?: any): boolean;
        /**
         * Sorts the elements of an array in place and returns the array.
         * The default sort order is according to string Unicode code points.
         *
         * @param {Function} [compareFunction] Specifies a function that defines the sort order.
         * @returns {CoreArray} Returns the sorted CoreArray
         */
        sort(compareFunction?: (valueA: any, valueB: any) => number): CoreArray;
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
        /**
         * Converts the CoreArray to a native Array
         *
         * @returns {Array<any>} The converted native Array
         */
        toArray(): Array<any>;
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
        /**
         * Static method to provide functionality for `CoreArray.create()`
         *
         * @static
         * @param {Array<any>} [array] Elements to insert initially
         * @returns {CoreArray} Newly created CoreArray
         */
        static create(array?: Array<any>): CoreArray;
    }
}
declare module "core/meta/meta" {
    import { CoreObject } from "core/object/object";
    import { CoreArray } from "core/array/array";
    /**
     * The meta object contains information about computed property descriptors,
     * values of defined properties as well as any watched properties and other information.
     *
     * @export
     * @class Meta
     */
    export class Meta {
        private static META_FIELD;
        /**
         * Creates the member on a meta hash
         *
         * @param  {string} memberKey The name(key) of the member to be created
         * @returns {Object} The created member object
         */
        createMember(memberKey: string): Object;
        /**
         * Checks if the member is already there, otherwise
         * it will create it. The member gets returned.
         *
         * @param  {string} memberKey The name(key) of the member to be peeked
         * @returns {Object} The peeked member object
         */
        peekMember(memberKey: string): Object;
        /**
         * Returns the member of the meta hash
         * or `undefined` it does not exist
         *
         * @param  {string} memberKey The name(key) of the member to be returned
         * @returns {Object} The member object or `undefined`
         */
        getMember(memberKey: string): Object;
        /**
         * Checks if the meta hash has a specific member
         *
         * @param  {string} memberKey The name(key) of the member to be checked
         * @returns {boolean} true if member exists, false if not
         */
        hasMember(memberKey: string): boolean;
        /**
         * Deletes all the properties of a member in the meta hash.
         *
         * @param  {string} memberKey The name(key) of the member to be cleared
         * @returns {boolean} true if clear was successful, false if not
         */
        clearMember(memberKey: string): boolean;
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
        setProperty(memberKey: string, propertyKey: string, value: any, descriptor?: PropertyDescriptor): any;
        setProperties(memberKey: string, propertyMap: Object, descriptor?: PropertyDescriptor): void;
        /**
         * Returns the property of a member in the meta hash
         * or `undefined` if the property or the member do not exist.
         *
         * @param  {string} memberKey The name(key) of the member where to look for the property
         * @param  {string} propertyKey The name(key) of the requeste property
         * @returns {*} The requested property
         */
        getProperty(memberKey: string, propertyKey: string): any;
        /**
         * Checks if the member of the meta hash has a specific property
         *
         * @param  {string} memberKey The name(key) of the member where to look for the property
         * @param  {string} propertyKey The name(key) of the property to be checked
         * @returns {boolean} true if the property was found, false if not
         */
        hasProperty(memberKey: string, propertyKey: string): boolean;
        /**
         * Deletes a property of a member in the meta hash
         *
         * @param  {string} memberKey The name(key) of the member where to delete the property
         * @param  {string} propertyKey The name(key) of the property to be deleted
         * @returns {boolean} true if deletion was successful, false if not
         */
        deleteProperty(memberKey: string, propertyKey: string): boolean;
        /**
         * Creates a new Meta instance and extends a CoreObject with it.
         *
         * @static
         * @param  {CoreObject} obj The CoreObject where the meta will be created on
         * @returns {Meta} The created meta object
         */
        static extend(obj: CoreObject): Meta;
        /**
         * Creates a new Meta instance and extends a CoreArray with it.
         *
         * @static
         * @param  {CoreArray} array The CoreArray where the meta will be created on
         * @returns {Meta} The created meta object
         */
        static extend(array: CoreArray): Meta;
        /**
         * Creates a new Meta instance and extends an Object with it.
         *
         * @static
         * @param {Object} obj The Object where the meta will be created on
         * @returns {Meta} The created meta object
         */
        static extend(obj: Object): Meta;
        /**
         * Retrieves the meta hash for a CoreObject.
         * If the object has no meta yet, a new one will be created
         *
         * @static
         * @param  {CoreObject} obj The CoreObject where to peek for a meta hash
         * @returns {Meta} The peeked or created meta object
         */
        static peek(obj: CoreObject): Meta;
        /**
         * Retrieves the meta hash for a CoreArray.
         * If the object has no meta yet, a new one will be created
         *
         * @static
         * @param  {CoreArray} obj The CoreArray where to peek for a meta hash
         * @returns {Meta} The peeked or created meta object
         */
        static peek(array: CoreArray): Meta;
        /**
         * Retrieves the meta hash for an array.
         * If the array has no meta yet, a new one will be created
         *
         * @static
         * @param {Object} array The Array where to peek for a meta hash
         * @returns {Meta} The peeked or created meta object
         */
        static peek(obj: Object): Meta;
        /**
         * Retrieves the meta hash for an array.
         * If the array has no meta yet, a new one will be created
         *
         * @static
         * @param {Array<any>} array The Array where to peek for a meta hash
         * @returns {Meta} The peeked or created meta object
         */
        static peek(array: Array<any>): Meta;
    }
}
declare module "core/iterator/iterator" {
    export interface IIteratorItem<T> {
        value?: T;
        done: boolean;
    }
    export interface IIterator<T> {
        next(): IIteratorItem<T>;
    }
    export interface IIterable<T> {
        [index: number]: T;
        length: number;
    }
    export interface IIterableObject {
        [key: string]: any;
    }
    export class Iterator<T> implements IIterator<T> {
        protected _nextIndex: number;
        protected _source: IIterable<T>;
        constructor(source: IIterable<T>);
        next(): IIteratorItem<T>;
    }
}
declare module "core/watch/watch" {
    export function watchKey(obj: Object, key: string): void;
    export function watchKey(obj: Array<any>, key: string): void;
    export function watchPath(obj: Object, path: string): void;
    export function watchPath(obj: Array<any>, path: string): void;
}
declare module "core/observable/observe" {
    import { Observer } from "core/observable/observer";
    export function observe(obj: Object, key: string, callback?: Function, thisArg?: any): Observer;
    export function observe(obj: Object, path: string, callback?: Function, thisArg?: any): Observer;
    export function observe(array: Array<any>, key: string, callback?: Function, thisArg?: any): Observer;
    export function observe(array: Array<any>, path: string, callback?: Function, thisArg?: any): Observer;
    export function observe(fn: Function, key: string, callback?: Function, thisArg?: any): Observer;
    export function observe(fn: Function, path: string, callback?: Function, thisArg?: any): Observer;
}
declare module "core/observable/observable" {
    import { Observer } from "core/observable/observer";
    export interface IObservable {
        observe(key: string, callback?: Function): Observer;
        observe(path: string, callback?: Function): Observer;
        observe(keys: Array<string>, callback?: Function): Array<Observer>;
        observe(paths: Array<string>, callback?: Function): Array<Observer>;
        unobserve(): void;
    }
}
declare module "core/observable/observableObject" {
    import { CoreObject } from "core/object/object";
    import { IObservable } from "core/observable/observable";
    import { Observer } from "core/observable/observer";
    export class ObservableObject extends CoreObject implements IObservable {
        constructor(obj?: Object);
        observe(key: string, callback?: Function): Observer;
        observe(path: string, callback?: Function): Observer;
        observe(keys: Array<string>, callback?: Function): Array<Observer>;
        observe(paths: Array<string>, callback?: Function): Array<Observer>;
        unobserve(): void;
        static create(obj?: Object): any;
    }
}
declare module "core/observable/observer" {
    export interface IObserver {
        new (): IObserver;
        new (callback?: Function): IObserver;
        subscribe(callback: Function): void;
        unsubscribe(): void;
        notify(thisArg?: any): void;
    }
    export class Observer {
        private _callbacks;
        constructor(callback?: Function, thisArg?: any);
        subscribe(callback: Function, thisArg?: any): void;
        unsubscribe(): void;
        notify(thisArg?: any): void;
    }
    export function notifyObservers(obj: Object, key: string): void;
    export function notifyObservers(array: Array<any>, key: string): void;
}
declare module "core/properties/propertyEvents" {
    export function propertyWillChange(obj: Object, key: string, newValue: any, oldValue?: any): void;
    export function propertyWillChange(array: Array<any>, key: string, newValue: any, oldValue?: any): void;
    export function propertyDidChange(obj: Object, key: string, newValue: any, oldValue?: any): void;
    export function propertyDidChange(obj: Array<any>, key: string, newValue: any, oldValue?: any): void;
}
declare module "core/properties/mandatory_set" {
    export function mandatory_set(obj: Object, propertyName: string, value: any): void;
    export function mandatory_set(obj: Array<any>, propertyName: string, value: any): void;
}
declare module "core/properties/properties" {
    /**
     * (description)
     *
     * @export
     * @param {Object} obj (description)
     * @param {string} propertyName (description)
     * @param {*} [value] (description)
     * @returns (description)
     */
    export function defineProperty(obj: Object, propertyName: string, value?: any): void;
    /**
     * Checks if property is already defined by mojito's
     * defineProperty method.
     *
     * @export
     * @param {Object} obj The object where to look for the defined property
     * @param {string} propertyName The name(key) of the defined property
     * @returns {boolean} true if property is defined, false if not
     */
    export function isDefinedProperty(obj: Object, propertyName: string): boolean;
}
declare module "core/object/object" {
    import { Meta } from "core/meta/meta";
    import { IIterableObject } from "core/iterator/iterator";
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
    export class CoreObject implements IIterableObject {
        /**
         * Creates an instance of CoreObject.
         *
         * @param {Object} [obj] Object or property map to define properties
         */
        constructor(obj?: Object);
        /**
         * Retrieves the value of a property from the object.
         *
         * @param {string} propertyName The name(key) of the property
         * @returns {*} Value of the property
         */
        get(propertyName: string): any;
        /**
         * Sets the provided key or path on the object to the value.
         *
         * @param {string} propertyName The name(key) of the property
         * @param {*} value Value to be set on the property
         * @returns {*} Value which has been set on the property
         */
        set(propertyName: string, value: any): any;
        /**
         * Returns the Meta hash of this CoreObject
         *
         * @returns {Meta} The Meta hash/map
         */
        getMeta(): Meta;
        /**
         * Static method to provide functionality for `CoreObject.create()`
         *
         * @static
         * @param {Object} [obj] Object or property map to define properties
         * @returns {CoreObject} Newly created CoreObject
         */
        static create(obj?: Object): any;
        /**
         * Custom defineProperty method for change detection
         *
         * @static
         * @param {CoreObject} sourceObject The object where to define the property
         * @param {string} propertyName The name(key) of the property to be defined
         * @param {*} [value] The value to be set on the property
         */
        static defineProperty(sourceObject: CoreObject, propertyName: string, value?: any): void;
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
        static defineProperties(sourceObject: CoreObject, propertyMap?: Object): CoreObject;
        /**
         * Checks if property is already defined by mojito's
         * defineProperty method.
         *
         * @static
         * @param {CoreObject} sourceObject The object where to look for the property
         * @param {string} propertyName The name(key) of the defined property
         * @returns {boolean} true if property is defined, false if not
         */
        static isDefinedProperty(sourceObject: CoreObject, propertyName: string): boolean;
    }
}
declare module "core/set/set" {
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
    export function set(obj: Object, propertyName: string, value: any): any;
    export function setProperties(obj: Object, properties: Object): Object;
}
declare module "core/map/map" {
    import { Iterator, IIterable } from "core/iterator/iterator";
    /**
     * Implementation of the ES6 Map.
     * The Map object is a simple key/value map.
     * Any value (both objects and primitive values) may be used as either a key or a value.
     *
     * @export
     * @class CoreMap
     * @implements {IIterable<any>}
     */
    export class CoreMap implements IIterable<any> {
        /**
         * Internal Array where all thoses keys and values are stored.
         *
         * @private
         * @type {Array<[any, any]}
         */
        private _source;
        /**
         * Returns the number of key/value pairs in the Map object.
         *
         * @readonly
         * @type {number}
         */
        size: number;
        /**
         * The value of the length property is 0.
         * To fulfill the ES2015 specification the Map must implement
         * a length property even if it always returns 0:
         * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map#Properties
         *
         * @readonly
         * @type {number}
         */
        length: number;
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
        /**
         * Removes all key/value pairs from the Map object.
         */
        clear(): void;
        /**
         * Removes any value associated to the key and returns the value that Map.has(key) would have previously returned.
         * Map.prototype.has(key) will return false afterwards.
         *
         * @param {*} key The key of the element to remove from the Map object.
         */
        delete(key: any): void;
        /**
         * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
         *
         * @returns {Iterator<[any,any]>} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
         */
        entries(): Iterator<[any, any]>;
        /**
         * Calls callbackFn once for each key-value pair present in the Map object, in insertion order.
         * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
         *
         * @param {(value: any, key: any, map: CoreMap) => void} callbackFn Function to execute for each element.
         * @param {(Object | Function)} [thisArg] Value to use as this when executing callback.
         */
        forEach(callbackFn: (value: any, key: any, map: CoreMap) => any, thisArg?: Object | Function): void;
        /**
         * Returns the value associated to the key, or undefined if there is none.
         *
         * @param {*} key The key of the element to return from the Map object.
         * @returns {*} Value associated to the key, or undefined
         */
        get(key: any): any;
        /**
         * Returns a boolean asserting whether a value has been associated to the key in the Map object or not.
         *
         * @param {*} key The key of the element to test for presence in the Map object.
         * @returns {boolean} Value associated to the key
         */
        has(key: any): boolean;
        /**
         * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
         *
         * @returns {Iterator<any>} Iterator object that contains the keys for each element in the Map object in insertion order
         */
        keys(): Iterator<any>;
        /**
         * Sets the value for the key in the Map object. Returns the Map object.
         *
         * @param {*} key The key of the element to add to the Map object.
         * @param {*} value The value of the element to add to the Map object.
         * @returns {CoreMap} The Map object
         */
        set(key: any, value: any): CoreMap;
        /**
         * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
         *
         * @returns {CoreMapIterator} Iterator object that contains the values for each element in the Map object in insertion order
         */
        values(): Iterator<any>;
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
        /**
         * Removes any value associated to the key and returns the value that Map.has(key) would have previously returned.
         * Map.prototype.has(key) will return false afterwards.
         *
         * @param {K} key The key of the element to remove from the Map object.
         */
        delete(key: K): void;
        /**
         * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
         *
         * @returns {Iterator<[K, V]>} Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
         */
        entries(): Iterator<[K, V]>;
        /**
         * Calls callbackFn once for each key-value pair present in the Map object, in insertion order.
         * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
         *
         * @param {(value: any, key: any, map: TypedMap) => void} callbackFn Function to execute for each element.
         * @param {(Object | Function)} [thisArg] Value to use as this when executing callback.
         */
        forEach(callbackFn: (value: V, key: K, map: TypedMap<K, V>) => any, thisArg?: Object | Function): void;
        /**
         * Returns the value associated to the key, or undefined if there is none.
         *
         * @param {K} key The key of the element to return from the Map object.
         * @returns {V} Value associated to the key, or undefined
         */
        get(key: K): V;
        /**
         * Returns a boolean asserting whether a value has been associated to the key in the Map object or not.
         *
         * @param {*} key The key of the element to test for presence in the Map object.
         * @returns {boolean} Value associated to the key
         */
        has(key: K): boolean;
        /**
         * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
         *
         * @returns {Iterator<any>} Iterator object that contains the keys for each element in the Map object in insertion order
         */
        keys(): Iterator<K>;
        /**
         * Sets the value for the key in the Map object. Returns the Map object.
         *
         * @param {K} key The key of the element to add to the Map object.
         * @param {V} value The value of the element to add to the Map object.
         * @returns {TypedMap<K,V>} The Map object
         */
        set(key: K, value: V): TypedMap<K, V>;
        /**
         * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
         *
         * @returns {CoreMapIterator} Iterator object that contains the values for each element in the Map object in insertion order
         */
        values(): Iterator<V>;
        /**
         * Creates an instance of an empty CoreMap.
         *
         * @static
         * @template K
         * @template V
         * @returns {TypedMap<K,V>} Created empty TypedMap
         */
        static create<K, V>(): TypedMap<K, V>;
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
        static create<K, V>(source: Array<[K, V]>): TypedMap<K, V>;
    }
}
declare module "core/observable/observes" {
    export function observes(...keys: string[]): MethodDecorator;
}
declare module "core/core" {
    export { get } from "core/get/get";
    export { set } from "core/set/set";
    export { Meta } from "core/meta/meta";
    export { CoreObject } from "core/object/object";
    export { CoreArray } from "core/array/array";
    export { CoreMap, TypedMap } from "core/map/map";
    export { observes } from "core/observable/observes";
    export { ObservableObject } from "core/observable/observableObject";
}
declare module "mojito/core" {
    export * from "core/core";
}
declare module "utils/class/class" {
    export interface ClassType<T> {
        new (...args: Array<any>): T;
        [propertyName: string]: any;
        name?: string;
    }
    export function getClassName<T>(klass: ClassType<T>): string;
    export function isClassInstance(instance: any): boolean;
}
declare module "runtime/annotations/annotations" {
    import { ClassType } from "utils/class/class";
    export class Annotations {
        private _map;
        private _classType;
        constructor(classType: ClassType<any>);
        get<A>(annotationType: ClassType<A>): A[];
        getSingle<A>(annotationType: ClassType<A>): A;
        add<A>(annotation: A): void;
        set<A>(annotation: A): void;
        static peek(classType: ClassType<any>): Annotations;
        static isAnnotated(classType: ClassType<any>): boolean;
    }
}
declare module "utils/string/stringify" {
    export function stringify(token: any): string;
}
declare module "runtime/di/metadata" {
    export class InjectableMetadata {
        constructor();
        toString(): string;
    }
    export class InjectMetadata {
        token: any;
        constructor(token: any);
        toString(): string;
    }
}
declare module "runtime/di/provider" {
    import { ClassType } from "utils/class/class";
    /**
     * Describes how the {@link Injector} should instantiate a given token.
     *
     * @export
     * @class Provider
     */
    export class Provider {
        constructor(token: any, {useClass, useValue, useFactory, dependencies}: {
            useClass?: ClassType<any>;
            useValue?: any;
            useFactory?: Function;
            dependencies?: Object[];
        });
        token: any;
        useClass: ClassType<any>;
        useValue: any;
        useFactory: Function;
        dependencies: Object[];
    }
    /**
     * Creates a {@link Provider}.
     *
     * @export
     * @param {*} token
     * @param {{
     *     useClass?: ClassType<any>,
     *     useValue?: any,
     *     useFactory?: Function,
     *     dependencies?: Object[],
     * }} {useClass, useValue, useFactory, dependencies}
     * @returns {Provider}
     */
    export function provide(token: any, {useClass, useValue, useFactory, dependencies}: {
        useClass?: ClassType<any>;
        useValue?: any;
        useFactory?: Function;
        dependencies?: Object[];
    }): Provider;
    /**
     * An internal resolved representation of a {@link Provider} used by the {@link Injector}.
     *
     * @export
     * @class ResolvedProvider
     */
    export class ResolvedProvider {
        private _token;
        private _resolvedFactory;
        constructor(token: any, resolvedFactory: ResolvedFactory);
        token: any;
        resolvedFactory: ResolvedFactory;
    }
    /**
     * Resolves an array of Providers or stuff that can be converted to a Provider
     *
     * @internal
     * @export
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @returns {ResolvedProvider[]}
     */
    export function resolveProviders(providers: Array<ClassType<any> | Provider | {
        [key: string]: any;
    }>): ResolvedProvider[];
    /**
     * Resolves a single Provider and returns an ResolvedProvider
     *
     * @internal
     * @export
     * @param {Provider} provider
     * @returns {ResolvedProvider}
     */
    export function resolveProvider(provider: Provider): ResolvedProvider;
    /**
     * An internal resolved representation of a factory function created by resolving {@link Provider}.
     *
     * A ResolvedFactory is basically a function which creates
     * and returns the item (class, value,.. ) provided.
     *
     * @export
     * @class ResolvedFactory
     */
    export class ResolvedFactory {
        private _factoryFn;
        private _dependencies;
        constructor(provider: Provider);
        factory: Function;
        dependencies: any[];
        static resolve(provider: Provider): ResolvedFactory;
    }
}
declare module "runtime/di/injector" {
    import { ClassType } from "utils/class/class";
    import { Provider, ResolvedProvider } from "runtime/di/provider";
    /**
     * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
     * constructor dependencies.
     *
     * @export
     * @class Injector
     */
    export class Injector {
        private _parent;
        private _providers;
        private _values;
        /**
         * Creates an instance of Injector.
         *
         * @param {ResolvedProvider[]} providers
         * @param {Injector} [parent=null]
         */
        constructor(providers: ResolvedProvider[], parent?: Injector);
        /**
         * The parent of this injector
         *
         * @readonly
         * @type {Injector}
         */
        parent: Injector;
        /**
         * Turns an array of provider definitions into an array of resolved providers.
         *
         * @static
         * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
         * @returns {ResolvedProvider[]}
         */
        static resolve(providers: Array<ClassType<any> | Provider | {
            [key: string]: any;
        }>): ResolvedProvider[];
        /**
         * Resolves an array of providers and creates an injector from those providers.
         *
         * @static
         * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
         * @param {Injector} [parent=null]
         * @returns
         */
        static resolveAndCreate(providers: Array<ClassType<any> | Provider | {
            [key: string]: any;
        }>, parent?: Injector): Injector;
        /**
         * Creates an injector from previously resolved providers.
         *
         * @static
         * @param {ResolvedProvider[]} providers
         * @param {Injector} [parent=null]
         * @returns
         */
        static fromResolvedProviders(providers: ResolvedProvider[], parent?: Injector): Injector;
        /**
         * Resolves an array of providers and creates a child injector from those providers.
         *
         * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
         * @returns {Injector}
         */
        resolveAndCreateChild(providers: Array<ClassType<any> | Provider | {
            [key: string]: any;
        }>): Injector;
        /**
         * Creates a child injector from previously resolved providers.
         *
         * @param {ResolvedProvider[]} providers
         * @returns {Injector}
         */
        createChildFromResolved(providers: ResolvedProvider[]): Injector;
        /**
         * Gets the value of the resolved provider matching the token
         *
         * @param {*} token
         * @returns {*}
         */
        get(token: any): any;
    }
}
declare module "runtime/di/decorators" {
    export function Inject<C>(token: any): ParameterDecorator;
    export function Injectable(): ClassDecorator;
}
declare module "runtime/di/di" {
    /**
     * Mojito's dependency injection basically a simpler version of Angular's DI.
     * All the credits and respect to the Angular team.
     *
     * TODO: Insert stuff...
     */
    export { Injectable, Inject } from "runtime/di/decorators";
    export { Injector } from "runtime/di/injector";
    export { Provider, ResolvedProvider, provide } from "runtime/di/provider";
}
declare module "utils/dom/dom" {
    /**
     * Converts the array-like NodeList (NodeListOf) to a real array
     *
     * @export
     * @template T
     * @param {NodeListOf<T>} nodeList
     * @returns {Array<T>} Converted Array
     */
    export function convertNodeListToArray<T extends Node>(nodeList: NodeListOf<T>): Array<T>;
    /**
     * Checks if a selector matches an element.
     *
     * @export
     * @param {string} selector
     * @param {Element} element
     * @returns Returns true if selector matches, false if not
     */
    export function doesSelectorMatchElement(selector: string, element: Element): boolean;
}
declare module "render/dom_parser/dom_parser" {
    export interface IDOMParserElementHook {
        predicate: (element: HTMLElement) => boolean;
        onBeforeParse?: (element: HTMLElement, context: Array<any>) => Object | Function;
        onParse?: (element: HTMLElement, context: Array<any>) => void;
        onAfterParse?: (element: HTMLElement, context: Array<any>) => void;
        onDestroy?: (element: HTMLElement) => void;
    }
    export interface IDOMParserAttributeHook {
        removeAttributeNode?: boolean;
        predicate: (attribute: Attr) => boolean;
        onBeforeParse?: (element: HTMLElement, attribute: Attr, context: Array<any>) => Object | Function;
        onParse?: (element: HTMLElement, attribute: Attr, context: Array<any>) => void;
        onAfterParse?: (element: HTMLElement, attribute: Attr, context: Array<any>) => void;
        onDestroy?: (element: HTMLElement, attribute: Attr) => void;
    }
    export class DOMParser {
        private elementHooks;
        private attributeHooks;
        parseTree(rootElement?: HTMLElement): void;
        private parseNode(element, context?);
        registerElementHook(hook: IDOMParserElementHook): void;
        registerAttributeHook(hook: IDOMParserAttributeHook): void;
    }
}
declare module "render/render" {
    export * from "render/dom_parser/dom_parser";
}
declare module "runtime/view/factory" {
    import { ClassType } from "utils/class/class";
    import { View } from "runtime/view/view";
    export class ViewFactory<V extends View> {
        private _viewType;
        constructor(viewType: ClassType<V>);
        create(element: Element): V;
    }
}
declare module "runtime/view/view" {
    import { ViewRef } from "runtime/view/reference";
    export class View {
        private _ref;
        private _parser;
        private _rootElement;
        rootElement: Element;
        ref: ViewRef<View>;
        constructor(element: Element);
        parse(): void;
        destroy(): void;
    }
}
declare module "runtime/view/reference" {
    import { View } from "runtime/view/view";
    export class ViewRef<V extends View> {
        private _view;
        constructor(_view: V);
        internalView: V;
        destroy(): void;
    }
}
declare module "runtime/view/element" {
    export class ElementRef {
        nativeElement: any;
        constructor(nativeElement: any);
    }
}
declare module "runtime/view/view_container" {
    import { ComponentFactory } from "runtime/component/factory";
    import { ViewElement } from "runtime/view/view_element";
    import { Injector } from "runtime/di/di";
    export class ViewContainerRef {
        private _element;
        constructor(element: ViewElement);
        createEmbeddedView(): void;
        createComponent<C>(componentFactory: ComponentFactory<C>, injector: Injector, nativeElement: Element): void;
        destroy(): void;
    }
}
declare module "runtime/view/view_element" {
    import { ViewContainerRef } from "runtime/view/view_container";
    import { View } from "runtime/view/view";
    import { ElementRef } from "runtime/view/element";
    import { Injector } from "runtime/di/di";
    export class ViewElement {
        private _componentView;
        private _nestedViews;
        private _nativeElement;
        private _component;
        private _injector;
        component: any;
        elementRef: ElementRef;
        viewContainerRef: ViewContainerRef;
        injector: Injector;
        constructor(nativeElement: Element);
        initComponent(component: any, injector: Injector): void;
        attachView(view: View, viewIndex: number): void;
    }
}
declare module "runtime/component/reference" {
    import { ClassType } from "utils/class/class";
    import { ViewElement } from "runtime/view/view_element";
    import { Injector } from "runtime/di/di";
    export class ComponentReference<C> {
        private _hostElement;
        private _componentType;
        constructor(hostElement: ViewElement, componentType: ClassType<C>);
        hostElement: ViewElement;
        instance: C;
        injector: Injector;
        componentType: ClassType<C>;
        destroy(): void;
    }
}
declare module "runtime/component/metadata" {
    import { ClassType } from "utils/class/class";
    import { Provider } from "runtime/di/di";
    /**
     * Specifies the metadata to describe a component class using the {@Component} decorator.
     *
     * @export
     * @abstract
     * @class ComponentMetadata
     */
    export interface ComponentMetadata {
        /**
         * Specifies the CSS Selector where the class will be instanciated on.
         *
         * ```typescript
         * @Component({
         *   selector: 'button'
         * })
         * class MyButton {
         * }
         * ```
         *
         * ```typescript
         * @Component({
         *   selector: 'my-button'
         * })
         * class MyButton {
         * }
         * ```
         *
         * ```typescript
         * @Component({
         *   selector: '[my-button]'
         * })
         * class MyButton {
         * }
         * ```
         *
         * ```typescript
         * @Component({
         *   selector: '.btn'
         * })
         * class MyButton {
         * }
         * ```
         *
         * ```typescript
         * @Component({
         *   selector: '#my-button'
         * })
         * class MyButton {
         * }
         * ```
         *
         * @type {string}
         */
        selector: string;
        /**
         * Specifies the actions (events) related to the element.
         *
         * ```typescript
         * @Component({
         *   selector: 'button',
         *   actions: {
         *     '(click)': 'onClick(event)'
         *   }
         * })
         * class MyButton {
         *     onClick(event: MouseEvent) {
         *       // your code
         *     }
         * }
         * ```
         *
         * @type {{[key: string]: string}}
         */
        actions?: {
            [key: string]: string;
        };
        /**
         * Defines a template string which will be compiled an applied to the DOM.
         *
         * ```typescript
         * @Component({
         *   selector: 'custom-tooltip',
         *   template: `
         *      <div class="tooltip__body">
         *          Some text
         *      </div>
         *   `
         * })
         * class CustomTooltipComponent {
         *      // your code
         * }
         * ```
         *
         * @type {string}
         */
        template?: string;
        /**
         * TODO: CLI Implementation
         *
         * @type {string}
         */
        templateName?: string;
        /**
         * List of provideable classes, providers or provider like objects
         *
         * @type {(Array<ClassType<any> | Provider | { [key: string]: any }>)}
         */
        providers?: Array<ClassType<any> | Provider | {
            [key: string]: any;
        }>;
    }
    /**
     * Reference Object containing the component metadata
     *
     * @export
     * @class ComponentMetadataReference
     * @template C
     */
    export class ComponentMetadataReference<C> {
        private _selector;
        private _actions;
        private _template;
        private _templateName;
        private _providers;
        constructor(metadata: ComponentMetadata);
        selector: string;
        actions: {
            [key: string]: string;
        };
        template: string;
        templateName: string;
        providers: Array<ClassType<any> | Provider | {
            [key: string]: any;
        }>;
    }
}
declare module "runtime/component/factory" {
    import { ClassType } from "utils/class/class";
    import { ComponentReference } from "runtime/component/reference";
    import { ComponentMetadataReference } from "runtime/component/metadata";
    import { Injector } from "runtime/di/di";
    export class ComponentFactory<C> {
        private _metaRef;
        private _componentType;
        constructor(componentClass: ClassType<C>);
        metadataReference: ComponentMetadataReference<C>;
        create(injector: Injector, nativeElement: Element): ComponentReference<C>;
    }
}
declare module "runtime/component/resolver" {
    import { ClassType } from "utils/class/class";
    import { ComponentFactory } from "runtime/component/factory";
    export class ComponentResolver {
        resolveComponent<C>(componentClass: ClassType<C>): ComponentFactory<C>;
    }
}
declare module "runtime/bootstrap/bootstrap" {
    import { ClassType } from "utils/class/class";
    import { Provider } from "runtime/di/di";
    export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | {
        [key: string]: any;
    }>, root?: Element): void;
    export function bootstrap<C>(appComponentType: ClassType<C>, root?: HTMLElement): void;
}
declare module "runtime/lifecycle/lifecycle_hooks" {
    export enum LifecycleHooks {
        OnInit = 0,
        OnChanges = 1,
        OnRender = 2,
        OnDestroy = 3,
    }
    export abstract class OnInit {
        abstract onInit(): void;
    }
    export abstract class OnChanges {
        abstract onChanges(): void;
    }
    export abstract class OnRender {
        abstract onRender(): void;
    }
    export abstract class OnDestroy {
        abstract onDestroy(): void;
    }
}
declare module "runtime/component/directive" {
    import { ClassType } from "utils/class/class";
    import { ComponentMetadata } from "runtime/component/metadata";
    /**
     * The component directive allows you to attach behavior (a class) to elements in the DOM
     * using a class decorator or the {@link registerDirective} function.
     *
     * A component directive contains metadata (including the elements selector)
     * and a class which will be attached to the elements.
     *
     * Assume this HTML Template or DOM
     * ```html
     * <form class="form">
     *   <div>
     *     <div my-component>
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
     * @Component({ selector: '[my-component]'})
     * class MyComponent {
     *  // Your Code
     * }
     * ```
     *
     * @export
     * @param {ComponentMetadata} metadata Component metadata
     * @returns {ClassDecorator}
     */
    export function Component(metadata: ComponentMetadata): ClassDecorator;
    /**
     * Function for registering a component class and metadata.
     * Normally you would not call this function directly.
     * Use the {@link Component} class decorator.
     *
     * @export
     * @template C
     * @param {ClassFactory<C>} componentClass
     * @param {IComponentMetadata} metadata
     * @returns {ComponentFactory<C>}
     */
    export function registerComponent<C>(componentClass: ClassType<C>, metadata: ComponentMetadata): void;
}
declare module "runtime/runtime" {
    export { bootstrap } from "runtime/bootstrap/bootstrap";
    export * from "runtime/lifecycle/lifecycle_hooks";
    export { Component } from "runtime/component/directive";
    export * from "runtime/di/di";
}
declare module "mojito/runtime" {
    export * from "runtime/runtime";
}
