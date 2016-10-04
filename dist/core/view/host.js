"use strict";
var element_1 = require('./element');
var HostElement = (function () {
    // get cdStatus(): ChangeDetectorStatus { return this._cdStatus; }
    function HostElement(hostView, injector, cdStatus) {
        this._hostView = null;
        this._nestedViews = []; // TODO: Implement embedded views
        this._hostView = hostView;
        // if(typeof cdStatus === 'number') {
        //     this._cdStatus = cdStatus;
        //     this._cdDefaultStatus = cdStatus;
        // }
        // let iterableDifferFactory = new IterableDifferFactory();
        // let keyValueDifferFactory = new KeyValueDifferFactory();
        // if (iterableDifferFactory.supports(this)) {
        //     this._iterableDiffer = iterableDifferFactory.create(this);
        // }
        // if (keyValueDifferFactory.supports(this)) {
        //     this._keyValueDiffer = keyValueDifferFactory.create(this);
        // }
    }
    Object.defineProperty(HostElement.prototype, "hostView", {
        // private _cdStatus: ChangeDetectorStatus = ChangeDetectorStatus.CheckAlways;
        // private _cdDefaultStatus: ChangeDetectorStatus = ChangeDetectorStatus.CheckAlways;
        // private _iterableDiffer: IterableDiffer;
        // private _keyValueDiffer: KeyValueDiffer;
        get: function () { return this._hostView; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostElement.prototype, "elementRef", {
        get: function () { return new element_1.ElementRef(this._hostView.rootElement); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostElement.prototype, "parent", {
        get: function () { return this._hostView.parent ? this._hostView.parent.hostElement : undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostElement.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    HostElement.prototype.attachView = function (view, viewIndex) { };
    HostElement.prototype.detachView = function (viewIndex) { };
    return HostElement;
}());
exports.HostElement = HostElement;
//# sourceMappingURL=host.js.map