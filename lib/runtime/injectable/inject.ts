import { assert } from './../../debug/debug';

export function inject(InjectableClass: any): PropertyDecorator {
    return function(target: any, propertyName: string): void {
        target[propertyName] = InjectableClass.instance;
    }
}