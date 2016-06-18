import { assert } from './../../debug/debug';
import { onBeforeInstantiation } from './../core/instantiation/instantiation';

export function Singleton(TargetClass: any): void {
    assert(typeof TargetClass === 'function', 'Decorator singleton has to be applied on a class!', TypeError);
    assert(!TargetClass.instance, 'The class seems to already implement the singleton pattern');
    
    TargetClass = onBeforeInstantiation(TargetClass, function(Klass: any) {
        assert(typeof TargetClass['_allowInstantiation'] === 'undefined', 'It`s not allowed to instantiate singleton classes directly. Use `@singleton` instead!')
    });
    
    var instance: Function = new TargetClass();
    
    Object.defineProperty(TargetClass, '_allowInstantiation', {
        writable: false,
        configurable: false,
        enumerable: false,
        value: false
    });
    
    Object.defineProperty(TargetClass, '_instance', {
        writable: false,
        configurable: false,
        enumerable: false,
        value: instance
    });
    
    Object.defineProperty(TargetClass, 'instance', {
        get(): Object {
            return instance;
        },
        set(value) {
            throw new Error('Redefining the instance of a Singleton is not allowed!');
        }
    });
    
    return TargetClass;
}