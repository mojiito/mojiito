"use strict";
var DOMTraverser = (function () {
    function DOMTraverser(visitor) {
        this.visitor = visitor;
        this._nodeCount = 0;
        this._attributeIndex = -1;
    }
    DOMTraverser.prototype.traverse = function (node) {
        var cb = this.visit(node);
        // Traverse through all the attributes of the node
        // if it is of type Element 
        if (node instanceof Element && node.attributes.length) {
            for (var i = 0, max = node.attributes.length; i < max; i++) {
                this.traverse(node.attributes[i]);
            }
        }
        // Start traversing the child nodes        
        var childNode = node.firstChild;
        if (childNode) {
            this.traverse(childNode);
            while (childNode = childNode.nextSibling) {
                this.traverse(childNode);
            }
        }
        // if (typeof cb === 'function') {
        //     cb();
        // }
    };
    DOMTraverser.prototype.visit = function (node) {
        if (node instanceof Element) {
            return this.visitor.visitElement(node, null);
        }
        else if (node instanceof Attr) {
            return this.visitor.visitAttribute(node, null);
        }
        else if (node instanceof Text) {
            return this.visitor.visitText(node, null);
        }
    };
    return DOMTraverser;
}());
exports.DOMTraverser = DOMTraverser;
//# sourceMappingURL=dom_traverser.js.map