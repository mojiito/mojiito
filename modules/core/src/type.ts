export interface ClassType<T> extends Function {
    new (...args: Array<any>): T;
    [propertyName: string]: any;
    name: string;
}

export function isClassInstance(instance: any): boolean {
    return typeof instance === 'object' && !!instance['constructor'];
}
