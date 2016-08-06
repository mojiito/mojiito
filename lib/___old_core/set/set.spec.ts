/// <reference path="../../../typings/main.d.ts" />

import { set } from './set';

describe('set', () => {
    it('should exist', () => {
        expect(typeof set).toBe('function');
    });
    it('should create a new property if it does not exist', () => {
        let obj: any = {};
        set(obj, 'member', 24);
        expect(typeof obj['member']).toBe('number');
        expect(obj['member']).toBe(24);
    });
    it('should override the value of a property if it does exist', () => {
        let obj: any = { member: 24 };
        set(obj, 'member', 25);
        expect(obj['member']).toBe(25);
    });
    it('should create a new property in a path if it does not exist', () => {
        let obj: any = { member: {} };
        set(obj, 'member.inner', 24);
        expect(typeof obj.member['inner']).toBe('number');
        expect(obj.member['inner']).toBe(24);
    });
    it('should override the value of a property in a path if it does exist', () => {
        let obj: any = { member: { inner: 24 } };
        set(obj, 'member.inner', 25);
        expect(obj.member.inner).toBe(25);
    });
    it('should create objects on path if not exist', () => {
        let obj: any = {};
        set(obj, 'member.inner', 24);
        expect(typeof obj['member']).toBe('object');
        expect(typeof obj['member']['inner']).toBe('number');
        expect(obj['member']['inner']).toBe(24);
    });
})