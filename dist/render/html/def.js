"use strict";
var VisitElement = (function () {
    function VisitElement() {
    }
    return VisitElement;
}());
exports.VisitElement = VisitElement;
var VisitAttribute = (function () {
    function VisitAttribute() {
    }
    return VisitAttribute;
}());
exports.VisitAttribute = VisitAttribute;
var VisitText = (function () {
    function VisitText() {
    }
    return VisitText;
}());
exports.VisitText = VisitText;
var VisitComment = (function () {
    function VisitComment() {
    }
    return VisitComment;
}());
exports.VisitComment = VisitComment;
var Visitor = (function () {
    function Visitor() {
    }
    Visitor.prototype.visitElement = function (element, context) { };
    Visitor.prototype.visitAttribute = function (attribute, context) { };
    Visitor.prototype.visitText = function (text, context) { };
    Visitor.prototype.visitComment = function (comment, context) { };
    return Visitor;
}());
exports.Visitor = Visitor;
//# sourceMappingURL=def.js.map