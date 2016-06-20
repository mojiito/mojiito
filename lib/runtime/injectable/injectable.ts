import { assert } from './../../debug/debug';

export function Injectable(TargetClass: any): void {
    assert(typeof TargetClass === 'function', 'Decorator njectable has to be applied on a class!', TypeError);
    
    var instance: Function = new TargetClass();

    Object.defineProperty(TargetClass, '_injectableInstance', {
        writable: false,
        configurable: false,
        enumerable: false,
        value: instance
    });
}