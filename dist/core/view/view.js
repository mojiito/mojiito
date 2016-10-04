"use strict";
var utils_1 = require('../../utils/utils');
var change_detection_1 = require('../change_detection/change_detection');
(function (ViewType) {
    ViewType[ViewType["COMPONENT"] = 0] = "COMPONENT";
    ViewType[ViewType["EMBEDDED"] = 1] = "EMBEDDED";
    ViewType[ViewType["HOST"] = 2] = "HOST";
})(exports.ViewType || (exports.ViewType = {}));
var ViewType = exports.ViewType;
var View = (function () {
    function View(
        // public clazz: any,
        // public componentType: any,
        type, parentInjector, declarationAppElement, cdMode) {
        this.type = type;
        this.parentInjector = parentInjector;
        this.declarationAppElement = declarationAppElement;
        this.cdMode = cdMode;
        this.viewChildren = [];
        this.viewContainerElement = null;
        this.numberOfChecks = 0;
        this.ref = new ViewRef(this);
    }
    Object.defineProperty(View.prototype, "destroyed", {
        get: function () { return this.cdMode === change_detection_1.ChangeDetectorStatus.Destroyed; },
        enumerable: true,
        configurable: true
    });
    View.prototype.create = function (context, givenProjectableNodes, rootSelectorOrNode) {
        this.context = context;
        return null;
    };
    View.prototype.destroy = function () { };
    View.prototype.detectChanges = function (throwOnChange) {
        if (this.cdMode === change_detection_1.ChangeDetectorStatus.Checked ||
            this.cdMode === change_detection_1.ChangeDetectorStatus.Errored)
            return;
        if (this.cdMode === change_detection_1.ChangeDetectorStatus.Destroyed) {
        }
        this.detectChangesInternal(throwOnChange);
        if (this.cdMode === change_detection_1.ChangeDetectorStatus.CheckOnce)
            this.cdMode = change_detection_1.ChangeDetectorStatus.Checked;
        this.numberOfChecks++;
    };
    View.prototype.detectChangesInternal = function (throwOnChange) { };
    View.prototype.markPathToRootAsCheckOnce = function () {
        var c = this;
        while (utils_1.isPresent(c) && c.cdMode !== change_detection_1.ChangeDetectorStatus.Detached) {
            if (c.cdMode === change_detection_1.ChangeDetectorStatus.Checked) {
                c.cdMode = change_detection_1.ChangeDetectorStatus.CheckOnce;
            }
            var parentEl = c.type === ViewType.COMPONENT ? c.declarationAppElement : c.viewContainerElement;
            c = utils_1.isPresent(parentEl) ? parentEl.parentView : null;
        }
    };
    return View;
}());
exports.View = View;
var ViewRef = (function () {
    function ViewRef(_view) {
        this._view = _view;
        this._view = _view;
        this._originalMode = this._view.cdMode;
    }
    Object.defineProperty(ViewRef.prototype, "internalView", {
        get: function () { return this._view; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewRef.prototype, "rootNodes", {
        get: function () { return null; /* this._view.flatRootNodes;*/ },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewRef.prototype, "context", {
        get: function () { return this._view.context; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewRef.prototype, "destroyed", {
        get: function () { return this._view.destroyed; },
        enumerable: true,
        configurable: true
    });
    ViewRef.prototype.markForCheck = function () {
        this._view.markPathToRootAsCheckOnce();
    };
    ViewRef.prototype.detach = function () {
        this._view.cdMode = change_detection_1.ChangeDetectorStatus.Detached;
    };
    ViewRef.prototype.detectChanges = function () {
        this._view.detectChanges(false);
        // triggerQueuedAnimations();
    };
    ViewRef.prototype.checkNoChanges = function () {
        this._view.detectChanges(true);
    };
    ViewRef.prototype.reattach = function () {
        this._view.cdMode = this._originalMode;
        this.markForCheck();
    };
    ViewRef.prototype.onDestroy = function (callback) {
        this._view.disposables.push(callback);
    };
    ViewRef.prototype.destroy = function () {
        // this._view.destroy();
    };
    return ViewRef;
}());
exports.ViewRef = ViewRef;
//# sourceMappingURL=view.js.map