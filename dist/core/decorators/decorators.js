"use strict";
var reflection_1 = require('../../core/reflect/reflection');
function createClassDecorator(metadataClass) {
    return function (objOrType) {
        return function (cls) {
            reflection_1.ClassReflection.peek(cls).annotations.set(metadataClass, new metadataClass(objOrType));
        };
    };
}
exports.createClassDecorator = createClassDecorator;
function createParameterDecorator(metadataClass) {
    return function (objOrType) {
        return function (cls, propertyKey, parameterIndex) {
            if (typeof parameterIndex === 'number' && parameterIndex >= 0) {
                reflection_1.ClassReflection.peek(cls).parameters[parameterIndex] = new metadataClass(objOrType);
            }
            else {
                reflection_1.ClassReflection.peek(cls).parameters.push(new metadataClass(objOrType));
            }
        };
    };
}
exports.createParameterDecorator = createParameterDecorator;
function createPropertyDecoratory(metadataClass) {
    return function (objOrType) {
        return function (target, propertyKey) {
            reflection_1.ClassReflection.peek(target.constructor).properties.set(propertyKey, new metadataClass(objOrType || propertyKey));
        };
    };
}
exports.createPropertyDecoratory = createPropertyDecoratory;
//# sourceMappingURL=decorators.js.map