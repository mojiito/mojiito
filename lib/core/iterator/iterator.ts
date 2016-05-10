import { assert } from './../../debug/debug';

export interface IIteratorItem<T> {
    value?: T,
    done: boolean;
}

export interface IIterator<T> {
    next(): IIteratorItem<T>;
}

export interface IIterable<T> {
    [index: number]: T,
    length: number;
}

export class CoreIterator<T> implements IIterator<T> {
    protected _nextIndex = 0;
    protected _source: IIterable<T>;

    constructor(source: IIterable<T>) {
        assert(arguments.length === 1, 'CoreIterator must be created with one argument; an iterable object');
        assert(typeof source.length === 'number', 'The source property has to be a iterable object', TypeError);
        this._source = source;
    }

    next(): IIteratorItem<T> {
        let source = this._source;
        return this._nextIndex < source.length ? { value: source[this._nextIndex++], done: false } : { done: true };
    }
}