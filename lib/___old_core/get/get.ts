import { assert } from './../../debug/debug';

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
export function get(obj: Object, propertyName: string): any {
    assert(arguments.length === 2, 'Get must be called with two arguments; an object and a property name');
    assert(typeof obj !== 'undefined', 'Cannot call get on an undefined object', TypeError);
    assert(typeof obj === 'object' || typeof obj === 'function', 'The first argument of the get method has be an object or a function', TypeError);
    assert(typeof propertyName === 'string', 'The key provided to get method must be a string', TypeError);

    const source: any = obj;  // needed for enabled noImplicitAny    
    const properties = propertyName.split('.');
    const property = properties.slice(0, 1)[0];

    if (property in obj) {
        return properties.length === 1 ? source[property] : get(source[property], properties.slice(1).join('.'));
    }

    return undefined;
}
