import { ContextTree } from './context';
export interface IDOMParserElementHook {
    predicate: (element: Element) => boolean;
    onBeforeParse?: (element: Element, context: ContextTree) => Object | Function;
    onParse?: (element: Element, context: ContextTree) => void;
    onAfterParse?: (element: Element, context: ContextTree) => void;
    onDestroy?: (element: Element) => void;
}
export interface IDOMParserAttributeHook {
    removeAttributeNode?: boolean;
    predicate: (attribute: Attr) => boolean;
    onBeforeParse?: (element: Element, attribute: Attr, context: ContextTree) => Object | Function;
    onParse?: (element: Element, attribute: Attr, context: ContextTree) => void;
    onAfterParse?: (element: Element, attribute: Attr, context: ContextTree) => void;
    onDestroy?: (element: Element, attribute: Attr) => void;
}
export declare class DOMParser {
    static PARSED_ELEMENT_ATTR: string;
    private elementHooks;
    private attributeHooks;
    parseTree(rootElement: Element, context?: any | any[], skipRootElement?: boolean): void;
    private parseNode(element, contextTree, skipRootElement?);
    registerElementHook(hook: IDOMParserElementHook): void;
    registerAttributeHook(hook: IDOMParserAttributeHook): void;
}
