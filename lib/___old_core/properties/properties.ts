import { assert } from './../../debug/debug';
import { Meta } from '../meta/meta';
import { IIterableObject } from '../iterator/iterator';
import { mandatory_set } from './mandatory_set';

/**
 * (description)
 * 
 * @export
 * @param {Object} obj (description)
 * @param {string} propertyName (description)
 * @param {*} [value] (description)
 * @returns (description)
 */
export function defineProperty(obj: Object, propertyName: string, value?: any) {
    assert(arguments.length === 2 || arguments.length === 3, 'defineProperty must be called with at least two arguments; an object, a propertyName and optional a value');
    assert(typeof obj === 'object', 'The obj provided to the defineProperty function must be an object', TypeError);
    assert(typeof propertyName === 'string', 'The propertyName provided to the defineProperty method must be a string', TypeError);
    assert(!(value instanceof Meta), 'Defining a meta hash is not allowed');

    if (!isDefinedProperty(obj, propertyName)) {
        if (typeof value === 'undefined' && typeof (<IIterableObject>obj)[propertyName] !== 'undefined') {
            value = (<IIterableObject>obj)[propertyName];
        }
        if (typeof value !== 'undefined') {
            Meta.peek(obj).setProperty('values', propertyName, value);
        }
        Object.defineProperty(obj, propertyName, {
            configurable: false,
            get() {
                return Meta.peek(obj).getProperty('values', propertyName);
            },
            set(value) {
                mandatory_set(obj, propertyName, value);
            }
        });
    } else if (typeof value !== 'undefined') {
        (<IIterableObject>obj)[propertyName] = value;
    }
}

/**
 * Checks if property is already defined by mojito's 
 * defineProperty method.
 *
 * @export
 * @param {Object} obj The object where to look for the defined property
 * @param {string} propertyName The name(key) of the defined property
 * @returns {boolean} true if property is defined, false if not
 */
export function isDefinedProperty(obj: Object, propertyName: string): boolean {
    assert(arguments.length === 2, 'isDefinedProperty must be called with two arguments; a obj and a propertyName');
    assert(typeof obj === 'object', 'The obj provided to the isDefinedProperty method must be an object', TypeError);
    assert(typeof propertyName === 'string', 'The propertyName provided to the isDefinedProperty method must be a string', TypeError);

    return obj.hasOwnProperty(propertyName) && Meta.peek(obj).hasProperty('values', propertyName)
}