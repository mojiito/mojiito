//// <reference path="../../../typings/main.d.ts" />

import { Injector } from './injector';
import { Injectable } from './decorators';

/**
 * Injector tests
 */
// describe('Injector', () => {
//     it('it exists and can be created', () => {
//         const inj = new Injector([]);
//         expect(inj instanceof Injector).toBe(true);
//     });

//     describe('parent', () => {
//         const inj = new Injector([]);
//         const inj2 = new Injector([], inj);
//         expect(inj2.parent === inj);
//     });

//     describe('resolve', () => {
//         @Injectable()
//         class Engine {
//         }

//         @Injectable()
//         class Car {
//             constructor(public engine: Engine) { }
//         }

//         var providers = Injector.resolve([Car, [[Engine]]]);
//     });
// });