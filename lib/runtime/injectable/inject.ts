import { assert } from './../../debug/debug';

export function inject(injectableClass: any): PropertyDecorator {
    return function (target: any, propertyName: string): void {
        assert(typeof injectableClass._injectableInstance === 'object', `You are injecting a class into your property "${propertyName}" which is not marked as Injectable!`);
        target[propertyName] = injectableClass._injectableInstance;
    }
}