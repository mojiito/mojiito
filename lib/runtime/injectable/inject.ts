import { assert } from './../../debug/debug';
import { Injector } from './injector';
import { ClassFactory, getClassName } from '../../utils/class/class';

export function Inject<C>(injectableClass: ClassFactory<C>): PropertyDecorator {
    return function (targetClass: any, propertyName: string): void {
        let instance = Injector.get(injectableClass);
        assert(instance instanceof injectableClass, `You are injecting a class into your property "${propertyName}" which is either not Injectable or not yet registered on the Injector`);
        targetClass[propertyName] = instance;
    }
}