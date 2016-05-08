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
declare module "debug/debug" {
    export { assert } from "debug/assert/assert";
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
declare module "core/observer/observer" {
    import { CoreObject } from "core/object/object";
    import { CoreArray } from "core/array/array";
    export class Observable {
        constructor(subject: CoreObject, key: string);
        constructor(subject: CoreArray, key: string);
        subscribe(callback: (newValue: any, oldValue: any) => void): void;
    }
    export class Observer {
        private onNext;
        private onError;
        private onComplete;
        constructor(onNext: (newValue: any) => void, onError?: (error: Object) => void, onComplete?: () => void);
        next(): void;
        error(): void;
        complete(): void;
    }
    export function observes(...keys: string[]): MethodDecorator;
}
declare module "core/array/array" {
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
        static peek(obj: CoreArray): Meta;
        /**
         * Retrieves the meta hash for an Object.
         * If the object has no meta yet, a new one will be created
         *
         * @static
         * @param {Object} obj The Object where to peek for a meta hash
         * @returns {Meta} The peeked or created meta object
         */
        static peek(obj: Object): Meta;
    }
}
declare module "core/object/object" {
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
    export class CoreObject {
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
         * Static method to provide functionality for `CoreObject.create()`
         *
         * @static
         * @param {Object} [obj] Object or property map to define properties
         * @returns {CoreObject} Newly created CoreObject
         */
        static create(obj?: Object): CoreObject;
        /**
         * Custom defineProperty method for handling observers,
         * computed propertiese, ...
         *
         * @static
         * @param {CoreObject} sourceObject The object where to define the property
         * @param {string} propertyName The name(key) of the property to be defined
         * @param {*} [value] The value to be set on the property
         */
        static defineProperty(sourceObject: CoreObject, propertyName: string, value?: any): void;
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
}
declare module "core/class/class" {
    import { CoreObject } from "core/object/object";
    export abstract class CoreClass extends CoreObject {
        constructor(propertyMap?: Object);
    }
}
declare module "runtime/mojito/mojito" {
    import { Application } from "runtime/runtime";
    export class Mojito {
        private static GLOBAL_NAMESPACE;
        constructor();
        registerApplication(application: Application): Application;
        getApplication(applicationName: string): Application;
        getApplications(): Object;
        static getInstance(): Mojito;
    }
}
declare module "runtime/controller/controller" {
    import { CoreView } from "core/core";
    import { Application } from "runtime/application/application";
    export interface IControllerMeta {
        application: Application;
        selector: string;
    }
    export interface IController extends Controller {
        new (): IController;
        name: string;
    }
    export abstract class Controller extends CoreView {
        constructor();
        _attachController(element: Element): void;
        static register(ControllerClass: IController, meta: IControllerMeta): Array<Controller>;
    }
}
declare module "runtime/application/application" {
    import { CoreClass } from "core/core";
    import { Controller, IController, IControllerMeta } from "runtime/controller/controller";
    export class Application extends CoreClass {
        name: string;
        root: Element;
        constructor(name: string);
        registerController(ControllerClass: IController, meta: IControllerMeta): Array<Controller>;
        getControllers(): Object;
        getControllersByClassName(className: string): Object;
        static create(name: string): Application;
    }
}
declare module "runtime/service/service" {
    import { CoreObject } from "core/core";
    export abstract class Service extends CoreObject {
    }
}
declare module "runtime/instantiation/instantiation" {
    export function onBeforeInstantiation(TargetClass: any, callback: Function): any;
    export function onAfterInstantiation(TargetClass: any, callback: Function): any;
    /**
     * @memberOf test
     */
    export function instantiation(TargetClass: any, onBeforeInstantiation?: Function, onAfterInstantiation?: Function): any;
}
declare module "runtime/singleton/singleton" {
    export function singleton(TargetClass: any): void;
}
declare module "runtime/injectable/injectable" {
    export function injectable(TargetClass: any): void;
}
declare module "runtime/inject/inject" {
    export function inject(InjectableClass: any): PropertyDecorator;
}
declare module "runtime/register/register" {
    export function register(obj: {
        application: string;
        selector: string;
    }): ClassDecorator;
}
declare module "runtime/runtime" {
    export { Mojito } from "runtime/mojito/mojito";
    export { Application } from "runtime/application/application";
    export { Controller } from "runtime/controller/controller";
    export { Service } from "runtime/service/service";
    export { injectable } from "runtime/injectable/injectable";
    export { inject } from "runtime/inject/inject";
    export { singleton } from "runtime/singleton/singleton";
    export { register } from "runtime/register/register";
}
declare module "core/view/view" {
    import { CoreClass } from "core/class/class";
    export interface onDidAttachView {
        onDidAttachView(element: Element): void;
    }
    export interface onDidRenderView {
        onDidRenderView(element: Element): void;
    }
    export abstract class CoreView extends CoreClass {
        private _isAttached;
        private _isRendered;
        private _isDestroyed;
        $: Function;
        _attachView(element: Element): void;
        _renderView(): void;
    }
}
declare module "core/core" {
    export { get } from "core/get/get";
    export { set } from "core/set/set";
    export { Meta } from "core/meta/meta";
    export { CoreObject } from "core/object/object";
    export { CoreArray } from "core/array/array";
    export { CoreClass } from "core/class/class";
    export { CoreView, onDidAttachView, onDidRenderView } from "core/view/view";
    export { Observer, observes } from "core/observer/observer";
}
declare module "mojito/core" {
    export * from "core/core";
}
declare module "mojito/debug" {
    export * from "debug/debug";
}
declare module "mojito/runtime" {
    export * from "runtime/runtime";
}
