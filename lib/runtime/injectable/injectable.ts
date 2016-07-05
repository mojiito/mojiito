import { assert } from './../../debug/debug';
import { ClassType, getClassName } from '../../utils/class/class';
import { Injector } from './injector';

export function Injectable(): ClassDecorator {
    return function (TargetClass: ClassType<any>) {
        assert(typeof TargetClass === 'function', 'Decorator Injectable has to be applied on a class!', TypeError);
        Injector.register(TargetClass);
    }
}