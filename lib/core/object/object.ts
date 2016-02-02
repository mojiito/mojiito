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
        
        // extend the CoreObject with a Meta hash
        Meta.extend(this);
        
        // defineProperties if an obj is provided
        if (!!obj) {
            CoreObject.defineProperties(this, obj);
        }
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
    static defineProperties(sourceObject: Object, propertyMap: Object): CoreObject {
        assert(arguments.length === 2, 'defineProperties must be called with two arguments; a sourceObject and a propertyMap');
        assert(typeof sourceObject === 'object', 'The sourceObject provided to the defineProperties method must be an object', TypeError);
        assert(typeof propertyMap === 'object', 'The propertyMap provided to the defineProperties method must be an object', TypeError);
        
        // needed for enabled noImplicitAny
        const source: any = sourceObject;
        const properties: any = propertyMap;

        // replace every property with a defined one
        for (var key in properties) {
            if (properties.hasOwnProperty(key) && !(properties[key] instanceof Meta) && !Meta.peek(source).hasProperty('values', key)) {
                Object.defineProperty(source, key, {
                    get() {
                        return Meta.peek(source).getProperty('values', key);
                    },

                    set(value) {
                        Meta.peek(source).setProperty('values', key, value);
                    }
                });

                source[key] = properties[key];
            }
        }

        return source;
    }
}