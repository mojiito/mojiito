import { IDOMParserElementHook, IDOMParserAttributeHook } from '../dom_parser';

export abstract class ParserElementHook implements IDOMParserElementHook {
    abstract predicate(element: Element): boolean;
}

export abstract class ParserAttributeHook implements IDOMParserAttributeHook {
    removeAttributeNode = false;
    abstract predicate(attribute: Attr): boolean;
}