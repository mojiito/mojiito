import assert from './../../debug/assert/assert';

/**
 * Gets the value of a property on an object. If the property is computed,
 * the function will be invoked. If the property is not defined this method
 * will return `undefined`. 
 * If the object itself is `undefined`, this method will throw an error.
 * The propertyName can also be a path (e.g. `y.m.c.a`)
 * 
 * @function meta
 * @param  {Object} obj
 * @param  {string} key
 * @returns any
 */
export default function get(obj: Object, propertyName: string): any {
    assert(arguments.length === 2, 'Get must be called with two arguments; an object and a property name');
    assert(typeof obj !== 'undefined', 'Cannot call get on an undefined object', TypeError);
    assert(typeof obj === 'object', 'The first argument of the get method has be an object', TypeError);
    assert(typeof propertyName === 'string', 'The key provided to get method must be a string', TypeError);

    const source: any = obj;  // needed for enabled noImplicitAny    
    const properties = propertyName.split('.');
    const property = properties.slice(0, 1)[0];

    if (property in obj) {
        return properties.length === 1 ? source[property] : get(source[property], properties.slice(1).join('.'));
    }

    if (properties.length === 1) {
        // TODO: Invoke computed property function here
    }

    return undefined;
}
