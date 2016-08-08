"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var debug_1 = require('../../../debug/debug');
var stringify_1 = require('../../../utils/string/stringify');
var hooks_1 = require('./hooks');
var dom_1 = require('../../../utils/dom/dom');
var registry_1 = require('../../../core/directive/registry');
var view_1 = require('../../../core/view/view');
var host_1 = require('../../../core/view/host');
var ComponentParserHook = (function (_super) {
    __extends(ComponentParserHook, _super);
    function ComponentParserHook(resolver) {
        _super.call(this);
        this.resolver = resolver;
        this.selectors = registry_1.DirectiveRegistry.selectors;
        this.lastFoundSelectorIndex = -1;
    }
    ComponentParserHook.prototype.predicate = function (element) {
        for (var i = 0, max = this.selectors.length; i < max; i++) {
            if (dom_1.doesSelectorMatchElement(this.selectors[i], element)) {
                this.lastFoundSelectorIndex = i;
                return true;
            }
        }
        this.lastFoundSelectorIndex = -1;
        return false;
    };
    ComponentParserHook.prototype.onBeforeParse = function (element, context) {
        var componentType = registry_1.DirectiveRegistry.directiveTypes[this.lastFoundSelectorIndex];
        var factory = this.resolver.resolveComponent(componentType);
        var view = context.getNearestContextOfType(view_1.View);
        debug_1.assert(view instanceof view_1.View, "The found view on the element " + element + " has to be of the type View!");
        debug_1.assert(view.hostElement instanceof host_1.HostElement, "The found component \"" + stringify_1.stringify(componentType) + "\" on the element " + element + " has no parent host element.\nAre you using the bootstrap function for setting up your project?");
        var componentRef = factory.create(view.hostElement.injector, element);
        this.lastFoundSelectorIndex = -1;
        return componentRef.hostElement.getView(-1);
    };
    return ComponentParserHook;
}(hooks_1.ParserElementHook));
exports.ComponentParserHook = ComponentParserHook;
//# sourceMappingURL=component.js.map