import { Injectable, Inject } from '../core/di/di';
import { NodeVisitor } from './node_visitor';

@Injectable()
export class DOMTraverser {

    private _nodeCount = 0;
    private _peek: Node;
    private _attributeIndex = -1;
    
    constructor(
        @Inject(NodeVisitor) private _visitor: NodeVisitor
    ) {}

    traverse(node: Node, context: any = undefined) {

        let ctxt = this.visit(node, context) || context;

        // Traverse through all the attributes of the node
        // if it is of type Element 
        if (node instanceof Element && node.attributes.length) {
            for (let i = 0, max = node.attributes.length; i < max; i++) {
                this.traverse(node.attributes[i], ctxt);
            }
        }        

        // Start traversing the child nodes        
        let childNode = node.firstChild;
        if (childNode) {
            this.traverse(childNode, ctxt);
            while (childNode = childNode.nextSibling) {
                this.traverse(childNode, ctxt);
            }
        }
    }

    visit(node: Node, context: any): any {
        if (node instanceof Element) {
            return this._visitor.visitElement(node, context);
        } else if (node instanceof Attr) {
            // return this.visitor.visitAttribute(node, context);
        } else if (node instanceof Text) {
            // return this.visitor.visitText(node, context);
        }
    }
}