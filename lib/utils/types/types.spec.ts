/// <reference path="../../../typings/main.d.ts" />

import {
isArray,
isObject,
isBoolean,
isNumber,
isFloat,
isInt,
isString,
isFunction,
isSymbol,
isDefined,
isNull,
isEmpty,
isPrimitive,
typeOf
} from './types';

describe('isArray', () => {
    it('should be true if value is an array', () => {
        expect(typeof isArray).toBe('function');
        expect(isArray({})).toBeFalsy();
        expect(isArray(new Object())).toBeFalsy();
        expect(isArray([])).toBeTruthy();
        expect(isArray(new Array())).toBeTruthy();
        expect(isArray(1)).toBeFalsy();
        expect(isArray('asdf')).toBeFalsy();
        expect(isArray(function() { })).toBeFalsy();
        expect(isArray(false)).toBeFalsy();
    });
})