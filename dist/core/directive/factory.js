"use strict";
var ComponentFactory = (function () {
    function ComponentFactory(_componentType, _viewFactory) {
        this._componentType = _componentType;
        this._viewFactory = _viewFactory;
    }
    Object.defineProperty(ComponentFactory.prototype, "componentType", {
        get: function () { return this._componentType; },
        enumerable: true,
        configurable: true
    });
    ComponentFactory.prototype.create = function (injector, nativeElement) {
        var hostView = this._viewFactory(injector, null);
        var hostElement = hostView.create({}, nativeElement);
        return new ComponentRef(hostElement, this._componentType);
    };
    return ComponentFactory;
}());
exports.ComponentFactory = ComponentFactory;
var ComponentRef = (function () {
    function ComponentRef(_hostElement, _componentType) {
        this._hostElement = _hostElement;
        this._componentType = _componentType;
    }
    Object.defineProperty(ComponentRef.prototype, "location", {
        get: function () { return this._hostElement.elementRef; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRef.prototype, "injector", {
        get: function () { return this._hostElement.injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRef.prototype, "instance", {
        get: function () { return this._hostElement.component; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef.prototype, "hostView", {
        get: function () { return this._hostElement.parentView.ref; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef.prototype, "componentType", {
        // get changeDetectorRef(): ChangeDetector { return this._hostElement.parentView.ref; };
        get: function () { return this._componentType; },
        enumerable: true,
        configurable: true
    });
    return ComponentRef;
}());
exports.ComponentRef = ComponentRef;
// https://github.com/angular/angular/blob/master/modules/%40angular/core/src/linker/component_factory_resolver.ts#L40
var ComponentFactoryResolver = (function () {
    function ComponentFactoryResolver(factories, _parent) {
        this._parent = _parent;
        this._factories = new Map();
        for (var i = 0; i < factories.length; i++) {
            var factory = factories[i];
            this._factories.set(factory.componentType, factory);
        }
    }
    ComponentFactoryResolver.prototype.resolveComponentFactory = function (component) {
        var result = this._factories.get(component);
        if (!result && this._parent instanceof ComponentFactoryResolver) {
            result = this._parent.resolveComponentFactory(component);
        }
        return result;
    };
    return ComponentFactoryResolver;
}());
exports.ComponentFactoryResolver = ComponentFactoryResolver;
//# sourceMappingURL=factory.js.map