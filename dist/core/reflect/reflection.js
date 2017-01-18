"use strict";
var map_1 = require('../../core/map/map');
// assert(!!(Reflect && Reflect.defineMetadata), 'reflect-metadata shim is required! Please make sure it is installed.');
var ClassReflection = (function () {
    function ClassReflection() {
        this._properties = new map_1.TypedMap();
        this._parameters = [];
        this._annotations = new map_1.TypedMap();
    }
    Object.defineProperty(ClassReflection.prototype, "properties", {
        get: function () {
            return this._properties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassReflection.prototype, "parameters", {
        get: function () {
            return this._parameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassReflection.prototype, "annotations", {
        get: function () {
            return this._annotations;
        },
        enumerable: true,
        configurable: true
    });
    ClassReflection.peek = function (classType) {
        if (this.isReflected(classType)) {
            // return Reflect.getMetadata('reflection', classType);
            return classType['__reflection__'];
        }
        var reflection = new ClassReflection();
        // Reflect.defineMetadata('reflection', reflection, classType);
        classType['__reflection__'] = reflection;
        return reflection;
    };
    ClassReflection.isReflected = function (classType) {
        return !!classType['__reflection__'];
        // return Reflect.hasMetadata('reflection', classType);
    };
    return ClassReflection;
}());
exports.ClassReflection = ClassReflection;
//# sourceMappingURL=reflection.js.map