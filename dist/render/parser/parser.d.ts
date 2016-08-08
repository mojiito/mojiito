import { ComponentResolver } from '../../core/component/resolver';
export declare class Parser {
    private _domParser;
    constructor(resolver: ComponentResolver);
    parse(root: Element, context?: any, skipRootElement?: boolean): void;
}
