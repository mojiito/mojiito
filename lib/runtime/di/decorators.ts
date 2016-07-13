import { assert } from './../../debug/debug';
import { Injector } from './injector';
import { ClassType, getClassName } from '../../utils/class/class';

export function Inject<C>(dependecy: ClassType<C>): ParameterDecorator {
    return function (target: ClassType<C>, propertyKey: string | symbol, parameterIndex: number): void {
        // ComponentReflection.get(target).injectableClasses.push(injectableClass);
    }
}

export function Injectable(): ClassDecorator {
    return function (TargetClass: ClassType<any>) {
        assert(typeof TargetClass === 'function', 'Decorator Injectable has to be applied on a class!', TypeError);
        // Injector.resolve(TargetClass);
    }
}