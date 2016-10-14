import { NodeVisitor } from './node_visitor';
export declare class DOMTraverser {
    private _nodeCount;
    private _peek;
    private _attributeIndex;
    constructor();
    traverse(node: Node, visitor: NodeVisitor, context: any): void;
    visit(node: Node, visitor: NodeVisitor, context: any): any;
}
