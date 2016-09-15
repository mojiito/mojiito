import { NodeVisitor } from './node_visitor';

export class DOMTraverser {

    private _nodeCount = 0;
    private _peek: Node;
    private _attributeIndex = -1;
    
    constructor(private visitor: NodeVisitor) {}

    traverse(node: Node) {
        let cb = this.visit(node);

        // Traverse through all the attributes of the node
        // if it is of type Element 
        if (node instanceof Element && node.attributes.length) {
            for (let i = 0, max = node.attributes.length; i < max; i++) {
                this.traverse(node.attributes[i]);
            }
        }        

        // Start traversing the child nodes        
        let childNode = node.firstChild;
        if (childNode) {
            this.traverse(childNode);
            while (childNode = childNode.nextSibling) {
                this.traverse(childNode);
            }
        }

        // if (typeof cb === 'function') {
        //     cb();
        // }
    }

    visit(node: Node) {
        if (node instanceof Element) {
            return this.visitor.visitElement(node, null);
        } else if (node instanceof Attr) {
            return this.visitor.visitAttribute(node, null);
        } else if (node instanceof Text) {
            return this.visitor.visitText(node, null);
        }
    }
}