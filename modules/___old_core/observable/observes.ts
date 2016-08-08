import { assert } from '../../debug/debug';
import { observe } from './observe';
import { ObservableObject } from './observableObject';

export function observes(...keys: string[]): MethodDecorator {
    assert(arguments.length > 0, 'The observes decorator must be called with at least one property key');

    return function(target: ObservableObject, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): TypedPropertyDescriptor<Function> {
        assert(arguments.length === 3, 'The observe decorator callback must be called with three arguments; a target, a propertyKey and a descriptor');
        assert(target instanceof ObservableObject, 'The target provided to the observe decorator callback must be an object and an instace of `ObservableObject`', TypeError);
        assert(typeof propertyKey === 'string', 'The property key provided to the observe decorator callback must be a string', TypeError);

        //const source: any = target;  // needed for enabled noImplicitAny
        const callback: Function = descriptor.value;

        assert(typeof callback === 'function', 'The callback for the observer has to be a function', TypeError);
        for (let i = 0, max = keys.length; i < max; i++) {
            let key = keys[i];
            assert(typeof key === 'string', 'The keys provided to the observe decorator callback must be strings', TypeError);
            observe(target, key, callback, target);
        }
        return descriptor;
    }
}