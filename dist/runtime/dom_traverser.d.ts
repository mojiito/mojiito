import { NodeVisitor } from './node_visitor';
export declare class DOMTraverser {
    private _visitor;
    private _nodeCount;
    private _peek;
    private _attributeIndex;
    constructor(_visitor: NodeVisitor);
    traverse(node: Node, context?: any): void;
    visit(node: Node, context: any): any;
}
