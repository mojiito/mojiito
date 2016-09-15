"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var def_1 = require('./def');
var NodeVisitor = (function (_super) {
    __extends(NodeVisitor, _super);
    function NodeVisitor() {
        _super.apply(this, arguments);
    }
    NodeVisitor.prototype.visitElement = function (element, context) {
        console.log('visit Element', element);
    };
    NodeVisitor.prototype.visitAttribute = function (attribute, context) {
        console.log('visit Attribute', attribute);
    };
    return NodeVisitor;
}(def_1.Visitor));
exports.NodeVisitor = NodeVisitor;
//# sourceMappingURL=node_visitor.js.map