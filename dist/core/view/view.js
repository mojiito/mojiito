"use strict";
var assert_1 = require('../../debug/assert/assert');
var parser_1 = require('../../render/parser/parser');
var View = (function () {
    function View(element, hostElement, cdStatus) {
        this._templateVars = {};
        this._rootElement = element;
        this._hostElement = hostElement;
        this._parser = this._hostElement.injector.get(parser_1.Parser);
    }
    Object.defineProperty(View.prototype, "rootElement", {
        get: function () { return this._rootElement; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "hostElement", {
        get: function () { return this._hostElement; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "templateVars", {
        get: function () { return this._templateVars; },
        enumerable: true,
        configurable: true
    });
    View.prototype.parse = function () {
        this._parser.parse(this._rootElement, this, true);
    };
    View.prototype.addTemplateVar = function (key, element) {
        assert_1.assert(!(this._templateVars[key] instanceof Element), "There is already a template variable \"" + key + "\" set on this view!");
        this._templateVars[key] = element;
    };
    View.prototype.getTemplateVar = function (key, hostLookup) {
        if (hostLookup === void 0) { hostLookup = true; }
        var hostView = this.hostElement.getView(-1);
        var element = this._templateVars[key] || null;
        if (hostLookup && !(element instanceof Element) && hostView !== this) {
            element = hostView.getTemplateVar(key);
        }
        return element;
    };
    View.prototype.destroy = function () { };
    return View;
}());
exports.View = View;
//# sourceMappingURL=view.js.map