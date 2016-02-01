/// <reference path="../../../typings/main.d.ts" />

import {isArray, isObject, isBoolean, isNumber, isFloat, isInt, isString, isFunction, isSymbol, isDefined, isNull, isEmpty, isPrimitive, typeOf } from './types';

describe('Typechecks', () => {
    describe('isArray', () => {
        it('should be true if value is an array', () => {
            expect(typeof isArray).toBe('function');
            expect(isArray({})).toBeFalsy();
            expect(isArray(new Object())).toBeFalsy();
            expect(isArray([])).toBeTruthy();
            expect(isArray(new Array())).toBeTruthy();
            expect(isObject(0)).toBeFalsy();
            expect(isObject(1)).toBeFalsy();
            expect(isObject(1.1)).toBeFalsy();
            expect(isObject(-1)).toBeFalsy();
            expect(isObject(-1.1)).toBeFalsy();
            expect(isArray('asdf')).toBeFalsy();
            expect(isArray(function() { })).toBeFalsy();
            expect(isArray(false)).toBeFalsy();
            expect(isArray(true)).toBeFalsy();
            expect(isArray(null)).toBeFalsy();
            expect(isArray(NaN)).toBeFalsy();
            expect(isArray(undefined)).toBeFalsy();
        });
    });

    describe('isObject', () => {
        it('should be true if value is an object', () => {
            expect(typeof isObject).toBe('function');
            expect(isObject({})).toBeTruthy();
            expect(isObject(new Object())).toBeTruthy();
            expect(isObject([])).toBeFalsy();
            expect(isObject(new Array())).toBeFalsy();
            expect(isObject(0)).toBeFalsy();
            expect(isObject(1)).toBeFalsy();
            expect(isObject(1.1)).toBeFalsy();
            expect(isObject(-1)).toBeFalsy();
            expect(isObject(-1.1)).toBeFalsy();
            expect(isObject('asdf')).toBeFalsy();
            expect(isObject(function() { })).toBeFalsy();
            expect(isObject(false)).toBeFalsy();
            expect(isObject(true)).toBeFalsy();
            expect(isObject(null)).toBeFalsy();
            expect(isObject(NaN)).toBeFalsy();
            expect(isObject(undefined)).toBeFalsy();
        });
    });

    describe('isBoolean', () => {
        it('should be true if value is a boolean', () => {
            expect(typeof isBoolean).toBe('function');
            expect(isBoolean({})).toBeFalsy();
            expect(isBoolean(new Object())).toBeFalsy();
            expect(isBoolean([])).toBeFalsy();
            expect(isBoolean(new Array())).toBeFalsy();
            expect(isBoolean(0)).toBeFalsy();
            expect(isBoolean(1)).toBeFalsy();
            expect(isBoolean(1.1)).toBeFalsy();
            expect(isBoolean(-1)).toBeFalsy();
            expect(isBoolean(-1.1)).toBeFalsy();
            expect(isBoolean('asdf')).toBeFalsy();
            expect(isBoolean(function() { })).toBeFalsy();
            expect(isBoolean(false)).toBeTruthy();
            expect(isBoolean(true)).toBeTruthy();
            expect(isBoolean(null)).toBeFalsy();
            expect(isBoolean(NaN)).toBeFalsy();
            expect(isBoolean(undefined)).toBeFalsy();
        });
    });

    describe('isNumber', () => {
        it('should be true if value is a number', () => {
            expect(typeof isNumber).toBe('function');
            expect(isNumber({})).toBeFalsy();
            expect(isNumber(new Object())).toBeFalsy();
            expect(isNumber([])).toBeFalsy();
            expect(isNumber(new Array())).toBeFalsy();
            expect(isNumber(0)).toBeTruthy();
            expect(isNumber(1)).toBeTruthy();
            expect(isNumber(1.1)).toBeTruthy();
            expect(isNumber(-1)).toBeTruthy();
            expect(isNumber(-1.1)).toBeTruthy();
            expect(isNumber('asdf')).toBeFalsy();
            expect(isNumber(function() { })).toBeFalsy();
            expect(isNumber(false)).toBeFalsy();
            expect(isNumber(true)).toBeFalsy();
            expect(isNumber(null)).toBeFalsy();
            expect(isNumber(NaN)).toBeFalsy();
            expect(isNumber(undefined)).toBeFalsy();
        });
    });

    describe('isFloat', () => {
        it('should be true if value is a float ', () => {
            expect(typeof isFloat).toBe('function');
            expect(isFloat({})).toBeFalsy();
            expect(isFloat(new Object())).toBeFalsy();
            expect(isFloat([])).toBeFalsy();
            expect(isFloat(new Array())).toBeFalsy();
            expect(isFloat(0)).toBeFalsy();
            expect(isFloat(1)).toBeFalsy();
            expect(isFloat(1.1)).toBeTruthy();
            expect(isFloat(-1)).toBeFalsy();
            expect(isFloat(-1.1)).toBeTruthy();
            expect(isFloat('asdf')).toBeFalsy();
            expect(isFloat(function() { })).toBeFalsy();
            expect(isFloat(false)).toBeFalsy();
            expect(isFloat(true)).toBeFalsy();
            expect(isFloat(null)).toBeFalsy();
            expect(isFloat(NaN)).toBeFalsy();
            expect(isFloat(undefined)).toBeFalsy();
        });
    });

    describe('isInt', () => {
        it('should be true if value is an integer ', () => {
            expect(typeof isInt).toBe('function');
            expect(isInt({})).toBeFalsy();
            expect(isInt(new Object())).toBeFalsy();
            expect(isInt([])).toBeFalsy();
            expect(isInt(new Array())).toBeFalsy();
            expect(isInt(0)).toBeTruthy();
            expect(isInt(1)).toBeTruthy();
            expect(isInt(1.1)).toBeFalsy();
            expect(isInt(-1)).toBeTruthy();
            expect(isInt(-1.1)).toBeFalsy();
            expect(isInt('asdf')).toBeFalsy();
            expect(isInt(function() { })).toBeFalsy();
            expect(isInt(false)).toBeFalsy();
            expect(isInt(true)).toBeFalsy();
            expect(isInt(null)).toBeFalsy();
            expect(isInt(NaN)).toBeFalsy();
            expect(isInt(undefined)).toBeFalsy();
        });
    });

    describe('isString', () => {
        it('should be true if value is a string ', () => {
            expect(typeof isString).toBe('function');
            expect(isString({})).toBeFalsy();
            expect(isString(new Object())).toBeFalsy();
            expect(isString([])).toBeFalsy();
            expect(isString(new Array())).toBeFalsy();
            expect(isString(0)).toBeFalsy();
            expect(isString(1)).toBeFalsy();
            expect(isString(1.1)).toBeFalsy();
            expect(isString(-1)).toBeFalsy();
            expect(isString(-1.1)).toBeFalsy();
            expect(isString('asdf')).toBeTruthy();
            expect(isString(function() { })).toBeFalsy();
            expect(isString(false)).toBeFalsy();
            expect(isString(true)).toBeFalsy();
            expect(isString(null)).toBeFalsy();
            expect(isString(NaN)).toBeFalsy();
            expect(isString(undefined)).toBeFalsy();
        });
    });

    describe('isFunction', () => {
        it('should be true if value is a function ', () => {
            expect(typeof isFunction).toBe('function');
            expect(isFunction({})).toBeFalsy();
            expect(isFunction(new Object())).toBeFalsy();
            expect(isFunction([])).toBeFalsy();
            expect(isFunction(new Array())).toBeFalsy();
            expect(isFunction(0)).toBeFalsy();
            expect(isFunction(1)).toBeFalsy();
            expect(isFunction(1.1)).toBeFalsy();
            expect(isFunction(-1)).toBeFalsy();
            expect(isFunction(-1.1)).toBeFalsy();
            expect(isFunction('asdf')).toBeFalsy();
            expect(isFunction(function() { })).toBeTruthy();
            expect(isFunction(false)).toBeFalsy();
            expect(isFunction(true)).toBeFalsy();
            expect(isFunction(null)).toBeFalsy();
            expect(isFunction(NaN)).toBeFalsy();
            expect(isFunction(undefined)).toBeFalsy();
        });
    });

    describe('isSymbol', () => {
        it('should be true if value is a symbol ', () => {
            expect(typeof isSymbol).toBe('function');
        });
    });

    describe('isDefined', () => {
        it('should be true if value is defined ', () => {
            expect(typeof isDefined).toBe('function');
            expect(isDefined({})).toBeTruthy();
            expect(isDefined(new Object())).toBeTruthy();
            expect(isDefined([])).toBeTruthy();
            expect(isDefined(new Array())).toBeTruthy();
            expect(isDefined(0)).toBeTruthy();
            expect(isDefined(1)).toBeTruthy();
            expect(isDefined(1.1)).toBeTruthy();
            expect(isDefined(-1)).toBeTruthy();
            expect(isDefined(-1.1)).toBeTruthy();
            expect(isDefined('asdf')).toBeTruthy();
            expect(isDefined(function() { })).toBeTruthy();
            expect(isDefined(false)).toBeTruthy();
            expect(isDefined(true)).toBeTruthy();
            expect(isDefined(null)).toBeTruthy();
            expect(isDefined(NaN)).toBeTruthy();
            expect(isDefined(undefined)).toBeFalsy();
        });
    });

    describe('isNull', () => {
        it('should be true if value is `null`', () => {
            expect(typeof isNull).toBe('function');
            expect(isNull({})).toBeFalsy();
            expect(isNull(new Object())).toBeFalsy();
            expect(isNull([])).toBeFalsy();
            expect(isNull(new Array())).toBeFalsy();
            expect(isNull(0)).toBeFalsy();
            expect(isNull(1)).toBeFalsy();
            expect(isNull(1.1)).toBeFalsy();
            expect(isNull(-1)).toBeFalsy();
            expect(isNull(-1.1)).toBeFalsy();
            expect(isNull('asdf')).toBeFalsy();
            expect(isNull(function() { })).toBeFalsy();
            expect(isNull(false)).toBeFalsy();
            expect(isNull(true)).toBeFalsy();
            expect(isNull(null)).toBeTruthy();
            expect(isNull(NaN)).toBeFalsy();
            expect(isNull(undefined)).toBeFalsy();
        });
    });

    describe('isEmpty', () => {
        it('should be true if value is empty', () => {
            expect(typeof isEmpty).toBe('function');
            expect(isEmpty({})).toBeFalsy();
            expect(isEmpty(new Object())).toBeFalsy();
            expect(isEmpty([])).toBeTruthy();
            expect(isEmpty([0,1,2])).toBeFalsy();
            expect(isEmpty(new Array())).toBeTruthy();
            expect(isEmpty(0)).toBeFalsy();
            expect(isEmpty(1)).toBeFalsy();
            expect(isEmpty(1.1)).toBeFalsy();
            expect(isEmpty(-1)).toBeFalsy();
            expect(isEmpty(-1.1)).toBeFalsy();
            expect(isEmpty('')).toBeTruthy();
            expect(isEmpty('asdf')).toBeFalsy();
            expect(isEmpty(function() { })).toBeFalsy();
            expect(isEmpty(false)).toBeFalsy();
            expect(isEmpty(true)).toBeFalsy();
            expect(isEmpty(null)).toBeTruthy();
            expect(isEmpty(NaN)).toBeFalsy();
            expect(isEmpty(undefined)).toBeTruthy();
        });
    });

    describe('isPrimitive', () => {
        it('should be true if value is a primitive', () => {
            expect(typeof isPrimitive).toBe('function');
            expect(isPrimitive({})).toBeFalsy();
            expect(isPrimitive(new Object())).toBeFalsy();
            expect(isPrimitive([])).toBeFalsy();
            expect(isPrimitive(new Array())).toBeFalsy();
            expect(isPrimitive(0)).toBeTruthy();
            expect(isPrimitive(1)).toBeTruthy();
            expect(isPrimitive(1.1)).toBeTruthy();
            expect(isPrimitive(-1)).toBeTruthy();
            expect(isPrimitive(-1.1)).toBeTruthy();
            expect(isPrimitive('asdf')).toBeTruthy();
            expect(isPrimitive(function() { })).toBeFalsy();
            expect(isPrimitive(false)).toBeTruthy();
            expect(isPrimitive(true)).toBeTruthy();
            expect(isPrimitive(null)).toBeTruthy();
            expect(isPrimitive(NaN)).toBeTruthy();
            expect(isPrimitive(undefined)).toBeTruthy();
        });
    });

    describe('typeOf', () => {
        it('should return the type of a value', () => {
            expect(typeof isPrimitive).toBe('function');
            expect(typeOf({})).toBe('object');
            expect(typeOf(new Object())).toBe('object');
            expect(typeOf([])).toBe('array');
            expect(typeOf(new Array())).toBe('array');
            expect(typeOf(0)).toBe('number');
            expect(typeOf(1)).toBe('number');
            expect(typeOf(1.1)).toBe('number');
            expect(typeOf(-1)).toBe('number');
            expect(typeOf(-1.1)).toBe('number');
            expect(typeOf('asdf')).toBe('string');
            expect(typeOf(function() { })).toBe('function');
            expect(typeOf(false)).toBe('boolean');
            expect(typeOf(true)).toBe('boolean');
            expect(typeOf(null)).toBe('null');
            expect(typeOf(NaN)).toBe('number');
            expect(typeOf(undefined)).toBe('undefined');
        });
    });
});