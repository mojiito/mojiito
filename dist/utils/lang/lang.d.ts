/**
 * Check if value is an array (not object)
 *
 * @function isArray
 * @param  {any} value
 * @returns boolean
 */
export declare function isArray(value: any): boolean;
/**
 * Check if value is an object (not array)
 *
 * @function isObject
 * @param  {any} value
 * @returns boolean
 */
export declare function isObject(value: any): boolean;
/**
 * Check if value is a boolean
 *
 * @function isBoolean
 * @param  {any} value
 * @returns boolean
 */
export declare function isBoolean(value: any): boolean;
/**
 * Check if value is a number (int or float)
 *
 * @function isNumber
 * @param  {any} value
 * @returns boolean
 */
export declare function isNumber(value: any): boolean;
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
export declare function isFloat(value: any): boolean;
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
export declare function isInt(value: any): boolean;
/**
 * Check if value is a string
 *
 * @function isString
 * @param  {any} value
 * @returns boolean
 */
export declare function isString(value: any): boolean;
/**
 * Check if value is a function
 *
 * @function isFunction
 * @param  {any} value
 * @returns boolean
 */
export declare function isFunction(value: any): boolean;
/**
 * Check if value is a symbol
 *
 * @function isSymbol
 * @param  {any} value
 * @returns boolean
 */
export declare function isSymbol(value: any): boolean;
/**
 * Check if value is defined
 *
 * @function isDefined
 * @param  {any} value
 * @returns boolean
 */
export declare function isDefined(value: any): boolean;
/**
 * Check if value is `null`
 *
 * @function isNull
 * @param  {any} value
 * @returns boolean
 */
export declare function isNull(value: any): boolean;
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
export declare function isEmpty(value: any): boolean;
export declare function isPresent(value: any): boolean;
export declare function isBlank(value: any): boolean;
export declare function getMapKey<T>(value: T): T;
export declare function looseIdentical(a: any, b: any): boolean;
export declare function getSymbolIterator(): string | symbol;
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
export declare function isPrimitive(value: any): boolean;
/**
 * Typeof proxy function for real array detection
 *
 * @function typeOf
 * @param  {any} value
 * @returns string
 */
export declare function typeOf(value: any): string;
