import { Injectable, Injector } from '../core/di/di';
import { NodeVisitor, getVisitorForContext } from './node_visitor';
import { assert } from "../debug/assert/assert";

@Injectable()
export class DOMTraverser {

    private _nodeCount = 0;
    private _peek: Node;
    private _attributeIndex = -1;
    
    constructor() {}

    traverse(node: Node, visitor: NodeVisitor, context: any) {
        let ctxt = this.visit(node, visitor, context) || context;

        // Check if context has changed and look up the corresponding
        // NodeVisitor if available
        if (ctxt !== context) {
            visitor = getVisitorForContext(ctxt);
        }

        // Traverse through all the attributes of the node
        // if it is type of Element 
        if (node instanceof Element && node.attributes.length) {
            for (let i = 0, max = node.attributes.length; i < max; i++) {
                this.traverse(node.attributes[i], visitor, ctxt);
            }
        }        

        // Start traversing the child nodes        
        let childNode = node.firstChild;
        if (childNode) {
            this.traverse(childNode, visitor, ctxt);
            while (childNode = childNode.nextSibling) {
                this.traverse(childNode, visitor, ctxt);
            }
        }
    }

    visit(node: Node, visitor: NodeVisitor, context: any): any {

        // console.log(visitor);        
        if (node instanceof Element) {
            return visitor.visitElement(node, context);
        } else if (node instanceof Attr) {
            // return this.visitor.visitAttribute(node, context);
        } else if (node instanceof Text) {
            // return this.visitor.visitText(node, context);
        }
    }
}