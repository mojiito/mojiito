"use strict";
var utils_1 = require('../../utils/utils');
var ViewContainerRef = (function () {
    function ViewContainerRef(_element) {
        this._element = _element;
    }
    ViewContainerRef.prototype.get = function (index) { return this._element.nestedViews[index].ref; };
    Object.defineProperty(ViewContainerRef.prototype, "length", {
        get: function () {
            var views = this._element.nestedViews;
            return utils_1.isPresent(views) ? views.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef.prototype, "element", {
        get: function () { return this._element.elementRef; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef.prototype, "injector", {
        get: function () { return this._element.injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef.prototype, "parentInjector", {
        get: function () { return this._element.parentInjector; },
        enumerable: true,
        configurable: true
    });
    ViewContainerRef.prototype.createEmbeddedView = function (templateRef, context, index) {
        if (context === void 0) { context = null; }
        if (index === void 0) { index = -1; }
        return null;
    };
    ViewContainerRef.prototype.createComponent = function (componentFactory, index, injector, nativeElement) {
        if (index === void 0) { index = -1; }
        if (injector === void 0) { injector = null; }
        var contextInjector = injector || this._element.parentInjector;
        var componentRef = componentFactory.create(contextInjector, nativeElement);
        return componentRef;
    };
    return ViewContainerRef;
}());
exports.ViewContainerRef = ViewContainerRef;
//# sourceMappingURL=view-container.js.map