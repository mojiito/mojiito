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
        // let metadata: ComponentMetadata = ClassReflection.peek(this._componentType).annotations.get(ComponentMetadata);
        // let parentHostElement: HostElement = injector.get(HostElement);
        // let hostElement = new HostElement(nativeElement, parentHostElement);
        // if (parentHostElement instanceof HostElement) {
        //     parentHostElement.registerChild(hostElement);
        // }
        // let providers = Array.isArray(metadata.providers) ? metadata.providers : [];
        // providers = providers.concat([
        //     provide(ElementRef, { useValue: hostElement.elementRef }),
        //     provide(HostElement, { useValue: hostElement }),
        //     provide(hostElement, { useClass: forwardRef(() => this._componentType) })
        // ]);
        // let inj = injector.resolveAndCreateChild(providers);
        // let component = inj.get(hostElement);
        // hostElement.initComponent(component, inj);
        // var hostView = new View(
        // const hostElement = hostView.create(new Object(), null, nativeElement);
        // return new ComponentRef<C>(hostElement, this._componentType);
        return null;
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
    Object.defineProperty(ComponentRef.prototype, "changeDetectorRef", {
        get: function () { return this._hostElement.parentView.ref; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef.prototype, "componentType", {
        get: function () { return this._componentType; },
        enumerable: true,
        configurable: true
    });
    ComponentRef.prototype.destroy = function () { this._hostElement.parentView.destroy(); };
    ComponentRef.prototype.onDestroy = function (callback) { this.hostView.onDestroy(callback); };
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