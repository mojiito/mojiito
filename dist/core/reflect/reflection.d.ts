import { ClassType } from '../../utils/class/class';
import { TypedMap } from '../../core/map/map';
export declare class ClassReflection {
    private _properties;
    private _parameters;
    private _annotations;
    properties: TypedMap<string | symbol, any>;
    parameters: any[];
    annotations: TypedMap<ClassType<any>, any>;
    static peek(classType: ClassType<any>): ClassReflection;
    static isReflected(classType: ClassType<any>): boolean;
}
