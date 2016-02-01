/// <reference path="../../../typings/main.d.ts" />

import Meta from './meta';

describe('Meta', () => {
    it('it exists and can be created', () => {
        const meta: Meta = new Meta();
        expect(meta instanceof Meta).toBe(true);
    });

    describe('createMember', () => {
        it('should exist', () => {
            const meta: Meta = new Meta();
            expect(typeof meta['createMember']).toBe('function');
        });
        it('should create a new member if it does not exist', () => {
            const meta: any = new Meta();
            let values = meta.createMember('values');
            expect(typeof values).toBe('object');
            expect(meta['_values']).toBe(values);
        });
        it('should return the member if it already exists', () => {
            const meta: Meta = new Meta();
            let values = meta.createMember('values');
            expect(meta.createMember('values')).toBe(values);
        });
    });

    describe('getMember', () => {
        it('should exist', () => {
            const meta: Meta = new Meta();
            expect(typeof meta['getMember']).toBe('function');
        });
        it('should return the member if it exists', () => {
            const meta: Meta = new Meta();
            let values = meta.createMember('values');
            expect(meta.getMember('values')).toBe(values);
        });
        it('should return `undefined` if the member does not exist', () => {
            const meta: Meta = new Meta();
            expect(meta.getMember('values')).toBeUndefined();
        });
    });

    describe('hasMember', () => {
        it('should exist', () => {
            const meta: Meta = new Meta();
            expect(typeof meta['hasMember']).toBe('function');
        });
        it('should return true if it member does exist', () => {
            const meta: Meta = new Meta();
            let values = meta.createMember('values');
            expect(meta.hasMember('values')).toBeTruthy();
        });
        it('should return false if it member does not exist', () => {
            const meta: Meta = new Meta();
            expect(meta.hasMember('values')).toBeFalsy();
        });
    });

    describe('clearMember', () => {
        it('should exist', () => {
            const meta: Meta = new Meta();
            expect(typeof meta['clearMember']).toBe('function');
        });
        it('should return delete all properties in a member', () => {
            const meta: any = new Meta();
            var value = meta.setProperty('values', 'myValue', 1);
            expect(meta['_values']['myValue']).toBe(1);
            meta.clearMember('values');
            expect(meta['_values']['myValue']).toBeUndefined();
            //
        });
    });

    describe('setProperty', () => {
        it('should exist', () => {
            const meta = new Meta();
            expect(typeof meta['setProperty']).toBe('function');
        });
        it('should create a new property on and a map if both don´t exist ', () => {
            const meta: any = new Meta();
            meta.setProperty('values', 'myValue', 1);
            expect(typeof meta['_values']).toBe('object');
            expect(typeof meta['_values']['myValue']).toBe('number');
        });
        it('should create a new property on and an existing member', () => {
            const meta: any = new Meta();
            meta.createMember('values');
            meta.setProperty('values', 'myValue', 1);
            expect(meta['_values']['myValue']).toBe(1);
        });
        it('should override the value of an existing property on a member', () => {
            const meta: any = new Meta();
            meta.setProperty('values', 'myValue', 1);
            expect(meta['_values']['myValue']).toBe(1);
            meta.setProperty('values', 'myValue', 2);
            expect(meta['_values']['myValue']).toBe(2);
        });
    });

    describe('getProperty', () => {
        it('should exist', () => {
            const meta = new Meta();
            expect(typeof meta['getProperty']).toBe('function');
        });
        it('should return the property of a member if it exists', () => {
            const meta = new Meta();
            meta.setProperty('values', 'myValue', 1);
            expect(meta.getProperty('values', 'myValue')).toBe(1);
        });
        it('should return `undefined` if the property of the member does not exist', () => {
            const meta = new Meta();
            meta.createMember('values');
            expect(meta.getProperty('values', 'myValue')).toBeUndefined();
        });
        it('should return `undefined` if the member does not exist', () => {
            const meta = new Meta();
            expect(meta.getProperty('values', 'myValue')).toBeUndefined();
        });
    });

    describe('hasProperty', () => {
        it('should exist', () => {
            const meta: Meta = new Meta();
            expect(typeof meta['hasProperty']).toBe('function');
        });
        it('should return true if it member and property does exist', () => {
            const meta: Meta = new Meta();
            meta.setProperty('values', 'myValue', 1);
            expect(meta.hasProperty('values', 'myValue')).toBeTruthy();
        });
        it('should return false if it member does exist and the property not', () => {
            const meta: Meta = new Meta();
            meta.createMember('values');
            expect(meta.hasProperty('values', 'myValue')).toBeFalsy();
        });
        it('should return false if it member does not exist', () => {
            const meta: Meta = new Meta();
            expect(meta.hasProperty('values', 'myValue')).toBeFalsy();
        });
    });
    
    describe('deleteProperty', () => {
        it('should exist', () => {
            const meta: Meta = new Meta();
            expect(typeof meta['deleteProperty']).toBe('function');
        });
        it('should delete a property of a member', () => {
            const meta: Meta = new Meta();
            meta.setProperty('values', 'myValue', 1);
            expect(meta.hasProperty('values', 'myValue')).toBeTruthy();
            meta.deleteProperty('values', 'myValue');
            expect(meta.hasProperty('values', 'myValue')).toBeFalsy();
        });
    });
    
    describe('extend', () => {
        it('should exist', () => {
            expect(typeof Meta.extend).toBe('function');
        });
        it('should extend an object with a meta hash', () => {
            var obj: any = {};
            expect(obj['__mojito_meta__']).toBeUndefined();
            Meta.extend(obj);
            expect(obj['__mojito_meta__']).toBeDefined();
            expect(obj['__mojito_meta__'] instanceof Meta).toBeTruthy();
        });
    });
    
    describe('peek', () => {
        it('should exist', () => {
            expect(typeof Meta.peek).toBe('function');
        });
        it('should retrieve the meta hash for an object', () => {
            var obj: any = {};
            expect(obj['__mojito_meta__']).toBeUndefined();
            Meta.extend(obj);
            expect(Meta.peek(obj)).toBeDefined();
            expect(Meta.peek(obj) instanceof Meta).toBeTruthy();
        });
        it('should create and retrieve the meta hash of an object if it does not exist yet', () => {
            var obj: any = {};
            expect(obj['__mojito_meta__']).toBeUndefined();
            expect(Meta.peek(obj)).toBeDefined();
            expect(Meta.peek(obj) instanceof Meta).toBeTruthy();
        });
    });
})