import { ClassType } from '../../utils/class/class';
export declare class ClassReflection {
    private _properties;
    private _parameters;
    private _annotations;
    properties: Map<string | symbol, any>;
    parameters: any[];
    annotations: Map<ClassType<any>, any>;
    static peek(classType: ClassType<any>): ClassReflection;
    static isReflected(classType: ClassType<any>): boolean;
}
