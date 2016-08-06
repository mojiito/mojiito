/// <reference path="../../../typings/main.d.ts" />

import { assert } from './assert';

describe('assert', () => {
    it('should exist', () => {
        expect(typeof assert).toBe('function');
    });
    it('should do nothing if the assertion is true', () => {
        expect(function() {
            assert(true, 'Error');
        }).not.toThrowError();
    });
    it('should throw an exeption if assertion is false', () => {
        expect(function() {
            assert(false, 'error');
        }).toThrowError()
    });
    it('should throw a custom error exeption if assertion is false', () => {
        try {
            assert(false, 'error', TypeError);
            expect(true).toBe(false);
        } catch (ex) {
            expect(ex instanceof TypeError).toBe(true);
        }
    });
});