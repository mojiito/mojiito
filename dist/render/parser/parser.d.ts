import { ComponentFactoryResolver } from '../../core/component/factory';
export declare class Parser {
    private _domParser;
    constructor(resolver: ComponentFactoryResolver);
    parse(root: Element, context?: any, skipRootElement?: boolean): void;
}
