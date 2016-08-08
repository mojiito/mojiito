"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var hooks_1 = require('./hooks');
var view_1 = require('../../../core/view/view');
var TemplateVariableParserHook = (function (_super) {
    __extends(TemplateVariableParserHook, _super);
    function TemplateVariableParserHook() {
        _super.call(this);
        this.removeAttributeNode = true;
    }
    TemplateVariableParserHook.prototype.predicate = function (attribute) {
        return !!attribute.name.match(/^\#\w+|ref-\w+|data-ref-\w+$/);
    };
    TemplateVariableParserHook.prototype.onParse = function (element, attribute, context) {
        var view = context.getNearestContextOfType(view_1.View);
        var parts = attribute.name.split('-');
        var name = parts[parts.length - 1].match(/\w+/)[0];
        view.addTemplateVar(name, element);
    };
    return TemplateVariableParserHook;
}(hooks_1.ParserAttributeHook));
exports.TemplateVariableParserHook = TemplateVariableParserHook;
//# sourceMappingURL=template_variable.js.map