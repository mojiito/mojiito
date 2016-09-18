"use strict";
var DOMTraverser = (function () {
    function DOMTraverser(visitor) {
        this.visitor = visitor;
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
            return this.visitor.visitElement(node, context);
        }
        else if (node instanceof Attr) {
        }
        else if (node instanceof Text) {
        }
    };
    return DOMTraverser;
}());
exports.DOMTraverser = DOMTraverser;
//# sourceMappingURL=dom_traverser.js.map