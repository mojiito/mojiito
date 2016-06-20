/// <reference path="../../../typings/main.d.ts" />

import { CoreObject } from './object';
import { Meta } from '../meta/meta';

describe('CoreObject', () => {
    it('it exists and can be created', () => {
        const coreObject: CoreObject = new CoreObject();
        expect(coreObject instanceof CoreObject).toBe(true);
    });

    describe('get', () => {
        it('should exist', () => {
            const coreObject: CoreObject = new CoreObject();
            expect(typeof coreObject.get).toBe('function');
        });
        it('should return a boolean', () => {
            const coreObject: any = new CoreObject({ member: false });
            let result = coreObject.get('member');
            expect(typeof result).toBe('boolean');
            expect(result).toBe(coreObject['member']);
        });
        it('should return a string', () => {
            const coreObject: any = new CoreObject({ member: 'string' });
            let result = coreObject.get('member');
            expect(typeof result).toBe('string');
            expect(result).toBe(coreObject['member']);
        });
        it('should return a number', () => {
            const coreObject: any = new CoreObject({ member: 24 });
            let result = coreObject.get('member');
            expect(typeof result).toBe('number');
            expect(result).toBe(coreObject['member']);
        });
        it('should return an object', () => {
            const coreObject: any = new CoreObject({ member: { inner: 'inner' } });
            let result = coreObject.get('member');
            expect(typeof result).toBe('object');
            expect(result).toBe(coreObject['member']);
        });
        it('should return an array', () => {
            const coreObject: any = new CoreObject({ member: ['y', 'm', 'c,', 'a'] });
            let result = coreObject.get('member');
            expect(Array.isArray(result)).toBe(true);
            expect(result).toBe(coreObject['member']);
        });
        it('should return an string from path', () => {
            const coreObject: any = new CoreObject({ member: { inner: 'inner' } });
            let result = coreObject.get('member.inner');
            expect(typeof result).toBe('string');
            expect(result).toBe(coreObject['member'].inner);
        });
        it('should return undefined if member does not exist', () => {
            const obj = {};
            const coreObject: any = new CoreObject();
            let result = coreObject.get('member');
            expect(result).toBeUndefined();
            result = coreObject.get('member.inner');
            expect(result).toBeUndefined();
        });
    });

    describe('set', () => {
        it('should exist', () => {
            const coreObject: CoreObject = new CoreObject();
            expect(typeof coreObject.get).toBe('function');
        });
        it('should create a new property if it does not exist', () => {
            const coreObject: any = new CoreObject();
            coreObject.set('member', 24);
            expect(typeof coreObject['member']).toBe('number');
            expect(coreObject['member']).toBe(24);
        });
        it('should override the value of a property if it does exist', () => {
            const coreObject: any = new CoreObject({ member: 24 });
            coreObject.set('member', 25);
            expect(coreObject['member']).toBe(25);
        });
        it('should create a new property in a path if it does not exist', () => {
            const coreObject: any = new CoreObject({ member: {} });
            coreObject.set('member.inner', 24);
            expect(typeof coreObject.member['inner']).toBe('number');
            expect(coreObject.member['inner']).toBe(24);
        });
        it('should override the value of a property in a path if it does exist', () => {
            const coreObject: any = new CoreObject({ member: { inner: 24 } });
            coreObject.set('member.inner', 25);
            expect(coreObject.member.inner).toBe(25);
        });
        it('should create objects on path if not exist', () => {
            const coreObject: any = new CoreObject();
            coreObject.set('member.inner', 24);
            expect(typeof coreObject['member']).toBe('object');
            expect(typeof coreObject['member']['inner']).toBe('number');
            expect(coreObject['member']['inner']).toBe(24);
        });
    });

    describe('create', () => {
        it('should exist', () => {
            expect(typeof CoreObject.create).toBe('function');
        });
        it('shoult create a new CoreObject', () => {
            expect(CoreObject.create() instanceof CoreObject);
        });
        it('shoult create a new CoreObject and define new properties when applied', () => {
            const coreObject: any = CoreObject.create({ member: 'test' });
            expect(coreObject instanceof CoreObject);
            expect(coreObject['member'] === 'test');
            expect(coreObject['member'] === Meta.peek(coreObject).getProperty('values', 'member'));
        });
    });

    // describe('defineProperty', () => {
    //     it('should exist', () => {
    //         expect(typeof CoreObject.defineProperty).toBe('function');
    //     });
    //     it('should define a new property if it does not exist', () => {
    //         const coreObject: any = new CoreObject();
    //         CoreObject.defineProperty(coreObject, 'member', 'test');
    //         expect(coreObject['member'] === 'test');
    //         expect(coreObject['member'] === Meta.peek(coreObject).getProperty('values', 'member'));
    //     });
    //     it('should replace an existing non defined property with a defined one', () => {
    //         const coreObject: any = new CoreObject();
    //         coreObject.member = 'fail';
    //         CoreObject.defineProperty(coreObject, 'member', 'test');
    //         expect(coreObject['member'] === 'test');
    //         expect(coreObject['member'] === Meta.peek(coreObject).getProperty('values', 'member'));
    //     });
    //     it('should override the value of an existing defined property', () => {
    //         const coreObject: any = new CoreObject({ member: 'old' });
    //         CoreObject.defineProperty(coreObject, 'member', 'test');
    //         expect(coreObject['member'] === 'test');
    //         expect(coreObject['member'] === Meta.peek(coreObject).getProperty('values', 'member'));
    //     });
    // });

    // describe('isDefinedProperty', () => {
    //     it('should exist', () => {
    //         expect(typeof CoreObject.isDefinedProperty).toBe('function');
    //     });
    //     it('should return `true` if a property was defined with the defineProperty method', () => {
    //         const coreObject: any = new CoreObject({ member1: 'value1' });
    //         CoreObject.defineProperty(coreObject, 'member2', 'value2');
    //         expect(CoreObject.isDefinedProperty(coreObject, 'member1')).toBeTruthy();
    //         expect(CoreObject.isDefinedProperty(coreObject, 'member2')).toBeTruthy();
    //     });
    //     it('should return `false` if a property was not defined with the defineProperty method', () => {
    //         const coreObject: any = new CoreObject({ member1: 'value1' });
    //         coreObject.member2 = 'value2';
    //         Object.defineProperty(coreObject, 'member3', { writable: true, enumerable: false, configurable: true, value: 'value3' });
    //         Object.defineProperty(coreObject, 'member4', { get: function() { return 'value4' }, set(value) { } });
    //         expect(CoreObject.isDefinedProperty(coreObject, 'member1')).toBeTruthy();
    //         expect(CoreObject.isDefinedProperty(coreObject, 'member2')).toBeFalsy();
    //         expect(CoreObject.isDefinedProperty(coreObject, 'member3')).toBeFalsy();
    //         expect(CoreObject.isDefinedProperty(coreObject, 'member4')).toBeFalsy();
    //     });
    // });

    // describe('defineProperties', () => {
    //     it('should exist', () => {
    //         expect(typeof CoreObject.defineProperties).toBe('function');
    //     });
    //     it('should define multiple properties with the defineProperty method', () => {
    //         const coreObject: any = new CoreObject();
    //         CoreObject.defineProperties(coreObject, { member1: 1, member2: 2 });
    //         expect(coreObject['member1'] === 1);
    //         expect(coreObject['member1'] === Meta.peek(coreObject).getProperty('values', 'member1'));
    //         expect(coreObject['member2'] === 2);
    //         expect(coreObject['member2'] === Meta.peek(coreObject).getProperty('values', 'member2'));
    //     });
    //     it('should define properties on a CoreObject which are not defined', () => {
    //         const coreObject: any = new CoreObject();
    //         coreObject.member1 = 1;
    //         expect(coreObject['member1'] === 1);
    //         expect(Meta.peek(coreObject).getProperty('values', 'member1')).toBeUndefined();
    //         CoreObject.defineProperties(coreObject);
    //         expect(coreObject['member1'] === 1);
    //         expect(coreObject['member1'] === Meta.peek(coreObject).getProperty('values', 'member1'));
    //     });
    //     it('should do both, define new and existing properties', () => {
    //         const coreObject: any = new CoreObject();
    //         coreObject.member1 = 1;
    //         expect(coreObject['member1'] === 1);
    //         expect(Meta.peek(coreObject).getProperty('values', 'member1')).toBeUndefined();
    //         CoreObject.defineProperties(coreObject, { member2: 2 });
    //         expect(coreObject['member1'] === 1);
    //         expect(coreObject['member1'] === Meta.peek(coreObject).getProperty('values', 'member1'));
    //         expect(coreObject['member2'] === 2);
    //         expect(coreObject['member2'] === Meta.peek(coreObject).getProperty('values', 'member2'));
    //     });
    // });
});