"use strict";
/**
 * A plain attribute on an element.
 */
var AttrAst = (function () {
    function AttrAst(name, value) {
        this.name = name;
        this.value = value;
    }
    return AttrAst;
}());
exports.AttrAst = AttrAst;
/**
 * A segment of text.
 */
var TextAst = (function () {
    function TextAst(value) {
        this.value = value;
    }
    return TextAst;
}());
exports.TextAst = TextAst;
/**
 * An element declaration
 */
var ElementAst = (function () {
    function ElementAst(name, attrs, boundProperties, boundEvents, hasViewContainer, children) {
        this.name = name;
        this.attrs = attrs;
        this.boundProperties = boundProperties;
        this.boundEvents = boundEvents;
        this.hasViewContainer = hasViewContainer;
    }
    return ElementAst;
}());
exports.ElementAst = ElementAst;
/**
 * A binding for an element property (e.g. `[property]="expression"`).
 */
var BoundElementPropertyAst = (function () {
    function BoundElementPropertyAst(name, value, type) {
        this.name = name;
        this.value = value;
        this.type = type;
    }
    return BoundElementPropertyAst;
}());
exports.BoundElementPropertyAst = BoundElementPropertyAst;
/**
 * A binding for an element event (e.g. `(event)="handler()"`).
 */
var BoundEventAst = (function () {
    function BoundEventAst(name, target, value) {
        this.name = name;
        this.target = target;
        this.value = value;
    }
    return BoundEventAst;
}());
exports.BoundEventAst = BoundEventAst;
// https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/template_parser/template_ast.ts#L211
(function (PropertyBindingType) {
    /**
     * A normal binding to a property (e.g. `[property]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Property"] = 0] = "Property";
    /**
     * A binding to an element attribute (e.g. `[attr.name]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Attribute"] = 1] = "Attribute";
    /**
     * A binding to a CSS class (e.g. `[class.name]="condition"`).
     */
    PropertyBindingType[PropertyBindingType["Class"] = 2] = "Class";
    /**
     * A binding to a style rule (e.g. `[style.rule]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Style"] = 3] = "Style";
    /**
     * A binding to an animation reference (e.g. `[animate.key]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Animation"] = 4] = "Animation";
})(exports.PropertyBindingType || (exports.PropertyBindingType = {}));
var PropertyBindingType = exports.PropertyBindingType;
//# sourceMappingURL=ast.js.map