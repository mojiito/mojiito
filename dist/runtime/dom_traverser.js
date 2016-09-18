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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var di_1 = require('../core/di/di');
var node_visitor_1 = require('./node_visitor');
var DOMTraverser = (function () {
    function DOMTraverser(_visitor) {
        this._visitor = _visitor;
        this._nodeCount = 0;
        this._attributeIndex = -1;
    }
    DOMTraverser.prototype.traverse = function (node, context) {
        if (context === void 0) { context = undefined; }
        var ctxt = this.visit(node, context) || context;
        // Traverse through all the attributes of the node
        // if it is of type Element 
        if (node instanceof Element && node.attributes.length) {
            for (var i = 0, max = node.attributes.length; i < max; i++) {
                this.traverse(node.attributes[i], ctxt);
            }
        }
        // Start traversing the child nodes        
        var childNode = node.firstChild;
        if (childNode) {
            this.traverse(childNode, ctxt);
            while (childNode = childNode.nextSibling) {
                this.traverse(childNode, ctxt);
            }
        }
    };
    DOMTraverser.prototype.visit = function (node, context) {
        if (node instanceof Element) {
            return this._visitor.visitElement(node, context);
        }
        else if (node instanceof Attr) {
        }
        else if (node instanceof Text) {
        }
    };
    DOMTraverser = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(node_visitor_1.NodeVisitor)), 
        __metadata('design:paramtypes', [node_visitor_1.NodeVisitor])
    ], DOMTraverser);
    return DOMTraverser;
}());
exports.DOMTraverser = DOMTraverser;
//# sourceMappingURL=dom_traverser.js.map