import { assert } from './../../debug/debug';
import { Injector } from './injector';
import { ClassType, getClassName } from '../../utils/class/class';

export function Inject<C>(injectableClass: ClassType<C>): PropertyDecorator {
    return function (targetClass: any, propertyName: string): void {
        let instance = Injector.get(injectableClass);
        assert(instance instanceof injectableClass, `You are injecting a class into your property "${propertyName}" which is either not Injectable or not yet registered on the Injector`);
        targetClass[propertyName] = instance;
    }
}