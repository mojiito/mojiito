"use strict";
var DirectiveRegistry = (function () {
    function DirectiveRegistry() {
    }
    Object.defineProperty(DirectiveRegistry, "selectors", {
        get: function () { return this._selectors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectiveRegistry, "directiveTypes", {
        get: function () { return this._directiveTypes; },
        enumerable: true,
        configurable: true
    });
    DirectiveRegistry.register = function (directiveType, selector) {
        if (this._directiveTypes.indexOf(directiveType) === -1 && this._selectors.indexOf(selector) === -1) {
            this._directiveTypes.push(directiveType);
            this._selectors.push(selector);
        }
    };
    DirectiveRegistry.bySelector = function (selector) {
        var index = this._selectors.indexOf(selector);
        return index !== -1 ? this._directiveTypes[index] : null;
    };
    DirectiveRegistry._directiveTypes = [];
    DirectiveRegistry._selectors = [];
    return DirectiveRegistry;
}());
exports.DirectiveRegistry = DirectiveRegistry;
//# sourceMappingURL=registry.js.map