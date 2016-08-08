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
var di_1 = require('../di/di');
var factory_1 = require('./factory');
var reflection_1 = require('../reflect/reflection');
var ComponentResolver = (function () {
    function ComponentResolver() {
    }
    ComponentResolver.prototype.resolveComponent = function (componentClass) {
        var factory = reflection_1.ClassReflection.peek(componentClass).annotations.get(factory_1.ComponentFactory);
        if (!(factory instanceof factory_1.ComponentFactory)) {
            factory = new factory_1.ComponentFactory(componentClass);
            reflection_1.ClassReflection.peek(componentClass).annotations.set(factory_1.ComponentFactory, factory);
        }
        return factory;
    };
    ComponentResolver = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ComponentResolver);
    return ComponentResolver;
}());
exports.ComponentResolver = ComponentResolver;
//# sourceMappingURL=resolver.js.map