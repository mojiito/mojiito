"use strict";
var DirectiveRegistry = (function () {
    function DirectiveRegistry() {
    }
    Object.defineProperty(DirectiveRegistry, "directiveTypes", {
        get: function () { return this._directiveTypes; },
        enumerable: true,
        configurable: true
    });
    DirectiveRegistry.register = function (directiveType) {
        if (this._directiveTypes.indexOf(directiveType) === -1) {
            this._directiveTypes.push(directiveType);
        }
    };
    DirectiveRegistry._directiveTypes = [];
    return DirectiveRegistry;
}());
exports.DirectiveRegistry = DirectiveRegistry;
//# sourceMappingURL=registry.js.map