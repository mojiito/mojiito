import { ClassType } from '../../utils/class/class';
export declare function createClassDecorator(metadataClass: ClassType<any>): (objOrType: any) => ClassDecorator;
export declare function createParameterDecorator(metadataClass: ClassType<any>): (objOrType: any) => ParameterDecorator;
export declare function createPropertyDecoratory(metadataClass: ClassType<any>): (objOrType: any) => ParameterDecorator;
