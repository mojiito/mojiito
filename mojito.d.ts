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
declare module "utils/class/class" {
    export interface ClassType<T> {
        new (...args: Array<any>): T;
        [propertyName: string]: any;
        name?: string;
    }
    export function getClassName<T>(klass: ClassType<T>): string;
    export function isClassInstance(instance: any): boolean;
}
declare module "utils/lang/lang" {
    /**
     * Check if value is an array (not object)
     *
     * @function isArray
     * @param  {any} value
     * @returns boolean
     */
    export function isArray(value: any): boolean;
    /**
     * Check if value is an object (not array)
     *
     * @function isObject
     * @param  {any} value
     * @returns boolean
     */
    export function isObject(value: any): boolean;
    /**
     * Check if value is a boolean
     *
     * @function isBoolean
     * @param  {any} value
     * @returns boolean
     */
    export function isBoolean(value: any): boolean;
    /**
     * Check if value is a number (int or float)
     *
     * @function isNumber
     * @param  {any} value
     * @returns boolean
     */
    export function isNumber(value: any): boolean;
    /**
     * Check if value is a float
     *
     * isFloat(0)       // false
     * isFloat(1)       // false
     * isFloat(1.1)     // true
     * isInt(-1)        // false
     * isInt(-1.1)      // true
     *
     * @function isFloat
     * @param  {any} value
     * @returns boolean
     */
    export function isFloat(value: any): boolean;
    /**
     * Check if value is a integer
     *
     * isInt(0)         // true
     * isInt(1)         // true
     * isInt(1.1)       // false
     * isInt(-1)        // true
     * isInt(-1.1)      // false
     *
     * @function isInt
     * @param  {any} value
     * @returns boolean
     */
    export function isInt(value: any): boolean;
    /**
     * Check if value is a string
     *
     * @function isString
     * @param  {any} value
     * @returns boolean
     */
    export function isString(value: any): boolean;
    /**
     * Check if value is a function
     *
     * @function isFunction
     * @param  {any} value
     * @returns boolean
     */
    export function isFunction(value: any): boolean;
    /**
     * Check if value is a symbol
     *
     * @function isSymbol
     * @param  {any} value
     * @returns boolean
     */
    export function isSymbol(value: any): boolean;
    /**
     * Check if value is defined
     *
     * @function isDefined
     * @param  {any} value
     * @returns boolean
     */
    export function isDefined(value: any): boolean;
    /**
     * Check if value is `null`
     *
     * @function isNull
     * @param  {any} value
     * @returns boolean
     */
    export function isNull(value: any): boolean;
    /**
     * Verifies that a value is `undefined`, `null`
     * or an empty string, empty array, or an empty object
     *
     * isEmpty();                // true
     * isEmpty(null);            // true
     * isEmpty(undefined);       // true
     * isEmpty('');              // true
     * isEmpty([]);              // true
     * isEmpty({});              // false
     * isEmpty('Adam Hawkins');  // false
     * isEmpty([0,1,2]);         // false
     *
     * @function isEmpty
     * @param  {any} value
     * @returns boolean
     */
    export function isEmpty(value: any): boolean;
    export function isPresent(value: any): boolean;
    export function isBlank(value: any): boolean;
    export function getMapKey<T>(value: T): T;
    export function looseIdentical(a: any, b: any): boolean;
    export function getSymbolIterator(): string | symbol;
    /**
     * Check if value is a primitive
     *
     * isPrimitive(null)          // true
     * isPrimitive(undefined)     // true
     * isPrimitive('string')      // true
     * isPrimitive(1)             // true
     * isPrimitive(1.1)           // true
     * isPrimitive(true)          // true
     * isPrimitive([0,1,2])       // false
     * isPrimitive({})            // false
     * isPrimitive(function(){})  // false
     *
     * @function isPrimitive
     * @param  {any} value
     * @returns boolean
     */
    export function isPrimitive(value: any): boolean;
    /**
     * Typeof proxy function for real array detection
     *
     * @function typeOf
     * @param  {any} value
     * @returns string
     */
    export function typeOf(value: any): string;
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
declare module "utils/string/endswith" {
    export function endsWith(str: string, searchString: string, position?: number): boolean;
}
declare module "utils/string/kebab" {
    export function toKebabCase(str: string): string;
}
declare module "utils/string/stringify" {
    export function stringify(token: any): string;
}
declare module "utils/utils" {
    export * from "utils/class/class";
    export * from "utils/lang/lang";
    export * from "utils/dom/dom";
    export * from "utils/string/endswith";
    export * from "utils/string/kebab";
    export * from "utils/string/stringify";
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
declare module "core/reflect/reflection" {
    import { ClassType } from "utils/class/class";
    import { TypedMap } from "core/map/map";
    export class ClassReflection {
        private _properties;
        private _parameters;
        private _annotations;
        properties: TypedMap<string | symbol, any>;
        parameters: any[];
        annotations: TypedMap<ClassType<any>, any>;
        static peek(classType: ClassType<any>): ClassReflection;
        static isReflected(classType: ClassType<any>): boolean;
    }
}
declare module "core/di/metadata" {
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
declare module "core/component/metadata" {
    import { InjectableMetadata } from "core/di/metadata";
    export class DirectiveMetadata extends InjectableMetadata {
        selector: string;
        inputs: string[];
        outputs: string[];
        host: {
            [key: string]: string;
        };
        providers: any[];
        constructor({selector, inputs, outputs, host, providers}?: {
            selector?: string;
            inputs?: string[];
            outputs?: string[];
            host?: {
                [key: string]: string;
            };
            providers?: any[];
        });
        toString(): string;
    }
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
     * @class ComponentMetadata
     * @extends {DirectiveMetadata}
     */
    export class ComponentMetadata extends DirectiveMetadata {
        templateUrl: string;
        template: string;
        styleUrls: string[];
        styles: string[];
        constructor({selector, inputs, outputs, host, providers, templateUrl, template, styleUrls, styles}?: {
            selector?: string;
            inputs?: string[];
            outputs?: string[];
            host?: {
                [key: string]: string;
            };
            providers?: any[];
            templateUrl?: string;
            template?: string;
            styleUrls?: string[];
            styles?: string[];
        });
        toString(): string;
    }
    export class InputMetadata {
        bindingPropertyName: string;
        constructor(bindingPropertyName?: string);
        toString(): string;
    }
    export class OutputMetadata {
        bindingPropertyName: string;
        constructor(bindingPropertyName?: string);
        toString(): string;
    }
}
declare module "core/directive/registry" {
    import { ClassType } from "utils/class/class";
    export class DirectiveRegistry {
        private static _directiveTypes;
        private static _selectors;
        static selectors: string[];
        static directiveTypes: ClassType<any>[];
        static register(directiveType: ClassType<any>, selector: string): void;
        static bySelector(selector: string): ClassType<any>;
    }
}
declare module "core/decorators/decorators" {
    import { ClassType } from "utils/class/class";
    export function createClassDecorator(metadataClass: ClassType<any>): (objOrType: any) => ClassDecorator;
    export function createParameterDecorator(metadataClass: ClassType<any>): (objOrType: any) => ParameterDecorator;
    export function createPropertyDecoratory(metadataClass: ClassType<any>): (objOrType: any) => ParameterDecorator;
}
declare module "core/di/decorators" {
    export interface InjectableMetadataFactory {
        (): ClassDecorator;
    }
    export var Injectable: InjectableMetadataFactory;
    export interface InjectMetadataFactory {
        (token: any): ParameterDecorator;
    }
    export var Inject: InjectMetadataFactory;
}
declare module "core/di/forward_ref" {
    import { ClassType } from "utils/class/class";
    /**
     * An interface that a function passed into {@link forwardRef} has to implement.
     *
     * ### Example
     *
     * {@example core/di/ts/forward_ref/forward_ref.ts region='forward_ref_fn'}
     * @experimental
     */
    export interface ForwardRefFn {
        (): any;
    }
    /**
     * Allows to refer to references which are not yet defined.
     *
     * For instance, `forwardRef` is used when the `token` which we need to refer to for the purposes of
     * DI is declared,
     * but not yet defined. It is also used when the `token` which we use when creating a query is not
     * yet defined.
     *
     * ### Example
     * {@example core/di/ts/forward_ref/forward_ref.ts region='forward_ref'}
     * @experimental
     */
    export function forwardRef(forwardRefFn: ForwardRefFn): ClassType<any>;
    /**
     * Lazily retrieves the reference value from a forwardRef.
     *
     * Acts as the identity function when given a non-forward-ref value.
     *
     * ### Example ([live demo](http://plnkr.co/edit/GU72mJrk1fiodChcmiDR?p=preview))
     *
     * ```typescript
     * var ref = forwardRef(() => "refValue");
     * expect(resolveForwardRef(ref)).toEqual("refValue");
     * expect(resolveForwardRef("regularValue")).toEqual("regularValue");
     * ```
     *
     * See: {@link forwardRef}
     * @experimental
     */
    export function resolveForwardRef(type: any): any;
}
declare module "core/di/provider" {
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
        constructor(factory: Function, dependencies: any[]);
        factory: Function;
        dependencies: any[];
    }
    export function resolveFactory(provider: Provider): ResolvedFactory;
    /**
     * Looks up and returns the dependecies as an array for an annotated class.
     *
     * @export
     * @param {ClassType<any>} annotatedClass
     * @returns {any[]}
     */
    export function dependenciesForClass(annotatedClass: ClassType<any>): any[];
}
declare module "core/di/injector" {
    import { ClassType } from "utils/class/class";
    import { Provider, ResolvedProvider } from "core/di/provider";
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
declare module "core/di/di" {
    /**
     * Mojito's dependency injection basically a simpler version of Angular's DI.
     * All the credits and respect to the Angular team.
     *
     * TODO: Insert stuff...
     */
    export { Injectable, Inject } from "core/di/decorators";
    export { Injector } from "core/di/injector";
    export { Provider, ResolvedProvider, provide } from "core/di/provider";
    export { forwardRef } from "core/di/forward_ref";
}
declare module "core/component/decorators" {
    export interface ComponentMetadataFactory {
        (metadata: {
            selector?: string;
            inputs?: string[];
            outputs?: string[];
            events?: string[];
            host?: {
                [key: string]: string;
            };
            providers?: any[];
            templateUrl?: string;
            template?: string;
            styleUrls?: string[];
            styles?: string[];
        }): ClassDecorator;
    }
    export var Component: ComponentMetadataFactory;
    export interface InputMetadataFactory {
        (bindingPropertyName?: string): PropertyDecorator;
    }
    export var Input: InputMetadataFactory;
    export interface OutputMetadataFactory {
        (bindingPropertyName?: string): PropertyDecorator;
    }
    export var Output: OutputMetadataFactory;
}
declare module "render/parser/context" {
    export class ContextReference {
        context: any;
        constructor(context: any);
    }
    export class ContextTree {
        private _tree;
        constructor(context?: any | any[]);
        up(): void;
        down(): void;
        add(context: any | any[]): void;
        getUnfiltered(): ContextReference[][];
        getFiltered(): ContextReference[][];
        getNearestContextOfType(type: Function | string): any;
    }
}
declare module "render/parser/dom_parser" {
    import { ContextTree } from "render/parser/context";
    export interface IDOMParserElementHook {
        predicate: (element: Element) => boolean;
        onBeforeParse?: (element: Element, context: ContextTree) => Object | Function;
        onParse?: (element: Element, context: ContextTree) => void;
        onAfterParse?: (element: Element, context: ContextTree) => void;
        onDestroy?: (element: Element) => void;
    }
    export interface IDOMParserAttributeHook {
        removeAttributeNode?: boolean;
        predicate: (attribute: Attr) => boolean;
        onBeforeParse?: (element: Element, attribute: Attr, context: ContextTree) => Object | Function;
        onParse?: (element: Element, attribute: Attr, context: ContextTree) => void;
        onAfterParse?: (element: Element, attribute: Attr, context: ContextTree) => void;
        onDestroy?: (element: Element, attribute: Attr) => void;
    }
    export class DOMParser {
        static PARSED_ELEMENT_ATTR: string;
        private elementHooks;
        private attributeHooks;
        parseTree(rootElement: Element, context?: any | any[], skipRootElement?: boolean): void;
        private parseNode(element, contextTree, skipRootElement?);
        registerElementHook(hook: IDOMParserElementHook): void;
        registerAttributeHook(hook: IDOMParserAttributeHook): void;
    }
}
declare module "core/component/resolver" {
    import { ClassType } from "utils/class/class";
    import { ComponentFactory } from "core/component/factory";
    export class ComponentResolver {
        resolveComponent<C>(componentClass: ClassType<C>): ComponentFactory<C>;
    }
}
declare module "render/parser/hooks/hooks" {
    import { IDOMParserElementHook, IDOMParserAttributeHook } from "render/parser/dom_parser";
    export abstract class ParserElementHook implements IDOMParserElementHook {
        abstract predicate(element: Element): boolean;
    }
    export abstract class ParserAttributeHook implements IDOMParserAttributeHook {
        removeAttributeNode: boolean;
        abstract predicate(attribute: Attr): boolean;
    }
}
declare module "render/parser/hooks/component" {
    import { ContextTree } from "render/parser/context";
    import { ParserElementHook } from "render/parser/hooks/hooks";
    import { ComponentResolver } from "core/component/resolver";
    export class ComponentParserHook extends ParserElementHook {
        private resolver;
        private selectors;
        private lastFoundSelectorIndex;
        constructor(resolver: ComponentResolver);
        predicate(element: Element): boolean;
        onBeforeParse(element: Element, context: ContextTree): Object | Function;
    }
}
declare module "core/async/events" {
    export class EventEmitter<T> {
        private _subscriptions;
        subscribe(generatorOrNext?: (value?: T) => void, error?: any, complete?: any): EventSubscription<T>;
        subscribe(subscription: EventSubscription<T>): EventSubscription<T>;
        emit(value?: T): void;
        error(error: any): void;
        complete(): void;
        unsubscribe(subscription: EventSubscription<T>): void;
        private _call(fnName, ...args);
    }
    export class EventSubscription<T> {
        emitter: EventEmitter<T>;
        private _subscriber;
        private _complete;
        private _error;
        subscriber: (value?: T) => void;
        complete: () => void;
        error: (error: any) => void;
        isSubscribed: boolean;
        constructor(emitter: EventEmitter<T>, generatorOrNext?: (value?: T) => void, error?: () => void, complete?: (error: any) => void);
        unsubscribe(): void;
    }
}
declare module "render/parser/expression_parser/executable" {
    export class Executable {
        private _executableFn;
        private _contexts;
        constructor(expression: string, requestContextForToken: (token: string) => Function | Object);
        execute(): any;
    }
}
declare module "render/parser/expression_parser/parser" {
    import { Executable } from "render/parser/expression_parser/executable";
    export class ExpressionParser {
        private expession;
        constructor(expession: string);
        parse(requestContextForToken: (token: string) => Function | Object): Executable;
    }
}
declare module "render/parser/hooks/event" {
    import { ContextTree } from "render/parser/context";
    import { ParserAttributeHook } from "render/parser/hooks/hooks";
    export class EventParserHook extends ParserAttributeHook {
        removeAttributeNode: boolean;
        constructor();
        predicate(attribute: Attr): boolean;
        onAfterParse(element: Element, attribute: Attr, context: ContextTree): void;
    }
}
declare module "render/parser/hooks/binding" {
    import { ContextTree } from "render/parser/context";
    import { ParserAttributeHook } from "render/parser/hooks/hooks";
    export class BindingParserHook extends ParserAttributeHook {
        removeAttributeNode: boolean;
        constructor();
        predicate(attribute: Attr): boolean;
        onParse(element: Element, attribute: Attr, context: ContextTree): void;
    }
}
declare module "render/parser/hooks/template_variable" {
    import { ContextTree } from "render/parser/context";
    import { ParserAttributeHook } from "render/parser/hooks/hooks";
    export class TemplateVariableParserHook extends ParserAttributeHook {
        removeAttributeNode: boolean;
        constructor();
        predicate(attribute: Attr): boolean;
        onParse(element: Element, attribute: Attr, context: ContextTree): void;
    }
}
declare module "render/parser/parser" {
    import { ComponentResolver } from "core/component/resolver";
    export class Parser {
        private _domParser;
        constructor(resolver: ComponentResolver);
        parse(root: Element, context?: any, skipRootElement?: boolean): void;
    }
}
declare module "core/view/factory" {
    import { ClassType } from "utils/class/class";
    import { View } from "core/view/view";
    export class ViewFactory<V extends View> {
        private _viewType;
        constructor(viewType: ClassType<V>);
        create(element: Element): V;
    }
}
declare module "core/change_detection/change_detector" {
    export abstract class ChangeDetector {
        abstract markForCheck(): void;
        abstract detach(): void;
        abstract detectChanges(): void;
        abstract checkNoChanges(): void;
        abstract reattach(): void;
    }
}
declare module "core/change_detection/constants" {
    /**
     * Describes within the change detector which strategy will be used the next time change
     * detection is triggered.
     * @stable
     */
    export enum ChangeDetectionStrategy {
        /**
         * `OnPush` means that the change detector's mode will be set to `CheckOnce` during hydration.
         */
        OnPush = 0,
        /**
         * `Default` means that the change detector's mode will be set to `CheckAlways` during hydration.
         */
        Default = 1,
    }
    /**
     * Describes the status of the detector.
     */
    export enum ChangeDetectorStatus {
        /**
         * `CheckedOnce` means that after calling detectChanges the mode of the change detector
         * will become `Checked`.
         */
        CheckOnce = 0,
        /**
         * `Checked` means that the change detector should be skipped until its mode changes to
         * `CheckOnce`.
         */
        Checked = 1,
        /**
         * `CheckAlways` means that after calling detectChanges the mode of the change detector
         * will remain `CheckAlways`.
         */
        CheckAlways = 2,
        /**
         * `Detached` means that the change detector sub tree is not a part of the main tree and
         * should be skipped.
         */
        Detached = 3,
        /**
         * `Errored` means that the change detector encountered an error checking a binding
         * or calling a directive lifecycle method and is now in an inconsistent state. Change
         * detectors in this state will no longer detect changes.
         */
        Errored = 4,
        /**
         * `Destroyed` means that the change detector is destroyed.
         */
        Destroyed = 5,
    }
    /**
     * List of possible {@link ChangeDetectionStrategy} values.
     */
    export var CHANGE_DETECTION_STRATEGY_VALUES: ChangeDetectionStrategy[];
    /**
     * List of possible {@link ChangeDetectorStatus} values.
     */
    export var CHANGE_DETECTOR_STATUS_VALUES: ChangeDetectorStatus[];
    export function isDefaultChangeDetectionStrategy(changeDetectionStrategy: ChangeDetectionStrategy): boolean;
}
declare module "core/change_detection/change_detection" {
    export { ChangeDetector } from "core/change_detection/change_detector";
    export { CHANGE_DETECTION_STRATEGY_VALUES, CHANGE_DETECTOR_STATUS_VALUES, ChangeDetectionStrategy, ChangeDetectorStatus } from "core/change_detection/constants";
}
declare module "core/view/view" {
    import { HostElement } from "core/view/host";
    import { ChangeDetectorStatus } from "core/change_detection/change_detection";
    export class View {
        private _parser;
        private _rootElement;
        private _hostElement;
        private _templateVars;
        rootElement: Element;
        hostElement: HostElement;
        templateVars: {
            [key: string]: Element;
        };
        constructor(element: Element, hostElement: HostElement, cdStatus?: ChangeDetectorStatus);
        parse(): void;
        addTemplateVar(key: string, element: Element): void;
        getTemplateVar(key: string, hostLookup?: boolean): Element;
        destroy(): void;
    }
}
declare module "core/view/element" {
    export class ElementRef {
        nativeElement: any;
        constructor(nativeElement: any);
    }
}
declare module "core/view/host" {
    import { View } from "core/view/view";
    import { ElementRef } from "core/view/element";
    import { Injector } from "core/di/di";
    import { ChangeDetector, ChangeDetectorStatus } from "core/change_detection/change_detection";
    export class HostElement implements ChangeDetector {
        private _componentView;
        private _nestedViews;
        private _nativeElement;
        private _component;
        private _injector;
        private _parent;
        private _children;
        private _cdStatus;
        private _cdDefaultStatus;
        component: any;
        componentView: View;
        elementRef: ElementRef;
        injector: Injector;
        parent: HostElement;
        cdStatus: ChangeDetectorStatus;
        constructor(nativeElement: Element, parent?: HostElement, cdStatus?: ChangeDetectorStatus);
        initComponent(component: any, injector: Injector): void;
        attachView(view: View, viewIndex: number): void;
        registerChild(childHost: HostElement): void;
        parseView(viewIndex?: number): void;
        parse(): void;
        getView(viewIndex?: number): View;
        markForCheck(): void;
        detach(): void;
        detectChanges(): void;
        detectChildChanges(): void;
        checkNoChanges(): void;
        reattach(): void;
    }
}
declare module "core/component/reference" {
    import { ClassType } from "utils/class/class";
    import { HostElement } from "core/view/host";
    import { Injector } from "core/di/di";
    export class ComponentReference<C> {
        private _hostElement;
        private _componentType;
        constructor(hostElement: HostElement, componentType: ClassType<C>);
        hostElement: HostElement;
        instance: C;
        injector: Injector;
        componentType: ClassType<C>;
        parse(): void;
        destroy(): void;
    }
}
declare module "core/component/factory" {
    import { ClassType } from "utils/class/class";
    import { ComponentReference } from "core/component/reference";
    import { Injector } from "core/di/di";
    export class ComponentFactory<C> {
        private _componentType;
        constructor(componentType: ClassType<C>);
        componentType: ClassType<C>;
        create(injector: Injector, nativeElement: Element): ComponentReference<C>;
    }
}
declare module "core/component/component" {
    export * from "core/component/decorators";
    export * from "core/component/factory";
    export * from "core/component/metadata";
    export * from "core/component/reference";
    export * from "core/component/resolver";
}
declare module "core/application/application" {
    import { ClassType } from "utils/utils";
    import { Injector, Provider } from "core/di/di";
    import { ComponentFactory, ComponentReference } from "core/component/component";
    export var DEFAULT_PROVIDERS: Provider[];
    export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | {
        [key: string]: any;
    }>, root?: Element): Application;
    export function bootstrap<C>(appComponentType: ClassType<C>, root?: HTMLElement): Application;
    export class Application {
        private _appComponent;
        private _injector;
        injector: Injector;
        appComponent: ComponentReference<any>;
        constructor(injector: Injector);
        bootstrap<C>(componentOrFactory: ComponentFactory<C> | ClassType<C>, root?: Element): ComponentReference<C>;
        tick(): void;
    }
}
declare module "core/lifecycle/lifecycle_hooks" {
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
declare module "core/core" {
    export { bootstrap, Application } from "core/application/application";
    export * from "core/lifecycle/lifecycle_hooks";
    export { Component, Input, Output } from "core/component/decorators";
    export { ElementRef } from "core/view/element";
    export { HostElement } from "core/view/host";
    export * from "core/di/di";
    export { EventEmitter } from "core/async/events";
}
declare module "mojito/core" {
    export * from "core/core";
}
declare module "mojito/debug" {
    export * from "debug/debug";
}
declare module "mojito/utils" {
    export * from "utils/utils";
}
