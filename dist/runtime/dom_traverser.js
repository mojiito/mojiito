"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('../core/di/di');
var node_visitor_1 = require('./node_visitor');
var DOMTraverser = (function () {
    function DOMTraverser() {
        this._nodeCount = 0;
        this._attributeIndex = -1;
    }
    DOMTraverser.prototype.traverse = function (node, visitor, context) {
        var ctxt = this.visit(node, visitor, context) || context;
        // Check if context has changed and look up the corresponding
        // NodeVisitor if available
        if (ctxt !== context) {
            visitor = node_visitor_1.getVisitorForContext(ctxt);
        }
        // Traverse through all the attributes of the node
        // if it is type of Element 
        if (node instanceof Element && node.attributes.length) {
            for (var i = 0, max = node.attributes.length; i < max; i++) {
                this.traverse(node.attributes[i], visitor, ctxt);
            }
        }
        // Start traversing the child nodes        
        var childNode = node.firstChild;
        if (childNode) {
            this.traverse(childNode, visitor, ctxt);
            while (childNode = childNode.nextSibling) {
                this.traverse(childNode, visitor, ctxt);
            }
        }
    };
    DOMTraverser.prototype.visit = function (node, visitor, context) {
        // console.log(visitor);        
        if (node instanceof Element) {
            return visitor.visitElement(node, context);
        }
        else if (node instanceof Attr) {
        }
        else if (node instanceof Text) {
        }
    };
    DOMTraverser = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DOMTraverser);
    return DOMTraverser;
}());
exports.DOMTraverser = DOMTraverser;
//# sourceMappingURL=dom_traverser.js.map