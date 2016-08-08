"use strict";
var reference_1 = require('./reference');
var metadata_1 = require('./metadata');
var host_1 = require('../view/host');
var element_1 = require('../view/element');
var reflection_1 = require('../reflect/reflection');
var di_1 = require('../di/di');
var ComponentFactory = (function () {
    function ComponentFactory(componentType) {
        this._componentType = componentType;
    }
    Object.defineProperty(ComponentFactory.prototype, "componentType", {
        get: function () { return this._componentType; },
        enumerable: true,
        configurable: true
    });
    ComponentFactory.prototype.create = function (injector, nativeElement) {
        var _this = this;
        var metadata = reflection_1.ClassReflection.peek(this._componentType).annotations.get(metadata_1.ComponentMetadata);
        var parentHostElement = injector.get(host_1.HostElement);
        var hostElement = new host_1.HostElement(nativeElement, parentHostElement);
        if (parentHostElement instanceof host_1.HostElement) {
            parentHostElement.registerChild(hostElement);
        }
        var providers = Array.isArray(metadata.providers) ? metadata.providers : [];
        providers = providers.concat([
            di_1.provide(element_1.ElementRef, { useValue: hostElement.elementRef }),
            di_1.provide(host_1.HostElement, { useValue: hostElement }),
            di_1.provide(hostElement, { useClass: di_1.forwardRef(function () { return _this._componentType; }) })
        ]);
        var inj = injector.resolveAndCreateChild(providers);
        var component = inj.get(hostElement);
        hostElement.initComponent(component, inj);
        var ref = new reference_1.ComponentReference(hostElement, this._componentType);
        return ref;
    };
    return ComponentFactory;
}());
exports.ComponentFactory = ComponentFactory;
//# sourceMappingURL=factory.js.map