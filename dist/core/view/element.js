"use strict";
var view_container_1 = require('./view-container');
var element_ref_1 = require('./element-ref');
var AppElement = (function () {
    function AppElement(index, parentIndex, parentView, nativeElement) {
        this.index = index;
        this.parentIndex = parentIndex;
        this.parentView = parentView;
        this.nativeElement = nativeElement;
        this.nestedViews = null;
        this.componentView = null;
    }
    Object.defineProperty(AppElement.prototype, "elementRef", {
        get: function () { return new element_ref_1.ElementRef(this.nativeElement); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppElement.prototype, "vcRef", {
        get: function () { return new view_container_1.ViewContainerRef(this); },
        enumerable: true,
        configurable: true
    });
    AppElement.prototype.initComponent = function (component, view) {
        this.component = component;
        this.componentView = view;
    };
    Object.defineProperty(AppElement.prototype, "parentInjector", {
        get: function () { return null; /* this.parentView.injector(this.parentIndex);*/ },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppElement.prototype, "injector", {
        get: function () { return null; /*this.parentView.injector(this.index);*/ },
        enumerable: true,
        configurable: true
    });
    AppElement.prototype.moveView = function (view, currentIndex) { };
    AppElement.prototype.attachView = function (view, viewIndex) { };
    AppElement.prototype.detachView = function (viewIndex) { return null; };
    return AppElement;
}());
exports.AppElement = AppElement;
//# sourceMappingURL=element.js.map