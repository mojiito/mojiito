import { IDOMParserElementHook, IDOMParserAttributeHook } from '../dom_parser';
export declare abstract class ParserElementHook implements IDOMParserElementHook {
    abstract predicate(element: Element): boolean;
}
export declare abstract class ParserAttributeHook implements IDOMParserAttributeHook {
    removeAttributeNode: boolean;
    abstract predicate(attribute: Attr): boolean;
}
