import { DOMTraverser } from './dom_traverser';
export declare class RuntimeRenderer {
    private _traverser;
    constructor(_traverser: DOMTraverser);
    parseDOM(root: Element, context?: any): void;
}
