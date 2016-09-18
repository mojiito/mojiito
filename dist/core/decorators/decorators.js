"use strict";
var reflection_1 = require('../../core/reflect/reflection');
var registry_1 = require('../../core/directive/registry');
function createClassDecorator(metadataClass) {
    return function (objOrType) {
        return function (cls) {
            reflection_1.ClassReflection.peek(cls).annotations.set(metadataClass, new metadataClass(objOrType));
            // if objOrType has a selector property we asume that cls is a component or DirectiveMetadata
            // so we can add it to the c
            if (typeof objOrType === 'object' && typeof objOrType.selector === 'string') {
                registry_1.DirectiveRegistry.register(cls);
            }
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