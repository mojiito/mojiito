"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var debug_1 = require('../../../debug/debug');
var utils_1 = require('../../../utils/utils');
var hooks_1 = require('./hooks');
var view_1 = require('../../../core/view/view');
var parser_1 = require('../expression_parser/parser');
var BindingParserHook = (function (_super) {
    __extends(BindingParserHook, _super);
    function BindingParserHook() {
        _super.call(this);
        this.removeAttributeNode = true;
    }
    BindingParserHook.prototype.predicate = function (attribute) {
        return /^(\[|(data-)?bind-)((class|attr|style)(\.|-))?(\w+(-\w+)*)\]?$/.test(attribute.name);
    };
    BindingParserHook.prototype.onParse = function (element, attribute, context) {
        var view = context.getNearestContextOfType(view_1.View);
        var host = view.hostElement;
        var attrName = attribute.name;
        var bindingName = '';
        var bindingUnit = '';
        var bindingExpression = attribute.value;
        var parts;
        var isComponentBinding = context.getUnfiltered()[0].filter(function (value) { return value.context === view; }).length
            && view.hostElement.componentView === view;
        var exprParser = new parser_1.ExpressionParser(bindingExpression);
        var bindingKeys = [];
        var executable = exprParser.parse(function (token) {
            if (isComponentBinding) {
                // Check for template var in parent component view
                if (host.parent.componentView.getTemplateVar(token, false)) {
                    return host.parent.componentView.templateVars;
                }
                return host.parent.component;
            }
            else {
                // Check for template var in view
                if (view !== host.componentView && view.getTemplateVar(token, false)) {
                    return view.templateVars;
                }
                // Check for template var in component view
                if (host.componentView.getTemplateVar(token, false)) {
                    return host.componentView.templateVars;
                }
                bindingKeys.push(token);
                return host.component;
            }
        });
        if (isComponentBinding) {
        }
        else {
            if (/^\[((class|attr|style)\.)?\w+(-\w+)*(\.(\w+|%))?\]$/.test(attrName)) {
                attrName = attrName.replace(/\[|\]/g, '');
                parts = attrName.split('.');
            }
            else if (/^((data-)?bind-)((class|attr|style)\.)?\w+(-\w+)*(\-(\w+|%))?$/.test(attrName)) {
                attrName = attrName.replace(/data-|bind-/g, '');
                parts = attrName.split('.');
            }
            else
                throw new SyntaxError("Attribute \"" + attrName + "\" is not a valid binding syntax!");
            if (parts.length === 1) {
                // [value]
                bindingName = parts[0];
                debug_1.assert(bindingName in element, "Can not bind \"" + bindingName + "\" on an " + utils_1.stringify(element) + " because it is not a valid property!");
                bindingKeys.forEach(function (key) { return view.addBinding(key, function () {
                    var result = executable.execute();
                    debug_1.assert(utils_1.isPrimitive(result), "The expression " + bindingExpression + " on binding " + attribute.name + " results in an unvalid type. Only primitive value types are allowed for property bindings.");
                    element[bindingName] = result;
                }); });
            }
            else if (parts[0] === 'class' && parts.length == 2) {
                // [class.my-class]
                bindingName = parts[1];
                bindingKeys.forEach(function (key) { return view.addBinding(key, function () {
                    if (!!executable.execute())
                        element.classList.add(bindingName);
                    else
                        element.classList.remove(bindingName);
                }); });
            }
            else if (parts[0] === 'attr' && parts.length == 2) {
                // [attr.aria-hidden]
                bindingName = parts[1];
                bindingKeys.forEach(function (key) { return view.addBinding(key, function () {
                    var result = executable.execute();
                    debug_1.assert(utils_1.isPrimitive(result), "The expression " + bindingExpression + " on binding " + attribute.name + " results in an unvalid type. Only primitive value types are allowed for attribute bindings.");
                    element.setAttribute(bindingName, '' + result);
                }); });
            }
            else if (parts[0] === 'style' && parts.length >= 2 && parts.length <= 3) {
                // [style.color] or [style.font-size.em]
                bindingName = utils_1.kebabToCamelCase(parts[1]);
                bindingUnit = parts[2] || '';
                bindingKeys.forEach(function (key) { return view.addBinding(key, function () {
                    var result = executable.execute();
                    debug_1.assert(utils_1.isPrimitive(result) || utils_1.isObject(result), "The expression " + bindingExpression + " on binding " + attribute.name + " results in an unvalid type. Only primitive value types or objects are allowed for style bindings.");
                    if (utils_1.isObject(result)) {
                    }
                    else {
                        debug_1.assert(bindingName in element.style, "Can not bind \"" + attribute.name + "\" on an " + utils_1.stringify(element) + " because " + parts[1] + " it is not a valid style property!");
                        element.style[bindingName] = result + bindingUnit;
                    }
                }); });
            }
        }
    };
    return BindingParserHook;
}(hooks_1.ParserAttributeHook));
exports.BindingParserHook = BindingParserHook;
//# sourceMappingURL=binding.js.map