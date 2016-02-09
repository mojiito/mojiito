import { assert } from './../../debug/debug';
import { CoreObject } from '../object/object';

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
export function set(obj: Object, propertyName: string, value: any): any {
    assert(arguments.length === 3, 'Get must be called with three arguments; an object, a property name and a value');
    assert(typeof obj !== 'undefined', 'Cannot call set on an undefined object', TypeError);
    assert(typeof obj === 'object', 'The first argument of the get method has be an object', TypeError);
    assert(typeof propertyName === 'string', 'The key provided to get method must be a string', TypeError);
    assert(typeof value !== 'undefined', 'Cannot call set with an `undefined` value ', TypeError);

    const source: any = obj; // needed for enabled noImplicitAny    
    const properties = propertyName.split('.');
    const property = properties.slice(0, 1)[0];
    
    if (obj instanceof CoreObject) {
        CoreObject.defineProperties(obj);
    }

    if (properties.length === 1) {
        if (obj instanceof CoreObject) {
            CoreObject.defineProperty(obj, property, value);
        } else {
            source[property] = value;
        }
        return value;
    }

    if (!(property in obj)) {
        // if property is `undefined` create an object to fullfil the path
        source[property] = CoreObject.create();
    } else if (typeof source[property] !== 'object') {
        throw new TypeError('The property in the path has to be an object ');
    }

    return set(source[property], properties.slice(1).join('.'), value);
}
