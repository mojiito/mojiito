import { NodeVisitor } from '../runtime/runtime';
export declare class DOMTraverser {
    private _nodeCount;
    private _peek;
    private _attributeIndex;
    traverse(node: Node, visitor: NodeVisitor, context?: any): void;
}
