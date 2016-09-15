"use strict";
var DOMTraverser = (function () {
    function DOMTraverser(visitor) {
        this.visitor = visitor;
    }
    Object.defineProperty(DOMTraverser.prototype, "NodeFilter", {
        get: function () {
            return NodeFilter;
        },
        enumerable: true,
        configurable: true
    });
    DOMTraverser.prototype.traverse = function (node) {
        var cb = this.visit(node);
        // Traverse through all the attributes of the node
        // if it is of type Element 
        if (node instanceof Element) {
            var attributes = node.attributes;
            for (var i = 0, max = attributes.length; i < max; i++) {
                this.traverse(attributes[i]);
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
        if (typeof cb === 'function') {
            cb();
        }
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
        else if (node instanceof Comment) {
            return this.visitor.visitComment(node, null);
        }
    };
    return DOMTraverser;
}());
exports.DOMTraverser = DOMTraverser;
//# sourceMappingURL=dom_traverser.js.map