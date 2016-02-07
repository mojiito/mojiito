import { assert } from './../../debug/assert/assert';
import { CoreObject } from '../object/object';
import { Meta } from '../meta/meta';

export interface IObservable {
    subscribe(key: string, callback: Function): Observer;
    dispose(observer: Observer): boolean;
}

export class Observer {

    constructor(private subject: CoreObject, private key: string, private callback: Function) {
    }

    notify(newValue: any, oldValue: any) {
        this.callback.call(this.subject, newValue, oldValue);
    }

    static observe(subject: CoreObject, key: string, callback: Function) {
        let meta = Meta.peek(subject);
        let observers = meta.getProperty('observers', key);

        if (!subject.get(key)) {
            let propertyMap: any = {};
            propertyMap[key] = undefined;
            CoreObject.defineProperties(subject, propertyMap);
        }

        let observer = new Observer(subject, key, callback);
        if (!observers) {
            observers = meta.setProperty('observers', key, []);
        }
        observers.push(observer);
        return observer;
    }
}

export function observes(...keys: string[]): PropertyDecorator {
    assert(arguments.length === 1, 'The observes decorator must be called with one argument; an array of propertyKeys');
    
    return function(target: CoreObject, propertyKey: string): void {
        assert(arguments.length === 2, 'The observe decorator callback must be called with two arguments; a target and a propertyKey');
        assert(target instanceof CoreObject, 'The target provided to the observe decorator callback must be an object and an instace of `Observable`', TypeError);
        assert(typeof propertyKey === 'string', 'The property key provided to the observe decorator callback must be a string', TypeError);

        const source: any = target;  // needed for enabled noImplicitAny
        const callback: Function = source[propertyKey];

        assert(typeof callback === 'function', 'The callback for the observer has to be a function', TypeError);
        for (let i = 0, max = keys.length; i < max; i++) {
            let key = keys[i];
            assert(typeof key === 'string', 'The keys provided to the observe decorator callback must be strings', TypeError);

            (function(key: string, callback: Function) {
                CoreObject._addInstanceCallback(source, function(subject: CoreObject) {
                    Observer.observe(subject, key, callback);
                });
            })(key, callback);
        }
    }
}