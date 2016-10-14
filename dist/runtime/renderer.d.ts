import { DOMTraverser } from './dom_traverser';
export declare class RuntimeRenderer {
    private _traverser;
    constructor(_traverser: DOMTraverser);
    parse(root: Element, context: any): void;
}
