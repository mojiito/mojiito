"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        return !!attribute.name.match(/^\[\w+\]|bind-\w+|data-bind-\w+$/);
    };
    BindingParserHook.prototype.onParse = function (element, attribute, context) {
        var view = context.getNearestContextOfType(view_1.View);
        var host = view.hostElement;
        var attrName = attribute.name;
        var bindingName = '';
        var bindingExpression = attribute.value;
        var isComponent = context.getUnfiltered()[0].filter(function (value) { return value.context === view; }).length
            && view.hostElement.componentView === view;
        if (attrName.indexOf('on-') !== -1) {
            bindingName = attrName.split('on-')[1];
        }
        else {
            bindingName = attrName.match(/\w+(-\w+)*/)[0];
        }
        var exprParser = new parser_1.ExpressionParser(bindingExpression);
        var executable = exprParser.parse(function (token) {
            // Check for template var in view
            if (!isComponent && view !== host.componentView && view.getTemplateVar(token, false)) {
                return view.templateVars;
            }
            // Check for template var in component view
            if (!isComponent && host.componentView.getTemplateVar(token, false)) {
                return host.componentView.templateVars;
            }
            // Check for template var in parent component view
            if (isComponent && host.parent.componentView.getTemplateVar(token, false)) {
                return host.parent.componentView.templateVars;
            }
            // Check for var or method in 
            return isComponent ? host.parent.component : host.component;
        });
        var bindingType = bindingName.split('.')[0];
        if (bindingType === 'attr') {
        }
        else if (bindingType === 'class') {
        }
        else {
        }
        // console.log(bindingName);
    };
    return BindingParserHook;
}(hooks_1.ParserAttributeHook));
exports.BindingParserHook = BindingParserHook;
//# sourceMappingURL=binding.js.map