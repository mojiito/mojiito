import { assert } from './../../debug/debug';
import { CoreObject } from '../object/object';
import { CoreArray } from '../array/array';
import { Meta } from '../meta/meta';

export class Observable {
    
    observe(key: string, callback: Function): Observer {
        assert(arguments.length === 2, 'The observe method must be called with three arguments; a subject, and a key');
        assert(typeof key === 'string', 'The key provided to the observe method must be a string', TypeError);
        assert(typeof callback === 'function', 'The callback provided to the observe method must be a function', TypeError);
        
        const subject:any = this;
        const isPath = key.indexOf('.') !== -1;

        if (this instanceof CoreObject) {
            CoreObject.defineProperties(subject);
        }
        
        if (isPath) {
            const keyNames: Array<string> = key.split('.');
            const keyName: string = keyNames.slice(0, 1)[0];
            const path: string = keyNames.slice(1).join('.');
            const property: any = subject[keyName];
            
            // Path should not contain more than 4 elements
            if (keyNames.length > 4) {
                if (console && console.warn) {
                    console.warn('WARNING: Observing paths with more than 4 elements could cause significant performance degradation!\r\nObserved path: ' + key);
                }
            }
	        
            // Check if property in path not a primitive
            assert(typeof property === 'object' || typeof property === 'undefined', 'To watch a path, the elements, unless the last one, have to be objects or arrays', TypeError);

            if (!(property instanceof CoreObject) && !(property instanceof CoreArray)) {
                if (Array.isArray(property)) {
                    subject[keyName] = new CoreArray(property);
                } else {
                    let newObject = new CoreObject(typeof property === 'object' ? property : {});
                    CoreObject.defineProperty(subject, keyName, newObject);
                    //Observer.observe(subject, keyName, (newValue: any, oldValue: CoreObject) => {
                    //});
                }
            }

            //return Observer.observe(subject[keyName], keyNames.slice(1).join('.'), callback);
        } else {
            let meta = Meta.peek(subject);
            let observers = meta.getProperty('observers', key);

            if (subject instanceof CoreObject && !subject.get(key)) {
                CoreObject.defineProperty(subject, key, undefined);
            }

            let observer = new Observer(subject, key, callback);
            if (!observers) {
                observers = meta.setProperty('observers', key, []);
            }
            observers.push(observer);
            return observer;
        }
    }
    //unobserve(observer: Observer): boolean;
}

export class Observer {
    private subject: CoreObject | CoreArray;
    private key: string;
    private callback: Function;

    constructor(subject: CoreObject, key: string, callback: Function);
    constructor(subject: CoreObject, path: string, callback: Function);
    constructor(subject: CoreArray, key: string, callback: Function);
    constructor(subject: CoreArray, path: string, callback: Function);
    constructor(subject: any, key: string, callback: Function) {
        assert(arguments.length === 3, 'The constructor of the Observer must be called with three arguments; a subject, a key and a callback function');
        assert(subject instanceof CoreObject || subject instanceof CoreArray, 'The subject provided to the observe method must be an object and instance of Observable', TypeError);
        assert(typeof key === 'string', 'The key provided to the constructor of the Observer must be a string', TypeError);
        assert(typeof callback === 'function', 'The callback provided to the constructor of the Observer must be a function', TypeError);
        this.subject = subject;
        this.key = key;
        this.callback = callback;
    }

    notify(newValue: any, oldValue: any) {
        return this.callback.call(this.subject, newValue, oldValue);
    }
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
                CoreObject._addInstanceCallback(target, function(subject: CoreObject) {
                    Observer.observe(subject, key, callback);
                });
            })(key, callback);
        }
        return descriptor;
    }
}