/// <reference path="../../../typings/main.d.ts" />

import { CoreMap } from './map';

describe('CoreMap', () => {
    it('it exists and can be created', () => {
        const map: CoreMap = new CoreMap();
        expect(map instanceof CoreMap).toBe(true);
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
});