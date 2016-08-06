/// <reference path="../../../typings/main.d.ts" />

import { get } from './get';

describe('get', () => {
    it('should exist', () => {
        expect(typeof get).toBe('function');
    });
    it('should return a boolean', () => {
        const obj = { member: false };
        let result = get(obj, 'member');
        expect(typeof result).toBe('boolean');
        expect(result).toBe(obj.member);
    });
    it('should return a string', () => {
        const obj = { member: 'string' };
        let result = get(obj, 'member');
        expect(typeof result).toBe('string');
        expect(result).toBe(obj.member);
    });
    it('should return a number', () => {
        const obj = { member: 24 };
        let result = get(obj, 'member');
        expect(typeof result).toBe('number');
        expect(result).toBe(obj.member);
    });
    it('should return an object', () => {
        const obj = { member: { inner: 'inner' } };
        let result = get(obj, 'member');
        expect(typeof result).toBe('object');
        expect(result).toBe(obj.member);
    });
    it('should return an array', () => {
        const obj = { member: ['y', 'm', 'c,', 'a'] };
        let result = get(obj, 'member');
        expect(Array.isArray(result)).toBe(true);
        expect(result).toBe(obj.member);
    });
    it('should return an string from path', () => {
        const obj = { member: { inner: 'inner' } };
        let result = get(obj, 'member.inner');
        expect(typeof result).toBe('string');
        expect(result).toBe(obj.member.inner);
    });
    it('should return undefined if member does not exist', () => {
        const obj = { };
        let result = get(obj, 'member');
        expect(result).toBeUndefined();
        result = get(obj, 'member.inner');
        expect(result).toBeUndefined();
    });
})