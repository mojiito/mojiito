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
    DOMTraverser.prototype.traverse = function (node, whatToShow) {
        console.log('traverse ', node);
        var n = node.firstChild;
        if (!n) {
            return;
        }
        this.traverse(n, whatToShow);
        while (n = n.nextSibling) {
            this.traverse(n, whatToShow);
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