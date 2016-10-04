"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var di_1 = require('../di/di');
var factory_1 = require('../directive/factory');
var AppInjector = (function (_super) {
    __extends(AppInjector, _super);
    function AppInjector(factories, providers, parent) {
        if (providers === void 0) { providers = []; }
        _super.call(this, providers);
    }
    Object.defineProperty(AppInjector.prototype, "injector", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppInjector.prototype, "componentFactoryResolver", {
        get: function () { return this._componentFactoryResolver; },
        enumerable: true,
        configurable: true
    });
    AppInjector.prototype.get = function (token) {
        if (token === factory_1.ComponentFactoryResolver)
            return this;
        return _super.prototype.get.call(this, token);
    };
    return AppInjector;
}(di_1.Injector));
exports.AppInjector = AppInjector;
//# sourceMappingURL=app-injector.js.map