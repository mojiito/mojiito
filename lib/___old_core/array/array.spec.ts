/// <reference path="../../../typings/main.d.ts" />

import { CoreArray } from './array';
import { Meta } from '../meta/meta';

describe('CoreArray', () => {
    it('exists and can be created', () => {
        const coreArray: CoreArray = new CoreArray();
        expect(coreArray instanceof CoreArray).toBe(true);
    });
    it('can be created prefilled', () => {
        const coreArray: CoreArray = new CoreArray([1, 2]);
        const array: any = coreArray;
        expect(array[0] === 1);
        expect(array[0] === Meta.peek(coreArray).getProperty('values', 'source')[0]);
        expect(array[1] === 2);
        expect(array[1] === Meta.peek(coreArray).getProperty('values', 'source')[1]);
    });

    describe('concat', () => {
        it('should exist', () => {
            const coreArray: CoreArray = new CoreArray();
            expect(typeof coreArray.concat).toBe('function');
        });
        it('should concatenate two arrays', () => {
            let coreArray: CoreArray = new CoreArray([1,2]);
            let array = [3, 4];
            let result = coreArray.concat(array);
            expect(result instanceof CoreArray).toBeTruthy();
            expect(result.source[1]).toBe(2);
            expect(result.source[3]).toBe(4);
            expect(result.length).toBe(4);
        });
        it('should concatenate two CoreArrays', () => {
            let coreArray: CoreArray = new CoreArray([1,2]);
            let numeric: CoreArray = new CoreArray([3, 4]);
            let result = coreArray.concat(numeric);
            expect(result instanceof CoreArray).toBeTruthy();
            expect(result.source[1]).toBe(2);
            expect(result.source[3]).toBe(4);
            expect(result.length).toBe(4);
        });
        it('should concatenate three arrays', () => {
            let coreArray: CoreArray = new CoreArray([1,2]);
            let array = [3, 4];
            let coreArray2: CoreArray = new CoreArray([5,6]);
            let result = coreArray.concat(array, coreArray2);
            expect(result instanceof CoreArray).toBeTruthy();
            expect(result.source[1]).toBe(2);
            expect(result.source[3]).toBe(4);
            expect(result.source[5]).toBe(6);
            expect(result.length).toBe(6);
        });
        it('should concatenate values to an array', () => {
            let coreArray: CoreArray = new CoreArray([1,2]);
            let array = [4];
            let coreArray2: CoreArray = new CoreArray([5,6]);
            let result = coreArray.concat(3, array, coreArray2);
            expect(result instanceof CoreArray).toBeTruthy();
            expect(result.source[1]).toBe(2);
            expect(result.source[3]).toBe(4);
            expect(result.source[5]).toBe(6);
            expect(result.length).toBe(6);
        });
    });
    
    describe('elementAt', () => {
        it('should exist', () => {
            const coreArray: CoreArray = new CoreArray();
            expect(typeof coreArray.elementAt).toBe('function');
        });
        it('should return the element on a specific index', () => {
            const coreArray: CoreArray = new CoreArray([1, 2, 3]);
            expect(coreArray.elementAt(1)).toBe(2);
        });
    });

    describe('every', () => {
        it('should exist', () => {
            const coreArray: CoreArray = new CoreArray();
            expect(typeof coreArray.every).toBe('function');
        });
        it('should check whether all elements in the array pass the test', () => {
            const coreArray1: CoreArray = new CoreArray([12, 5, 8, 130, 44]);
            expect(coreArray1.every(function(value:any) {
                return value > 10;
            })).toBeFalsy();
            const coreArray2: CoreArray = new CoreArray([12, 25, 56, 130, 44]);
            expect(coreArray2.every(function(value: any) {
                return value > 10;
            })).toBeTruthy();
        });
    });

    describe('filter', () => {
        it('should exist', () => {
            const coreArray: CoreArray = new CoreArray();
            expect(typeof coreArray.filter).toBe('function');
        });
        it('should filter the elements by a test function', () => {
            const coreArray: CoreArray = new CoreArray([12, 5, 8, 130, 44]);
            const result:any = coreArray.filter(function(value: any) {
                return value > 10;
            });
            expect(result.length).toBe(3);
            expect(result.elementAt(0)).toBe(12);
            expect(result.elementAt(1)).toBe(130);
            expect(result.elementAt(2)).toBe(44);
        });
    });

    describe('filterBy', () => {
        it('should exist', () => {
            const coreArray: CoreArray = new CoreArray();
            expect(typeof coreArray.filterBy).toBe('function');
        });
        it('should filter the elements by an element property', () => {
            const coreArray: CoreArray = new CoreArray([{id: 1, isSelected: false},{id: 2, isSelected: true},{id: 3, isSelected: false}]);
            const result:any = coreArray.filterBy('isSelected');
            expect(result.length).toBe(1);
            expect(result.elementAt(0).id).toBe(2);
        });
    });

    describe('find', () => {
        it('should exist', () => {
            const coreArray: CoreArray = new CoreArray();
            expect(typeof coreArray.find).toBe('function');
        });
        it('should find an element in a CoreArray', () => {
            const coreArray: CoreArray = new CoreArray([12, 5, 8, 130, 44]);
            const result:any = coreArray.find(function(value: any) {
                return value === 12;
            });
            expect(result).toBe(12);
        });
    });

    describe('find', () => {
        it('should exist', () => {
            const coreArray: CoreArray = new CoreArray();
            expect(typeof coreArray.find).toBe('function');
        });
        it('should find an object in a CoreArray by its property', () => {
            const coreArray: CoreArray = new CoreArray([12, 5, 8, 130, 44]);
            const result:any = coreArray.find(function(value: any) {
                return value === 12;
            });
            expect(result).toBe(12);
        });
    });
    
    describe('create', () => {
        it('should exist', () => {
            expect(typeof CoreArray.create).toBe('function');
        });
        it('shoult create a new CoreArray', () => {
            expect(CoreArray.create() instanceof CoreArray);
        });
        it('shoult create a new prefilled CoreArray', () => {
            const coreArray: any = CoreArray.create([1, 2]);
            expect(coreArray instanceof CoreArray);
            expect(coreArray.elementAt(0) === 1);
            expect(coreArray.elementAt(0) === Meta.peek(coreArray).getProperty('values', 'source')[0]);
            expect(coreArray.elementAt(1) === 2);
            expect(coreArray.elementAt(1) === Meta.peek(coreArray).getProperty('values', 'source')[1]);
        });
    });
});