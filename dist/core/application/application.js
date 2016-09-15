"use strict";
var debug_1 = require('../../debug/debug');
var utils_1 = require('../../utils/utils');
var di_1 = require('../di/di');
var component_1 = require('../component/component');
var metadata_1 = require('../directive/metadata');
var reflection_1 = require('../reflect/reflection');
var parser_1 = require('../../render/parser/parser');
var zone_1 = require('../zone/zone');
var dom_traverser_1 = require('../../browser/dom_traverser');
var node_visitor_1 = require('../../browser/node_visitor');
exports.DEFAULT_PROVIDERS = [
    new di_1.Provider(component_1.ComponentFactoryResolver, { useClass: component_1.ComponentFactoryResolver }),
    new di_1.Provider(parser_1.Parser, { useClass: parser_1.Parser }),
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
    var rootInjector = di_1.Injector.resolveAndCreate(exports.DEFAULT_PROVIDERS.concat(customProviders));
    var app = new Application(rootInjector);
    app.bootstrap(appComponentType, root);
    return app;
}
exports.bootstrap = bootstrap;
var Application = (function () {
    function Application(injector) {
        var _this = this;
        this._runningTick = false;
        this._injector = injector;
        var zoneService = this._zoneService = this._injector.get(zone_1.ZoneService);
        zoneService.onMicrotaskEmpty.subscribe(function () { zoneService.run(function () { _this.tick(); }); });
        zoneService.onError.subscribe(function (error) { throw error; });
    }
    Object.defineProperty(Application.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "appComponent", {
        get: function () { return this._appComponent; },
        enumerable: true,
        configurable: true
    });
    Application.prototype.bootstrap = function (componentOrFactory, root) {
        var _this = this;
        if (root === void 0) { root = document.body; }
        console.time('parse');
        var trav = new dom_traverser_1.DOMTraverser(new node_visitor_1.NodeVisitor());
        trav.traverse(document.body);
        console.timeEnd('parse');
        this._zoneService.run(function () {
            var componentFactory;
            if (componentOrFactory instanceof component_1.ComponentFactory) {
                componentFactory = componentOrFactory;
            }
            else {
                var componentResolver = _this._injector.get(component_1.ComponentFactoryResolver);
                componentFactory = componentResolver.resolveComponent(componentOrFactory);
            }
            var metadata = reflection_1.ClassReflection.peek(componentFactory.componentType).annotations.get(metadata_1.ComponentMetadata);
            debug_1.assert(metadata instanceof metadata_1.ComponentMetadata, "The class \"" + utils_1.stringify(componentFactory.componentType) + "\" has no metadata defined in the @Component decorator.");
            var element;
            var selector = metadata.selector;
            debug_1.assert(!!(typeof selector === 'string' && selector.length), "The class \"" + utils_1.stringify(componentFactory.componentType) + "\" has no selector defined in the @Component metadata object.");
            if (utils_1.doesSelectorMatchElement(selector, root)) {
                element = root;
            }
            else {
                var elements = root.querySelectorAll(selector);
                debug_1.assert(!!elements.length, "Mojito could not find an element matching the selector \"" + selector + "\" of the \"" + utils_1.stringify(componentFactory.componentType) + "\" component provided to the bootstrap function");
                debug_1.assert(elements.length === 1, "There are more than one elements matching the selector \"" + selector + "\" of the \"" + utils_1.stringify(componentFactory.componentType) + "\" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!");
                element = elements[0];
            }
            var appRef = _this._appComponent = componentFactory.create(_this._injector, element);
            appRef.parse();
        });
    };
    Application.prototype.tick = function () {
        debug_1.assert(!this._runningTick, "Tick is already running. You may call tick recursivly!");
        this._runningTick = true;
        debug_1.assert(!!this._appComponent, "Please call \"bootstrap\" before the first tick!");
        this._appComponent.hostElement.detectChanges();
        this._runningTick = false;
    };
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map