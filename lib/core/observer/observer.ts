import { assert } from './../../debug/debug';
import { CoreObject } from '../object/object';
import { CoreArray } from '../array/array';
import { Meta } from '../meta/meta';

export class Observable {
    
    constructor(subject: CoreObject, key: string);
    constructor(subject: CoreArray, key: string);
    constructor(subject: any, key: string) {
        
    }
    
    subscribe(callback: (newValue: any, oldValue: any) => void) {
    }
}

export class Observer {
    private onNext: Function;
    private onError: Function;
    private onComplete: Function;
    
    constructor(onNext: (newValue: any) => void, onError?: (error: Object) => void, onComplete?: () => void) {
        this.onNext = onNext
        this.onError = onError
        this.onComplete = onComplete
    }
    next() { }
    error() { }
    complete() { }
}

export function observes(...keys: string[]): MethodDecorator {
    assert(arguments.length === 1, 'The observes decorator must be called with one argument; an array of propertyKeys');

    return function(target: CoreObject, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): TypedPropertyDescriptor<Function> {
        assert(arguments.length === 3, 'The observe decorator callback must be called with three arguments; a target, a propertyKey and a descriptor');
        assert(target instanceof CoreObject, 'The target provided to the observe decorator callback must be an object and an instace of `CoreObject`', TypeError);
        assert(typeof propertyKey === 'string', 'The property key provided to the observe decorator callback must be a string', TypeError);

        //const source: any = target;  // needed for enabled noImplicitAny
        const callback: Function = descriptor.value;

        assert(typeof callback === 'function', 'The callback for the observer has to be a function', TypeError);
        for (let i = 0, max = keys.length; i < max; i++) {
            let key = keys[i];
            assert(typeof key === 'string', 'The keys provided to the observe decorator callback must be strings', TypeError);

            ((key: string, callback: Function) => {
            })(key, callback);
        }
        return descriptor;
    }
}