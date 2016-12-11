import { isNumber } from '../utils/utils';
import { Injectable, Injector } from '../core/di/di';
import { NodeVisitor, getVisitorForContext, ContextRef } from '../runtime/runtime';
import { assert } from "../debug/assert/assert";

@Injectable()
export class DOMTraverser {

    private _nodeCount = 0;
    private _peek: Node;    
    private _attributeIndex = -1;

    traverse(node: Node, visitor: NodeVisitor, context: any = null) {
        let ctxt:any = context;

        if (node instanceof Element)  {
            ctxt = visitor.visitElement(<Element>node, context);
        } else if (node instanceof Text) {
            ctxt = visitor.visitText(<Text>node, context);
        }     
        

        // Check if context has changed and look up the corresponding
        // NodeVisitor if available
        if (!!ctxt && ctxt !== context) {
            // visitor = getVisitorForContext(ctxt);
        } else {
            // Traverse through all the attributes of the node
            // if it is type of Element 
            if (node instanceof Element && node.attributes.length) {
                for (let i = 0, max = node.attributes.length; i < max; i++) {
                    ctxt = visitor.visitAttribute(node, node.attributes[i],ctxt)
                }
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
        console.log(node, ctxt);
    }
}
