/// <reference path="../../../typings/main.d.ts" />

import { CoreMap, CoreMapIterator } from './map';

describe('CoreMap', () => {
    it('it exists and can be created', () => {
        const map: CoreMap = new CoreMap();
        expect(map instanceof CoreMap).toBe(true);
    });

    describe('new', () => {
        it('it should create an empty map', () => {
            const map: CoreMap = new CoreMap();
            expect(map.size).toBe(0);
            map.set('key1', 'value1');
            expect(map.size).toBe(1);
        });
        it('it should create a map out of an array', () => {
            const kvArray = [['key1', 'value1'], ['key2', 'value2']];
            const map: CoreMap = new CoreMap(kvArray);
            expect(map.size).toBe(2);
            expect(map.get('key1')).toBe('value1');
            expect(map.get('key2')).toBe('value2');

            // make shure items are cloned
            kvArray[0][0] = 'mykey';
            expect(map.get('key1')).toBe('value1');
        });
        it('it should create a map out of an object', () => {
            const obj = { key1: 'value1', key2: 'value2'};
            const map: CoreMap = new CoreMap(obj);
            expect(map.size).toBe(2);
            expect(map.get('key1')).toBe('value1');
            expect(map.get('key2')).toBe('value2');

            // make shure items are cloned
            obj.key1 = 'myvalue';
            expect(map.get('key1')).toBe('value1');
        });
    });

    describe('size', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.size).toBe('number');
        });
        it('it return the count of the key/value pairs', () => {
            const map: CoreMap = new CoreMap();
            expect(map.size).toBe(0);
            map.set('key1', 'value1');
            expect(map.size).toBe(1);
            map.set('key2', 'value2');
            expect(map.size).toBe(2);
            map.delete('key1');
            expect(map.size).toBe(1);
        });
    });

    describe('length', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.length).toBe('number');
        });
        it('it return always be 0', () => {
            const map: CoreMap = new CoreMap();
            expect(map.length).toBe(0);
            map.set('key1', 'value1');
            expect(map.length).toBe(0);
            map.set('key2', 'value2');
            expect(map.length).toBe(0);
            map.delete('key1');
            expect(map.length).toBe(0);
        });
    });

    describe('clear', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.clear).toBe('function');
        });
        it('it should clear the whole map so it is empty again', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            expect(map.size).toBe(2);
            map.clear();
            expect(map.size).toBe(0);
        });
    });

    describe('delete', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.delete).toBe('function');
        });
        it('it should delete an entry if the key matches', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            map.set('key3', 'value3');
            expect(map.size).toBe(3);
            map.delete('key2');
            expect(map.size).toBe(2);
            expect(map.get('key1')).toBe('value1');
            expect(map.get('key3')).toBe('value3');
            expect(map.get('key2')).toBeUndefined()
        });
        it('it should do nothing if no key matches', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            expect(map.size).toBe(2);
            map.delete('key3');
            expect(map.size).toBe(2);
            expect(map.get('key1')).toBe('value1');
            expect(map.get('key2')).toBe('value2');
        });
    });

    describe('entries', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.entries).toBe('function');
        });
        it('it should return an iterator for iterating the items', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            const interator = map.entries();
            expect(interator instanceof CoreMapIterator).toBeTruthy();
            expect(interator.next().value[1]).toBe('value1');
            expect(interator.next().value[1]).toBe('value2');
            expect(interator.next().value).toBeUndefined();
        });
    });

    describe('forEach', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.forEach).toBe('function');
        });
        it('it should execute a provided function once per each key/value', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            let index = 1;
            map.forEach((value, key, map) => {
                expect(value).toBe('value' + index);
                expect(key).toBe('key' + index);
                index++;
            });
        });
    });

    describe('get', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.get).toBe('function');
        });
        it('it should return the value of the entry where the key matches', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            expect(map.get('key1')).toBe('value1');
            expect(map.get('key2')).toBe('value2');
        });
        it('it should return undefined if no key matches', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            expect(map.get('key3')).toBeUndefined();
        });
    });

    describe('has', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.has).toBe('function');
        });
        it('it should return true if the key matches', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            expect(map.has('key1')).toBeTruthy();
            expect(map.has('key2')).toBeTruthy();
        });
        it('it should return false if the key does not match', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            expect(map.has('key3')).toBeFalsy();
        });
    });

    describe('keys', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.keys).toBe('function');
        });
        it('it should return an iterator for iterating the keys', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            const interator = map.keys();
            expect(interator instanceof CoreMapIterator).toBeTruthy();
            expect(interator.next().value).toBe('key1');
            expect(interator.next().value).toBe('key2');
            expect(interator.next().value).toBeUndefined();
        });
    });

    describe('set', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.set).toBe('function');
        });
        it('it should create a new entry if the key does not already exist', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            expect(map.get('key1')).toBe('value1');
            expect(map.get('key2')).toBe('value2');
        });
        it('it should override the value of an entry if the key does exist', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            expect(map.get('key1')).toBe('value1');
            map.set('key1', 'value2');
            expect(map.get('key1')).toBe('value2');
        });
    });

    describe('values', () => {
        it('it should exist', () => {
            const map: CoreMap = new CoreMap();
            expect(typeof map.values).toBe('function');
        });
        it('it should return an iterator for iterating the values', () => {
            const map: CoreMap = new CoreMap();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            const interator = map.values();
            expect(interator instanceof CoreMapIterator).toBeTruthy();
            expect(interator.next().value).toBe('value1');
            expect(interator.next().value).toBe('value2');
            expect(interator.next().value).toBeUndefined();
        });
    });

    describe('create', () => {
        it('it should exist', () => {
            expect(typeof CoreMap.create).toBe('function');
        });
        it('it should create a new instance of CoreMap', () => {
            expect(CoreMap.create() instanceof CoreMap).toBeTruthy();
        });
    });
});