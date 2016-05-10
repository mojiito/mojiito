import { assert } from './../../debug/debug';

export interface IIteratorItem {
    value?: any,
    done: boolean;
}

export interface IIterator {
    next(): IIteratorItem;
}

export interface IIterable {
    length: number;
}

export class CoreIterator implements IIterator {
    protected _nextIndex = 0;
    protected _source: IIterable;

    constructor(source: IIterable) {
        assert(arguments.length === 1, 'CoreIterator must be created with one argument; an iterable object');
        assert(typeof source.length === 'number', 'The source property has to be a iterable object', TypeError);
        this._source = source;
    }

    next(): IIteratorItem {
        let source = this._source;
        return this._nextIndex < source.length ? { value: source[this._nextIndex++], done: false } : { done: true };
    }
}