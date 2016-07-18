import { assert } from '../../debug/debug';

export interface ClassType<T> {
    new (...args: Array<any>): T;
    [propertyName: string]: any;
    name?: string;
}

export function getClassName<T>(klass: ClassType<T>) {
    return klass.name ? klass.name : /^function\s+([\w\$]+)\s*\(/.exec(this.toString())[1];
}

export function isClassInstance(instance: any): boolean {
    return typeof instance === 'object' && !!instance['constructor']
}