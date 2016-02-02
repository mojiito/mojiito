import { assert } from './../../debug/assert/assert';
import { get } from '../get/get';
import { set } from '../set/set';
import { Meta } from '../meta/meta';
import { Observable, Observer } from '../observer/observer';

/**
 * Extends the native Object by observers, computed properties 
 * and many more mojito features.
 * 
 * Usage:
 * ````
 * let a = new Mojito.Object();
 * // or
 * let b = Mojito.Object.create();
 * ````
 * 
 * It's also possible to provide an object to the constructer.
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
 * @class CoreObject
 */
export class CoreObject extends Observable {

    constructor(obj?: Object) {

        super();
        console.time('create CoreObject');
        // extend the CoreObject with a Meta hash
        Meta.extend(this);
        
        // defineProperties if an obj is provided
        if (!!obj) {
            CoreObject.defineProperties(this, obj);
        }
        console.timeEnd('create CoreObject');
    }

    /**
     * Retrieves the value of a property from the object.
     * 
     * @param  {string} propertyName
     * @returns any
     */
    get(propertyName: string): any {
        get(this, propertyName);
    }
    
    /**
     * Sets the provided key or path on the object to the value.
     * 
     * @param  {string} propertyName
     * @param  {any} value
     * @returns any
     */
    set(propertyName: string, value: any): any {
        set(this, propertyName, value);
    }
    
    /**
     * Static method to provide functionality for `CoreObject.create()`
     * 
     * @param  {Object} obj
     * @returns CoreObject
     */
    static create(obj?: Object): CoreObject {
        return new CoreObject(obj);
    }

    static defineProperty(sourceObject: Object, propertyName: string, value?: any): void {
        assert(arguments.length === 2 || arguments.length === 3, 'defineProperty must be called with at least two arguments; a sourceObject, a propertyName and optional a value');
        assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperty method must be an object', TypeError);
        assert(typeof propertyName === 'string', 'The property propertyName to the defineProperty method must be a string', TypeError);
        assert(!(value instanceof Meta), 'Defining a meta hash is not allowed');
        
        // create the property if it is not already defined
        if (!CoreObject.hasDefinedProperty(sourceObject, propertyName)) {
            Object.defineProperty(sourceObject, propertyName, {
                get() {
                    return Meta.peek(sourceObject).getProperty('values', propertyName);
                },

                set(value) {
                    Meta.peek(sourceObject).setProperty('values', propertyName, value);
                }
            });
        }
        
        // needed for enabled noImplicitAny
        const source: any = sourceObject;
        
        // set the new value if provided
        if (!!value) {
            source[propertyName] = value;
        }
    }

    static hasDefinedProperty(sourceObject: Object, propertyName: string): boolean {
        assert(arguments.length === 2, 'hasDefinedProperty must be called with two arguments; a sourceObject and a propertyName');
        assert(typeof sourceObject === 'object', 'The sourceObject provided to the hasDefinedProperty method must be an object', TypeError);
        assert(typeof propertyName === 'string', 'The propertyName provided to the hasDefinedProperty method must be a string', TypeError);

        return sourceObject.hasOwnProperty(propertyName) && Meta.peek(sourceObject).hasProperty('values', propertyName)
    }
    
    /**
     * Defines all the properties provided in a propertyMap
     * on the sourceObject.
     * Usage:
     * `````
     * let sourceObject = {};
     * Mojito.Object.defineProperty(sourceObject, { a: 1, b: true});
     * // sourceObject { a: 1, b: true }
     * `````
     * 
     * @method defineProperties
     * @param  {Object} sourceObject
     * @param  {Object} propertyMap
     * @returns CoreObject
     */
    static defineProperties(sourceObject: Object, propertyMap?: Object): Object {
        assert(arguments.length === 1 || arguments.length === 2, 'defineProperties must be called with at least one arguments; a sourceObject and optional a propertyMap');
        assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperties method must be an object', TypeError);
        assert(typeof propertyMap === 'undefined' || typeof propertyMap === 'object', 'The propertyMap provided to the defineProperties method must be an object', TypeError);
        
        if (propertyMap) {
            CoreObject.defineProperties(sourceObject);
        }
        
        // needed for enabled noImplicitAny
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
}