/**
 * Check if value is an array (not object)
 * 
 * @function isArray
 * @param  {any} value
 * @returns boolean
 */
export function isArray(value: any): boolean {
    return Array.isArray ? Array.isArray(value) : Object.prototype.toString.call(value) === '[object Array]';
}

/**
 * Check if value is an object (not array)
 * 
 * @function isObject
 * @param  {any} value
 * @returns boolean
 */
export function isObject(value: any): boolean {
    return !isArray(value) && !isNull(value) && typeof value === 'object';
}

/**
 * Check if value is a boolean
 * 
 * @function isBoolean
 * @param  {any} value
 * @returns boolean
 */
export function isBoolean(value: any): boolean {
    return typeof value === 'boolean';
}

/**
 * Check if value is a number (int or float)
 * 
 * @function isNumber
 * @param  {any} value
 * @returns boolean
 */
export function isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is a float
 *
 * isFloat(0)       // false
 * isFloat(1)       // false
 * isFloat(1.1)     // true
 * isInt(-1)        // false
 * isInt(-1.1)      // true
 * 
 * @function isFloat
 * @param  {any} value
 * @returns boolean
 */
export function isFloat(value: any): boolean {
    return isNumber(value) && value % 1 !== 0;
}

/**
 * Check if value is a integer
 * 
 * isInt(0)         // true
 * isInt(1)         // true
 * isInt(1.1)       // false
 * isInt(-1)        // true
 * isInt(-1.1)      // false
 * 
 * @function isInt
 * @param  {any} value
 * @returns boolean
 */
export function isInt(value: any): boolean {
    return isNumber(value) && value % 1 === 0;
}

/**
 * Check if value is a string
 * 
 * @function isString
 * @param  {any} value
 * @returns boolean
 */
export function isString(value: any): boolean {
    return typeof value === 'string';
}

/**
 * Check if value is a function
 * 
 * @function isFunction
 * @param  {any} value
 * @returns boolean
 */
export function isFunction(value: any): boolean {
    return typeof value === 'function';
}

/**
 * Check if value is a symbol
 * 
 * @function isSymbol
 * @param  {any} value
 * @returns boolean
 */
export function isSymbol(value: any): boolean {
    return typeof value === 'symbol';
}

/**
 * Check if value is defined
 * 
 * @function isDefined
 * @param  {any} value
 * @returns boolean
 */
export function isDefined(value: any): boolean {
    return typeof value !== 'undefined';
}

/**
 * Check if value is `null`
 * 
 * @function isNull
 * @param  {any} value
 * @returns boolean
 */
export function isNull(value: any): boolean {
    return value === null;
}

/**
 * Verifies that a value is `undefined`, `null` 
 * or an empty string, empty array, or an empty object
 * 
 * isEmpty();                // true
 * isEmpty(null);            // true
 * isEmpty(undefined);       // true
 * isEmpty('');              // true
 * isEmpty([]);              // true
 * isEmpty({});              // false
 * isEmpty('Adam Hawkins');  // false
 * isEmpty([0,1,2]);         // false
 * 
 * @function isEmpty
 * @param  {any} value
 * @returns boolean
 */
export function isEmpty(value: any): boolean {
    if (isArray(value) || isString(value)) {
        return !value.length
    } else if (isNull(value) || !isDefined(value)) {
        return true;
    }
    return false;
}

/**
 * Check if value is a primitive
 * 
 * isPrimitive(null)          // true
 * isPrimitive(undefined)     // true
 * isPrimitive('string')      // true
 * isPrimitive(1)             // true
 * isPrimitive(1.1)           // true
 * isPrimitive(true)          // true
 * isPrimitive([0,1,2])       // false
 * isPrimitive({})            // false
 * isPrimitive(function(){})  // false
 * 
 * @function isPrimitive
 * @param  {any} value
 * @returns boolean
 */
export function isPrimitive(value: any): boolean {
    // we use typeof value === 'number' because of NaN
    return isString(value) || isSymbol(value) || isBoolean(value) || !isDefined(value) || isNull(value) || typeof value === 'number';
}

/**
 * Typeof proxy function for real array detection
 * 
 * @function typeOf
 * @param  {any} value
 * @returns string
 */
export function typeOf(value: any): string {
    if (isArray(value)) {
        return 'array';
    }
    if (isNull(value)) {
        return 'null';
    }
    return typeof value;
}