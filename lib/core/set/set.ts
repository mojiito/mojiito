import assert from './../../debug/assert/assert';

/**
 * Sets the value of a property on an object, respecting computed properties
 * and notifying observers and other listeners of the change.
 * If the object itself is `undefined`, this method will throw an error.
 * The propertyName can also be a path (e.g. `y.m.c.a`)
 * 
 * @param  {Object} obj
 * @param  {string} key
 * @param  {any} value
 * @returns any
 */
export default function set(obj: Object, propertyName: string, value: any): any {
    assert(arguments.length === 3, 'Get must be called with three arguments; an object, a property name and a value');
    assert(typeof obj !== 'undefined', 'Cannot call set on an undefined object', TypeError);
    assert(typeof obj === 'object', 'The first argument of the get method has be an object', TypeError);
    assert(typeof propertyName === 'string', 'The key provided to get method must be a string', TypeError);
    assert(typeof value !== 'undefined', 'Cannot call set with an `undefined` value ', TypeError);

    const properties = propertyName.split('.');
    const property = properties.slice(0, 1)[0];

    if (properties.length === 1) {
        obj[property] = value;
        // TODO: Notify observer and listeners
        return value;
    }

    if (!(property in obj)) {
        // if property is `undefined` create an object to fullfil the path
        obj[property] = {};
    } else if (typeof obj[property] !== 'object') {
        throw new TypeError('The property in the path has to be an object ');
    }

    return set(obj[property], properties.slice(1).join('.'), value);
}
