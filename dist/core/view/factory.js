"use strict";
var ViewFactory = (function () {
    function ViewFactory(viewType) {
        this._viewType = viewType;
    }
    ViewFactory.prototype.create = function (element) {
        var view = new this._viewType(element);
        return view;
    };
    return ViewFactory;
}());
exports.ViewFactory = ViewFactory;
//# sourceMappingURL=factory.js.map