import { assert } from './../../debug/debug';
import { get } from '../get/get';
import { set } from '../set/set';
import { Meta } from '../meta/meta';
import { Observable, Observer } from '../observer/observer';

const INSTANCE_CALLBACKS_FIELD = '__mojito_instance_callbacks__';

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
    constructor(obj?: Object) {
        assert(this instanceof CoreObject, 'A class can only be instantiated with `new`');
        assert(typeof obj === 'object' || typeof obj === 'undefined', 'The object when provided to the constructor method must be an object', TypeError);
        
        // extend the CoreObject with a Meta hash
        Meta.extend(this);

        // defineProperties if an obj is provided
        CoreObject.defineProperties(this, obj);
        
        // apply all instance callbacks added by decorators
        CoreObject._applyInstanceCallbacks(this);
    }
    
    /**
     * Retrieves the value of a property from the object.
     * 
     * @param {string} propertyName The name(key) of the property
     * @returns {*} Value of the property
     */
    get(propertyName: string): any {
        assert(arguments.length === 1, 'get must be called with one argument; a propertyName');
        assert(typeof propertyName === 'string', 'The propertyName to the get method must be a string', TypeError);
        return get(this, propertyName);
    }
    
    /**
     * Sets the provided key or path on the object to the value.
     * 
     * @param {string} propertyName The name(key) of the property
     * @param {*} value Value to be set on the property
     * @returns {*} Value which has been set on the property
     */
    set(propertyName: string, value: any): any {
        assert(arguments.length === 2, 'set must be called with two arguments; a propertyName and value');
        assert(typeof propertyName === 'string', 'The propertyName to the set method must be a string', TypeError);
        return set(this, propertyName, value);
    }
    
    /**
     * Static method to provide functionality for `CoreObject.create()`
     * 
     * @static
     * @param {Object} [obj] Object or property map to define properties
     * @returns {CoreObject} Newly created CoreObject
     */
    static create(obj?: Object): CoreObject {
        assert(typeof obj === 'object' || typeof obj === 'undefined', 'The object when provided to the create method must be an object', TypeError);
        return new CoreObject(obj);
    }
    /**
     * Custom defineProperty method for handling observers, 
     * computed propertiese, ...
     * 
     * @static
     * @param {CoreObject} sourceObject The object where to define the property
     * @param {string} propertyName The name(key) of the property to be defined
     * @param {*} [value] The value to be set on the property
     */
    static defineProperty(sourceObject: CoreObject, propertyName: string, value?: any): void {
        assert(arguments.length === 2 || arguments.length === 3, 'defineProperty must be called with at least two arguments; a sourceObject, a propertyName and optional a value');
        assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperty method must be an object', TypeError);
        assert(typeof propertyName === 'string', 'The property propertyName to the defineProperty method must be a string', TypeError);
        assert(!(value instanceof Meta), 'Defining a meta hash is not allowed');
        
        // create the property if it is not already defined
        if (!CoreObject.isDefinedProperty(sourceObject, propertyName)) {
            Object.defineProperty(sourceObject, propertyName, {
                get() {
                    return Meta.peek(sourceObject).getProperty('values', propertyName);
                },

                set(newValue: any) {
                    const meta: Meta = Meta.peek(sourceObject);
                    const oldValue: any = meta.getProperty('values', propertyName);
                    const observers: Observer[] = meta.getProperty('observers', propertyName);
                    meta.setProperty('values', propertyName, newValue);
                    if (Array.isArray(observers)) {
                        observers.forEach(function(observer: Observer) {
                            // only notify observer if value has changed
                            if (newValue !== oldValue) {
                                observer.notify(newValue, oldValue);
                            }
                        });
                    }
                }
            });
        }
        
        // needed for enabled noImplicitAny
        const source: any = sourceObject;
        
        // set the new value if provided
        if (typeof value !== 'undefined') {
            source[propertyName] = value;
        }
    }
    
    /**
     * Checks if property is already defined by mojito's 
     * defineProperty method.
     * 
     * @static
     * @param {CoreObject} sourceObject The object where to look for the property
     * @param {string} propertyName The name(key) of the defined property
     * @returns {boolean} true if property is defined, false if not
     */
    static isDefinedProperty(sourceObject: CoreObject, propertyName: string): boolean {
        assert(arguments.length === 2, 'isDefinedProperty must be called with two arguments; a sourceObject and a propertyName');
        assert(typeof sourceObject === 'object', 'The sourceObject provided to the isDefinedProperty method must be an object', TypeError);
        assert(typeof propertyName === 'string', 'The propertyName provided to the isDefinedProperty method must be a string', TypeError);

        return sourceObject.hasOwnProperty(propertyName) && Meta.peek(sourceObject).hasProperty('values', propertyName)
    }
    
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
    static defineProperties(sourceObject: CoreObject, propertyMap?: Object): CoreObject {
        assert(arguments.length === 1 || arguments.length === 2, 'defineProperties must be called with at least one arguments; a sourceObject and optional a propertyMap');
        assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperties method must be an object', TypeError);
        assert(typeof propertyMap === 'undefined' || typeof propertyMap === 'object', 'The propertyMap provided to the defineProperties method must be an object', TypeError);
        
        if (propertyMap) {
            CoreObject.defineProperties(sourceObject);
        }
        
        const properties: any = !!propertyMap ? propertyMap : sourceObject;
        
        // replace every property with a defined one
        for (var key in properties) {
            let value = properties[key];

            // defining Meta not allowed, skip it            
            if (value instanceof Meta) {
                continue;
            }
            
            // skip instance callbacks          
            if (key === INSTANCE_CALLBACKS_FIELD) {
                continue;
            }
            
            // functions directly on the sourceObject object can't be defined
            if (!propertyMap && typeof value === 'function') {
                continue;
            }
            
            CoreObject.defineProperty(sourceObject, key, value);
        }
        
        return sourceObject;
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