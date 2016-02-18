import { assert } from './../../debug/debug';
import { singleton } from './../singleton/singleton';

export function injectable(TargetClass: any): void {
    assert(typeof TargetClass === 'function', 'Decorator injectable has to be applied on a class!', TypeError);
    
    // injectable is basically just a singleton decorator
    return singleton(TargetClass);
}