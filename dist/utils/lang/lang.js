"use strict";
/**
 * Check if value is an array (not object)
 *
 * @function isArray
 * @param  {any} value
 * @returns boolean
 */
function isArray(value) {
    return Array.isArray ? Array.isArray(value) : Object.prototype.toString.call(value) === '[object Array]';
}
exports.isArray = isArray;
/**
 * Check if value is an object (not array)
 *
 * @function isObject
 * @param  {any} value
 * @returns boolean
 */
function isObject(value) {
    return !isArray(value) && !isNull(value) && typeof value === 'object';
}
exports.isObject = isObject;
/**
 * Check if value is a boolean
 *
 * @function isBoolean
 * @param  {any} value
 * @returns boolean
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
/**
 * Check if value is a number (int or float)
 *
 * @function isNumber
 * @param  {any} value
 * @returns boolean
 */
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
exports.isNumber = isNumber;
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
function isFloat(value) {
    return isNumber(value) && value % 1 !== 0;
}
exports.isFloat = isFloat;
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
function isInt(value) {
    return isNumber(value) && value % 1 === 0;
}
exports.isInt = isInt;
/**
 * Check if value is a string
 *
 * @function isString
 * @param  {any} value
 * @returns boolean
 */
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
/**
 * Check if value is a function
 *
 * @function isFunction
 * @param  {any} value
 * @returns boolean
 */
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
/**
 * Check if value is a symbol
 *
 * @function isSymbol
 * @param  {any} value
 * @returns boolean
 */
function isSymbol(value) {
    return typeof value === 'symbol';
}
exports.isSymbol = isSymbol;
/**
 * Check if value is defined
 *
 * @function isDefined
 * @param  {any} value
 * @returns boolean
 */
function isDefined(value) {
    return typeof value !== 'undefined';
}
exports.isDefined = isDefined;
/**
 * Check if value is `null`
 *
 * @function isNull
 * @param  {any} value
 * @returns boolean
 */
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
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
function isEmpty(value) {
    if (isArray(value) || isString(value)) {
        return !value.length;
    }
    else if (isNull(value) || !isDefined(value)) {
        return true;
    }
    return false;
}
exports.isEmpty = isEmpty;
function isPresent(value) {
    return value !== undefined && value !== null;
}
exports.isPresent = isPresent;
function isBlank(value) {
    return value === undefined || value === null;
}
exports.isBlank = isBlank;
function getMapKey(value) {
    return value;
}
exports.getMapKey = getMapKey;
function looseIdentical(a, b) {
    return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}
exports.looseIdentical = looseIdentical;
var _symbolIterator = null;
function getSymbolIterator() {
    if (isBlank(_symbolIterator)) {
        if (isPresent(window.Symbol) && isPresent(Symbol.iterator)) {
            _symbolIterator = Symbol.iterator;
        }
        else {
            // es6-shim specific logic
            var keys = Object.getOwnPropertyNames(Map.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (key !== 'entries' && key !== 'size' &&
                    Map.prototype[key] === Map.prototype['entries']) {
                    _symbolIterator = key;
                }
            }
        }
    }
    return _symbolIterator;
}
exports.getSymbolIterator = getSymbolIterator;
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
function isPrimitive(value) {
    // we use typeof value === 'number' because of NaN
    return isString(value) || isSymbol(value) || isBoolean(value) || !isDefined(value) || isNull(value) || typeof value === 'number';
}
exports.isPrimitive = isPrimitive;
/**
 * Typeof proxy function for real array detection
 *
 * @function typeOf
 * @param  {any} value
 * @returns string
 */
function typeOf(value) {
    if (isArray(value)) {
        return 'array';
    }
    if (isNull(value)) {
        return 'null';
    }
    return typeof value;
}
exports.typeOf = typeOf;
//# sourceMappingURL=lang.js.map