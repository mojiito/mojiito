import { assert } from './../../debug/debug';
import { Singleton } from './../singleton/singleton';

export function Injectable(TargetClass: any): void {
    assert(typeof TargetClass === 'function', 'Decorator njectable has to be applied on a class!', TypeError);
    
    // injectable is basically just a singleton decorator
    //return Singleton(TargetClass);
}