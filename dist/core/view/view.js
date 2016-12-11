"use strict";
var debug_1 = require('../../debug/debug');
var utils_1 = require('../../utils/utils');
var view_container_1 = require('./view-container');
exports.ViewContainerRef = view_container_1.ViewContainerRef;
var element_injector_1 = require('./element_injector');
(function (ViewType) {
    ViewType[ViewType["COMPONENT"] = 0] = "COMPONENT";
    ViewType[ViewType["EMBEDDED"] = 1] = "EMBEDDED";
    ViewType[ViewType["HOST"] = 2] = "HOST";
})(exports.ViewType || (exports.ViewType = {}));
var ViewType = exports.ViewType;
var AppView = (function () {
    function AppView(clazz, 
        // public componentType: any,
        type, parentInjector, declarationAppElement) {
        this.clazz = clazz;
        this.type = type;
        this.parentInjector = parentInjector;
        this.declarationAppElement = declarationAppElement;
        this.viewChildren = [];
        this.viewContainerElement = null;
        this.numberOfChecks = 0;
        this.ref = new ViewRef(this);
        // if (type === ViewType.COMPONENT || type === ViewType.HOST) {
        //     this.renderer = viewUtils.renderComponent(componentType);
        // } else {
        //     this.renderer = declarationAppElement.parentView.renderer;
        // }
    }
    AppView.prototype.create = function (context, rootSelectorOrNode) {
        this.context = context;
        return this.createInternal(rootSelectorOrNode);
    };
    AppView.prototype.createInternal = function (rootSelectorOrNode) { return null; };
    AppView.prototype.selectOrCreateHostElement = function (elementName, rootSelectorOrNode) {
        var hostElement;
        if (utils_1.isPresent(rootSelectorOrNode)) {
            // hostElement = this.renderer.selectRootElement(rootSelectorOrNode, debugInfo);
            hostElement = rootSelectorOrNode;
        }
        else {
            debug_1.Logger.log(debug_1.LogLevel.debug, 'UNIMPLEMENTED FEATURE: Element creation will be supported in the future, when the template functionality is implemented');
            hostElement = null;
        }
        return hostElement;
    };
    AppView.prototype.injectorGet = function (token, nodeIndex) {
        return this.injectorGetInternal(token, nodeIndex);
    };
    AppView.prototype.injectorGetInternal = function (token, nodeIndex) {
        return undefined;
    };
    AppView.prototype.injector = function (nodeIndex) {
        if (utils_1.isPresent(nodeIndex)) {
            return new element_injector_1.ElementInjector(this, nodeIndex);
        }
        else {
            return this.parentInjector;
        }
    };
    return AppView;
}());
exports.AppView = AppView;
var ViewRef = (function () {
    function ViewRef(_view) {
        this._view = _view;
        this._view = _view;
        // this._originalMode = this._view.cdMode;
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
    return ViewRef;
}());
exports.ViewRef = ViewRef;
//# sourceMappingURL=view.js.map