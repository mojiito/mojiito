"use strict";
var debug_1 = require('./../../debug/debug');
var Iterator = (function () {
    function Iterator(source) {
        this._nextIndex = 0;
        debug_1.assert(arguments.length === 1, 'CoreIterator must be created with one argument; an iterable object');
        debug_1.assert(typeof source.length === 'number', 'The source property has to be a iterable object', TypeError);
        this._source = source;
    }
    Iterator.prototype.next = function () {
        var source = this._source;
        return this._nextIndex < source.length ? { value: source[this._nextIndex++], done: false } : { done: true };
    };
    return Iterator;
}());
exports.Iterator = Iterator;
//# sourceMappingURL=iterator.js.map