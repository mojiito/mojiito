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
var di_1 = require('../di/di');
var component_1 = require('../component/component');
var registry_1 = require('../directive/registry');
var resolver_1 = require('../directive/resolver');
var zone_1 = require('../zone/zone');
var runtime_1 = require('../../runtime/runtime');
exports.DEFAULT_PROVIDERS = [
    new di_1.Provider(component_1.ComponentFactoryResolver, { useClass: component_1.ComponentFactoryResolver }),
    new di_1.Provider(resolver_1.DirectiveResolver, { useClass: resolver_1.DirectiveResolver }),
    // new Provider(Parser, { useClass: Parser }),
    new di_1.Provider(zone_1.ZoneService, { useClass: zone_1.ZoneService })
];
function bootstrap(appComponentType, customProviders, root) {
    if (customProviders === void 0) { customProviders = []; }
    if (root === void 0) { root = document.body; }
    if (customProviders instanceof Element) {
        root = customProviders;
        customProviders = [];
    }
    debug_1.assert(root instanceof Element, 'Root has to be an Element!', TypeError);
    debug_1.assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);
    var rootInjector = di_1.Injector.resolveAndCreate([
        exports.DEFAULT_PROVIDERS,
        runtime_1.RUNTIME_PROVIDERS,
        customProviders,
        Application
    ]);
    rootInjector.get(runtime_1.RuntimeCompiler).compileDirectives(registry_1.DirectiveRegistry.directiveTypes);
    rootInjector.get(Application).bootstrap(appComponentType, root);
}
exports.bootstrap = bootstrap;
var Application = (function () {
    function Application(_zoneService, _renderer) {
        var _this = this;
        this._zoneService = _zoneService;
        this._renderer = _renderer;
        this._runningTick = false;
        this._zoneService.onMicrotaskEmpty.subscribe(function () { _this._zoneService.run(function () { _this.tick(); }); });
        this._zoneService.onError.subscribe(function (error) { throw error; });
    }
    Object.defineProperty(Application.prototype, "appComponent", {
        // get injector() { return this._injector; }
        get: function () { return this._appComponent; },
        enumerable: true,
        configurable: true
    });
    Application.prototype.bootstrap = function (componentOrFactory, root) {
        var _this = this;
        if (root === void 0) { root = document.documentElement; }
        this._zoneService.run(function () {
            // let type = <ClassType<C>>componentOrFactory;
            // if (componentOrFactory instanceof ComponentFactory) {
            //     type = componentOrFactory.componentType
            // }
            // let metadata: ComponentMetadata = ClassReflection.peek(type).annotations.get(ComponentMetadata);
            // assert(metadata instanceof ComponentMetadata, `The class "${stringify(type)}" has no metadata defined in the @Component decorator.`);
            // let selector = metadata.selector;
            // assert(!!(typeof selector === 'string' && selector.length), `The class "${stringify(type)}" has no selector defined in the @Component metadata object.`);
            // let rootNode = root.querySelector(selector);
            // assert(!!rootNode, `No root element found that matches the app components selector ${selector}`);
            _this._renderer.parseDOM(document.documentElement);
            // TODO
            // REWORK THE FOLLOWING PART
            // Encapsulate Rendering/Parsing from Core
            // let traverser = new DOMTraverser(new NodeVisitor(DirectiveRegistry.directiveTypes, new DirectiveResolver()));
            // traverser.traverse(rootNode, this._injector);
            // let compiler = new RuntimeCompiler(DirectiveRegistry.directiveTypes);            
            // let componentFactory: ComponentFactory<C>;
            // if (componentOrFactory instanceof ComponentFactory) {
            //     componentFactory = componentOrFactory;
            // } else {
            //     let componentResolver = <ComponentFactoryResolver>this._injector.get(ComponentFactoryResolver);
            //     componentFactory = componentResolver.resolveComponent(componentOrFactory)
            // }
            // let metadata: ComponentMetadata = ClassReflection.peek(componentFactory.componentType).annotations.get(ComponentMetadata);
            // assert(metadata instanceof ComponentMetadata, `The class "${stringify(componentFactory.componentType)}" has no metadata defined in the @Component decorator.`);
            // let element: Element;
            // let selector = metadata.selector;
            // assert(!!(typeof selector === 'string' && selector.length), `The class "${stringify(componentFactory.componentType)}" has no selector defined in the @Component metadata object.`);
            // if (doesSelectorMatchElement(selector, root)) {
            //     element = root;
            // } else {
            //     let elements = root.querySelectorAll(selector);
            //     assert(
            //         !!elements.length,
            //         `Mojito could not find an element matching the selector "${selector}" of the "${stringify(componentFactory.componentType)}" component provided to the bootstrap function`
            //     );
            //     assert(
            //         elements.length === 1,
            //         `There are more than one elements matching the selector "${selector}" of the "${stringify(componentFactory.componentType)}" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!`
            //     );
            //     element = elements[0];
            // }
            // let appRef = this._appComponent = componentFactory.create(this._injector, element);
            // appRef.parse();
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
        __param(1, di_1.Inject(runtime_1.RuntimeRenderer)), 
        __metadata('design:paramtypes', [zone_1.ZoneService, runtime_1.RuntimeRenderer])
    ], Application);
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map