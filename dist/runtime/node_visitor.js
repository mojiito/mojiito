"use strict";
var utils_1 = require('../utils/utils');
var debug_1 = require('../debug/debug');
var di_1 = require('../core/di/di');
var selector_1 = require('./selector');
var expression_1 = require('./expression');
var ast_1 = require('./ast');
// https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/template_parser/template_parser.ts#L35
// Group 1 = "bind-"
// Group 2 = "let-"
// Group 3 = "ref-/#"
// Group 4 = "on-"
// Group 5 = "bindon-"
// Group 6 = "@"
// Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
// Group 8 = identifier inside [()]
// Group 9 = identifier inside []
// Group 10 = identifier inside ()
var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
var BIND_NAME_POS;
(function (BIND_NAME_POS) {
    BIND_NAME_POS[BIND_NAME_POS["UNDEFINED"] = 0] = "UNDEFINED";
    BIND_NAME_POS[BIND_NAME_POS["KW_BIND_IDX"] = 1] = "KW_BIND_IDX";
    BIND_NAME_POS[BIND_NAME_POS["KW_LET_IDX"] = 2] = "KW_LET_IDX";
    BIND_NAME_POS[BIND_NAME_POS["KW_REF_IDX"] = 3] = "KW_REF_IDX";
    BIND_NAME_POS[BIND_NAME_POS["KW_ON_IDX"] = 4] = "KW_ON_IDX";
    BIND_NAME_POS[BIND_NAME_POS["KW_BINDON_IDX"] = 5] = "KW_BINDON_IDX";
    BIND_NAME_POS[BIND_NAME_POS["KW_AT_IDX"] = 6] = "KW_AT_IDX";
    BIND_NAME_POS[BIND_NAME_POS["IDENT_KW_IDX"] = 7] = "IDENT_KW_IDX";
    BIND_NAME_POS[BIND_NAME_POS["IDENT_BANANA_BOX_IDX"] = 8] = "IDENT_BANANA_BOX_IDX";
    BIND_NAME_POS[BIND_NAME_POS["IDENT_PROPERTY_IDX"] = 9] = "IDENT_PROPERTY_IDX";
    BIND_NAME_POS[BIND_NAME_POS["IDENT_EVENT_IDX"] = 10] = "IDENT_EVENT_IDX";
})(BIND_NAME_POS || (BIND_NAME_POS = {}));
var ATTRIBUTE_PREFIX = 'attr';
var CLASS_PREFIX = 'class';
var STYLE_PREFIX = 'style';
var NodeVisitor = (function () {
    // get injector() { return this._injector; }
    function NodeVisitor(selectables /*, private _injector: Injector*/) {
        this._selectables = [];
        this._expressionParser = new expression_1.ExpressionParser();
        this._selectables = selectables.map(function (s) { return [selector_1.Selector.parse(s.selector), s]; });
    }
    NodeVisitor.prototype.visitElement = function (element, context) {
        // Skip <script> and <style> tags
        if (element instanceof HTMLScriptElement || element instanceof HTMLStyleElement) {
            return;
        }
        // Skip <template> tags
        if (element.tagName.toLowerCase() === 'template') {
            return;
        }
        // find selectables that match the elements selector     
        var selectables = this._selectables
            .filter(function (s) { return s[0].match(selector_1.Selector.parseElement(element)); })
            .map(function (s) { return s[1]; });
        // .forEach(factory => this._createDirective(factory, context));
        if (selectables && selectables.length) {
            var attrs = element.attributes;
            var targetProperties = [];
            var targetEvents = [];
            for (var i = 0, max = attrs.length; i < max; i++) {
                var attr = attrs[i];
                this._parseAttribute(attr, targetProperties, targetEvents);
            }
        }
    };
    NodeVisitor.prototype.visitAttribute = function (attr, context) { };
    NodeVisitor.prototype.visitText = function (text, context) {
        console.log('visit visitText', text);
    };
    NodeVisitor.prototype._parseAttribute = function (attr, targetProperties, targetEvents) {
        var name = this._normalizeAttributeName(attr.name);
        var value = attr.value;
        if (!utils_1.isPresent(value))
            return;
        var bindParts = name.match(BIND_NAME_REGEXP);
        var hasBinding = false;
        if (utils_1.isPresent(bindParts)) {
            hasBinding = true;
            if (utils_1.isPresent(bindParts[BIND_NAME_POS.KW_BIND_IDX])) {
                // Group 1 = "bind-"
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_KW_IDX], value, targetProperties);
                hasBinding = true;
            }
            else if (bindParts[BIND_NAME_POS.KW_LET_IDX]) {
                // Group 2 = "let-"
                // TODO
                debug_1.Logger.log(debug_1.LogLevel.debug, "Let is currently not supportet: " + name, debug_1.LogType.warn);
            }
            else if (bindParts[BIND_NAME_POS.KW_REF_IDX]) {
                // Group 3 = "ref-/#"
                // TODO
                debug_1.Logger.log(debug_1.LogLevel.debug, "Ref is currently not supportet: " + name, debug_1.LogType.warn);
            }
            else if (bindParts[BIND_NAME_POS.KW_ON_IDX]) {
                // Group 4 = "on-"
                this._parseEvent(bindParts[BIND_NAME_POS.IDENT_KW_IDX], value, targetEvents);
            }
            else if (bindParts[BIND_NAME_POS.KW_BINDON_IDX]) {
                // Group 5 = "bindon-"
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_KW_IDX], value, targetProperties);
                this._parseEvent(bindParts[BIND_NAME_POS.IDENT_KW_IDX] + "Change", value + "=$event", targetEvents);
            }
            else if (bindParts[BIND_NAME_POS.KW_AT_IDX]) {
                // Group 6 = "@"
                // TODO
                debug_1.Logger.log(debug_1.LogLevel.debug, "Animations are currently not supportet: " + name, debug_1.LogType.warn);
            }
            else if (bindParts[BIND_NAME_POS.IDENT_BANANA_BOX_IDX]) {
                // Group 8 = identifier inside [()]
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX], value, targetProperties);
                this._parseEvent(bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX] + "Change", value + "=$event", targetEvents);
            }
            else if (bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX]) {
                // Group 9 = identifier inside []
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX], value, targetProperties);
            }
            else if (bindParts[BIND_NAME_POS.IDENT_EVENT_IDX]) {
                // Group 10 = identifier inside ()
                this._parseEvent(bindParts[BIND_NAME_POS.IDENT_EVENT_IDX], value, targetEvents);
            }
        }
        return hasBinding;
    };
    NodeVisitor.prototype._parsePropertyOrAnimation = function (name, expression, targetProperties) {
        var animatePropPrefix = 'animate-';
        var animatePropLength = 'animate-'.length;
        var isAnimationProp = name[0] == '@';
        var animationPrefixLength = 1;
        if (name.substring(0, animatePropLength) === animatePropPrefix) {
            isAnimationProp = true;
            animationPrefixLength = animatePropLength;
        }
        if (isAnimationProp) {
            // TODO: Animation
            debug_1.Logger.log(debug_1.LogLevel.debug, "Animations are currently not supportet: " + name, debug_1.LogType.warn);
        }
        else {
            this._parseProperty(name, expression, targetProperties);
        }
    };
    NodeVisitor.prototype._parseProperty = function (name, expression, targetProperties) {
        var parts = name.split('.');
        var bindingName;
        var bindingType;
        if (parts.length === 1) {
            bindingType = ast_1.PropertyBindingType.Property;
            bindingName = parts[0];
        }
        else {
            var prefix = parts[0];
            if (prefix === ATTRIBUTE_PREFIX) {
                bindingType = ast_1.PropertyBindingType.Attribute;
            }
            else if (prefix === CLASS_PREFIX) {
                bindingType = ast_1.PropertyBindingType.Class;
            }
            else if (prefix === STYLE_PREFIX) {
                bindingType = ast_1.PropertyBindingType.Style;
            }
            if (bindingType && parts[1]) {
                bindingName = parts[1];
            }
        }
        if (bindingName) {
            targetProperties.push(new ast_1.BoundElementPropertyAst(bindingName, expression, bindingType));
        }
        else {
            debug_1.Logger.log(debug_1.LogLevel.debug, "Invalid property name '" + name + "'", debug_1.LogType.warn);
        }
    };
    NodeVisitor.prototype._parseEvent = function (name, expression, targetEvents) {
        var parts = utils_1.splitAtColon(name, [null, name]);
        var target = parts[0];
        var eventName = parts[1];
        targetEvents.push(new ast_1.BoundEventAst(name, target, eventName));
    };
    // private _createDirective(factory: CompiledDirectiveFactory<any>, context: View<any>) {
    // if (factory.metadata instanceof ComponentMetadata) {
    //     factory.create()
    // }
    // }
    /**
     * Normalizes attribute name, removes "data-"
     * See: https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/template_parser/template_parser.ts#L583
     *
     * @private
     * @param {string} attrName
     * @returns {string}
     *
     * @memberOf NodeVisitor
     */
    NodeVisitor.prototype._normalizeAttributeName = function (attrName) {
        return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
    };
    return NodeVisitor;
}());
exports.NodeVisitor = NodeVisitor;
function getVisitorForContext(context) {
    var injector = context.injector;
    debug_1.assert(injector instanceof di_1.Injector, "The context \"" + utils_1.stringify(context) + "\" does not implement a injector!", TypeError);
    var visitor = injector.get(NodeVisitor);
    debug_1.assert(visitor instanceof NodeVisitor, "Can not inject NodeVisitor into DOMTraverser");
    return visitor;
}
exports.getVisitorForContext = getVisitorForContext;
//# sourceMappingURL=node_visitor.js.map