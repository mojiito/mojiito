export interface ClassType<T> {
    new (...args: Array<any>): T;
    [propertyName: string]: any;
    name?: string;
}
export declare function getClassName<T>(klass: ClassType<T>): string;
export declare function isClassInstance(instance: any): boolean;
