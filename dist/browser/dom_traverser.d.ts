import { NodeVisitor } from './node_visitor';
export declare class DOMTraverser {
    private visitor;
    private _nodeCount;
    private _peek;
    private _attributeIndex;
    constructor(visitor: NodeVisitor);
    traverse(node: Node): void;
    visit(node: Node): void;
}
