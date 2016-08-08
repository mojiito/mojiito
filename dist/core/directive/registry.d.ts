import { ClassType } from '../../utils/class/class';
export declare class DirectiveRegistry {
    private static _directiveTypes;
    private static _selectors;
    static selectors: string[];
    static directiveTypes: ClassType<any>[];
    static register(directiveType: ClassType<any>, selector: string): void;
    static bySelector(selector: string): ClassType<any>;
}
