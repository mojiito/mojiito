"use strict";
var ContextReference = (function () {
    function ContextReference(context) {
        this.context = context;
    }
    return ContextReference;
}());
exports.ContextReference = ContextReference;
var ContextTree = (function () {
    function ContextTree(context) {
        this._tree = [];
        if (context) {
            this.add(context);
        }
    }
    ContextTree.prototype.up = function () {
        this._tree.shift();
        if (!this._tree.length) {
            this.down();
        }
    };
    ContextTree.prototype.down = function () {
        this._tree.unshift([]);
    };
    ContextTree.prototype.add = function (context) {
        var _this = this;
        if (Array.isArray(context)) {
            context.map(function (context) { return _this.add(context); });
        }
        else {
            if (!this._tree.length) {
                this.down();
            }
            this._tree[0].push(new ContextReference(context));
        }
    };
    ContextTree.prototype.getUnfiltered = function () {
        return this._tree.slice(0);
    };
    ContextTree.prototype.getFiltered = function () {
        return this._tree.slice(0).filter(function (list) { return !!(Array.isArray(list) && list.length); });
    };
    ContextTree.prototype.getNearestContextOfType = function (type) {
        for (var i = 0, max = this._tree.length; i < max; i++) {
            var list = this._tree[i];
            for (var j = 0, max_1 = list.length; j < max_1; j++) {
                var context = list[j].context;
                if ((typeof type === 'string' && typeof context === type)
                    || (typeof type === 'function' && context instanceof type)) {
                    return context;
                }
            }
        }
        return null;
    };
    return ContextTree;
}());
exports.ContextTree = ContextTree;
//# sourceMappingURL=context.js.map