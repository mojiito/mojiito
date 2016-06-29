import { assert } from './../../debug/debug';
import { ClassFactory, getClassName } from '../../utils/class/class';
import { Injector } from './injector';

export function Injectable(TargetClass: ClassFactory<any>): void {
    assert(typeof TargetClass === 'function', 'Decorator Injectable has to be applied on a class!', TypeError);
    Injector.register(TargetClass);
}