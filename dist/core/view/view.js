"use strict";
var assert_1 = require('../../debug/assert/assert');
var events_1 = require('../async/events');
var host_1 = require('./host');
(function (ViewType) {
    ViewType[ViewType["Embedded"] = 0] = "Embedded";
    ViewType[ViewType["Host"] = 1] = "Host";
})(exports.ViewType || (exports.ViewType = {}));
var ViewType = exports.ViewType;
var View = (function () {
    function View(element) {
        this._templateVars = {};
        this._bindings = {};
        this._rootElement = element;
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
    Object.defineProperty(View.prototype, "type", {
        get: function () { return this._type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "templateVars", {
        get: function () { return this._templateVars; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isAttached", {
        get: function () { return this._hostElement instanceof host_1.HostElement; },
        enumerable: true,
        configurable: true
    });
    View.prototype.parse = function () {
        assert_1.assert(this.isAttached, "View can only be parsed if it is attached to a host element");
        // this._parser.parse(this._rootElement, this, false);
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
    View.prototype.attach = function (hostElement, type) {
        if (type === void 0) { type = ViewType.Embedded; }
        assert_1.assert(!this.isAttached, "View is already attached, please detach before reattaching!");
        this._hostElement = hostElement;
        // this._parser = this._hostElement.injector.get(Parser);
        this._type = type;
    };
    View.prototype.detach = function () {
        assert_1.assert(this.isAttached, "View is already detached!");
        this._hostElement = null;
        // this._parser = null;
    };
    View.prototype.destroy = function () { };
    View.prototype.addBinding = function (key, fn) {
        var emitter = this._peekBindingForKey(key);
        emitter.subscribe(fn);
    };
    View.prototype.getBindingsForKey = function (key) {
        return this._peekBindingForKey(key);
    };
    View.prototype._peekBindingForKey = function (key) {
        var emitter = this._bindings[key];
        if (!(emitter instanceof events_1.EventEmitter)) {
            emitter = new events_1.EventEmitter();
            this._bindings[key] = emitter;
        }
        return emitter;
    };
    return View;
}());
exports.View = View;
//# sourceMappingURL=view.js.map