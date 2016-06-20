import { assert } from '../../debug/debug';

export interface ClassFactory<T> {
    new (...args: Array<any>): T;
    [propertyName: string]: any;
    name?: string;
}