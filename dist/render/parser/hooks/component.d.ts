import { ContextTree } from '../context';
import { ParserElementHook } from './hooks';
import { ComponentResolver } from '../../../core/component/resolver';
export declare class ComponentParserHook extends ParserElementHook {
    private resolver;
    private selectors;
    private lastFoundSelectorIndex;
    constructor(resolver: ComponentResolver);
    predicate(element: Element): boolean;
    onBeforeParse(element: Element, context: ContextTree): Object | Function;
    onAfterParse(element: Element, context: ContextTree): void;
}
