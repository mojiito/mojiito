export interface IIteratorItem<T> {
    value?: T;
    done: boolean;
}
export interface IIterator<T> {
    next(): IIteratorItem<T>;
}
export interface IIterable<T> {
    [index: number]: T;
    length: number;
}
export interface IIterableObject {
    [key: string]: any;
}
export declare class Iterator<T> implements IIterator<T> {
    protected _nextIndex: number;
    protected _source: IIterable<T>;
    constructor(source: IIterable<T>);
    next(): IIteratorItem<T>;
}
