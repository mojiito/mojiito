import { ContextTree } from '../context';
import { ParserAttributeHook } from './hooks';
export declare class BindingParserHook extends ParserAttributeHook {
    removeAttributeNode: boolean;
    constructor();
    predicate(attribute: Attr): boolean;
    onParse(element: Element, attribute: Attr, context: ContextTree): void;
}
