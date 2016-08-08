import { ContextTree } from '../context';
import { ParserAttributeHook } from './hooks';
export declare class EventParserHook extends ParserAttributeHook {
    removeAttributeNode: boolean;
    constructor();
    predicate(attribute: Attr): boolean;
    onAfterParse(element: Element, attribute: Attr, context: ContextTree): void;
}
