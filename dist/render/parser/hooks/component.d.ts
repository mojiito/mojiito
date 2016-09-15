import { ContextTree } from '../context';
import { ParserElementHook } from './hooks';
import { ComponentFactoryResolver } from '../../../core/component/factory';
export declare class ComponentParserHook extends ParserElementHook {
    private resolver;
    private selectors;
    private lastFoundSelectorIndex;
    constructor(resolver: ComponentFactoryResolver);
    predicate(element: Element): boolean;
    onBeforeParse(element: Element, context: ContextTree): Object | Function;
    onAfterParse(element: Element, context: ContextTree): void;
}
