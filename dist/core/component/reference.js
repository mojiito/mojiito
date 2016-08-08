"use strict";
var ComponentReference = (function () {
    function ComponentReference(hostElement, componentType) {
        this._hostElement = hostElement;
        this._componentType = componentType;
    }
    Object.defineProperty(ComponentReference.prototype, "hostElement", {
        get: function () {
            return this._hostElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentReference.prototype, "instance", {
        get: function () {
            return this._hostElement.component;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentReference.prototype, "injector", {
        get: function () {
            return this._hostElement.injector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentReference.prototype, "componentType", {
        get: function () {
            return this._componentType;
        },
        enumerable: true,
        configurable: true
    });
    ComponentReference.prototype.parse = function () {
        this._hostElement.parse();
    };
    ComponentReference.prototype.destroy = function () {
        // TODO!
    };
    return ComponentReference;
}());
exports.ComponentReference = ComponentReference;
//# sourceMappingURL=reference.js.map