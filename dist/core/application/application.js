"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var debug_1 = require('../../debug/debug');
var utils_1 = require('../../utils/utils');
var di_1 = require('../di/di');
var factory_1 = require('../directive/factory');
var resolver_1 = require('../directive/resolver');
var zone_1 = require('../zone/zone');
var runtime_1 = require('../../runtime/runtime');
exports.CORE_PROVIDERS = [
    resolver_1.DirectiveResolver
];
function bootstrap(appComponentType, customProviders, root) {
    if (customProviders === void 0) { customProviders = []; }
    if (root === void 0) { root = document.body; }
    if (customProviders instanceof Element) {
        root = customProviders;
        customProviders = [];
    }
    debug_1.assert(utils_1.isClassType((appComponentType)), "The first argument (\"appComponentType\") of the bootstrap function has to be a class", TypeError);
    debug_1.assert(root instanceof Element, 'Root has to be an Element!', TypeError);
    debug_1.assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);
    var rootInjector = di_1.Injector.resolveAndCreate([
        zone_1.ZONE_PROVIDERS,
        runtime_1.RUNTIME_PROVIDERS,
        exports.CORE_PROVIDERS,
        customProviders,
        Application
    ]);
    rootInjector.get(Application).bootstrap(appComponentType, rootInjector, root);
}
exports.bootstrap = bootstrap;
var Application = (function () {
    // get injector() { return this._injector; }
    // get appComponent() { return this._appComponent; }
    function Application(_zoneService, _compiler) {
        var _this = this;
        this._zoneService = _zoneService;
        this._compiler = _compiler;
        this._runningTick = false;
        this._zoneService.onMicrotaskEmpty.subscribe(function () { _this._zoneService.run(function () { _this.tick(); }); });
        this._zoneService.onError.subscribe(function (error) { throw error; });
    }
    Application.prototype.bootstrap = function (componentOrFactory, injector, root) {
        var _this = this;
        if (root === void 0) { root = document.documentElement; }
        this._zoneService.run(function () {
            var type = componentOrFactory;
            if (componentOrFactory instanceof factory_1.ComponentFactory) {
                type = componentOrFactory.componentType;
            }
            var compiledDirectives = _this._compiler.compileDirectiveAndAllChilds(type);
            console.log(compiledDirectives);
        });
    };
    Application.prototype.tick = function () {
        // assert(!this._runningTick, `Tick is already running. You may call tick recursivly!`);
        // this._runningTick = true;
        // assert(!!this._appComponent, `Please call "bootstrap" before the first tick!`);
        // this._appComponent.hostElement.detectChanges();
        // this._runningTick = false;
    };
    Application = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(zone_1.ZoneService)),
        __param(1, di_1.Inject(runtime_1.RuntimeCompiler)), 
        __metadata('design:paramtypes', [zone_1.ZoneService, runtime_1.RuntimeCompiler])
    ], Application);
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map