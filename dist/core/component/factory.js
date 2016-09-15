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
var reference_1 = require('./reference');
var metadata_1 = require('../directive/metadata');
var host_1 = require('../view/host');
var element_1 = require('../view/element');
var reflection_1 = require('../reflect/reflection');
var di_1 = require('../di/di');
var di_2 = require('../di/di');
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
var ComponentFactoryResolver = (function () {
    function ComponentFactoryResolver() {
    }
    ComponentFactoryResolver.prototype.resolveComponent = function (componentClass) {
        var factory = reflection_1.ClassReflection.peek(componentClass).annotations.get(ComponentFactory);
        if (!(factory instanceof ComponentFactory)) {
            factory = new ComponentFactory(componentClass);
            reflection_1.ClassReflection.peek(componentClass).annotations.set(ComponentFactory, factory);
        }
        return factory;
    };
    ComponentFactoryResolver = __decorate([
        di_2.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ComponentFactoryResolver);
    return ComponentFactoryResolver;
}());
exports.ComponentFactoryResolver = ComponentFactoryResolver;
//# sourceMappingURL=factory.js.map