import { Visitor } from './def';
export declare class DOMTraverser {
    private visitor;
    NodeFilter: {
        FILTER_ACCEPT: number;
        FILTER_REJECT: number;
        FILTER_SKIP: number;
        SHOW_ALL: number;
        SHOW_ATTRIBUTE: number;
        SHOW_CDATA_SECTION: number;
        SHOW_COMMENT: number;
        SHOW_DOCUMENT: number;
        SHOW_DOCUMENT_FRAGMENT: number;
        SHOW_DOCUMENT_TYPE: number;
        SHOW_ELEMENT: number;
        SHOW_ENTITY: number;
        SHOW_ENTITY_REFERENCE: number;
        SHOW_NOTATION: number;
        SHOW_PROCESSING_INSTRUCTION: number;
        SHOW_TEXT: number;
    };
    constructor(visitor: Visitor);
    traverse(node: Node): void;
    visit(node: Node): () => void;
}
