"use strict";
var NodeVisitor = (function () {
    function NodeVisitor() {
    }
    NodeVisitor.prototype.visitElement = function (element, context) {
        console.log('visit Element', element);
    };
    NodeVisitor.prototype.visitAttribute = function (attribute, context) {
        console.log('visit Attribute', attribute);
    };
    NodeVisitor.prototype.visitText = function (text, context) {
        console.log('visit Attribute', text);
    };
    return NodeVisitor;
}());
exports.NodeVisitor = NodeVisitor;
//# sourceMappingURL=node_visitor.js.map