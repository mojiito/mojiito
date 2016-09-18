import { ClassType } from '../../utils/class/class';
export declare class DirectiveRegistry {
    private static _directiveTypes;
    static directiveTypes: ClassType<any>[];
    static register(directiveType: ClassType<any>): void;
}
