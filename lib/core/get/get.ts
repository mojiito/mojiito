import assert from './../../debug/assert/assert';

/**
 * Gets the value of a property on an object. If the property is computed,
 * the function will be invoked. If the property is not defined this method
 * will return `undefined`. 
 * If the object itself is `undefined`, this method will throw an error.
 * 
 * @param  {Object} obj
 * @param  {string} key
 * @returns any
 */
export default function get(obj: Object, propertyName: string): any {
    assert(typeof obj === 'object', 'The first param has be an object', TypeError);
    
    const properties = propertyName.split('.');
    const property = properties.slice(0, 1)[0];
    
    if (property in obj) {
        return properties.length === 1 ? obj[property] : get(obj[property], properties.slice(1).join('.'));
    }
    
    if(properties.length === 1) {
        // TODO: Invoke computed property function here
    }
    
    return undefined;
}
