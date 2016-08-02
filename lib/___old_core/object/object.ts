import { assert } from './../../debug/debug';
import { get } from '../get/get';
import { set, setProperties } from '../set/set';
import { defineProperty, isDefinedProperty } from '../properties/properties';
import { Meta } from '../meta/meta';
import { IIterableObject } from '../iterator/iterator';

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
    constructor(obj?: Object) {
        assert(this instanceof CoreObject, 'A class can only be instantiated with `new`');
        assert(typeof obj === 'object' || typeof obj === 'undefined', 'The object when provided to the constructor method must be an object', TypeError);

        setProperties(this, obj);
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
     * Returns the Meta hash of this CoreObject
     * 
     * @returns {Meta} The Meta hash/map
     */
    getMeta(): Meta {
        return Meta.peek(this);
    }
    
    /**
     * Static method to provide functionality for `CoreObject.create()`
     * 
     * @static
     * @param {Object} [obj] Object or property map to define properties
     * @returns {CoreObject} Newly created CoreObject
     */
    static create(obj?: Object): any {
        assert(typeof obj === 'object' || typeof obj === 'undefined', 'The object when provided to the create method must be an object', TypeError);
        return new this(obj);
    }

    /**
     * Custom defineProperty method for change detection
     * 
     * @static
     * @param {CoreObject} sourceObject The object where to define the property
     * @param {string} propertyName The name(key) of the property to be defined
     * @param {*} [value] The value to be set on the property
     */
    static defineProperty(sourceObject: CoreObject, propertyName: string, value?: any): void {
        assert(arguments.length === 2 || arguments.length === 3, 'defineProperty must be called with at least two arguments; a sourceObject, a propertyName and optional a value');
        assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperty method must be an object', TypeError);
        assert(typeof propertyName === 'string', 'The propertyName provided to the defineProperty method must be a string', TypeError);
        assert(!(value instanceof Meta), 'Defining a meta hash is not allowed');

        defineProperty(sourceObject, propertyName, value);
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
            
            // functions directly on the sourceObject object can't be defined
            if (!propertyMap && typeof value === 'function') {
                continue;
            }
            
            CoreObject.defineProperty(sourceObject, key, value);
        }
        
        return sourceObject;
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

        return isDefinedProperty(sourceObject, propertyName);
    }
}