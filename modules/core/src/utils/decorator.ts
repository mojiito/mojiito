import { ClassType } from '../type';
import { ClassReflection } from '../reflection';

export function createClassDecorator(metadataClass: ClassType<any>):
  (objOrType: any) => ClassDecorator {
  return function (objOrType: any): ClassDecorator {
    return function (cls: ClassType<any>) {
      ClassReflection.peek(cls).annotations.set(metadataClass, new metadataClass(objOrType));
    };
  };
}

export function createParameterDecorator(metadataClass: ClassType<any>):
  (objOrType: any) => ParameterDecorator {
  return function (objOrType: any): ParameterDecorator {
    return function (cls: ClassType<any>, propertyKey: string | symbol,
      parameterIndex: number): void {
      if (typeof parameterIndex === 'number' && parameterIndex >= 0) {
        ClassReflection.peek(cls).parameters[parameterIndex] = new metadataClass(objOrType);
      } else {
        ClassReflection.peek(cls).parameters.push(new metadataClass(objOrType));
      }
    };
  };
}

export function createPropertyDecoratory(metadataClass: ClassType<any>):
  (objOrType: any) => ParameterDecorator {
  return function (objOrType: any): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
      ClassReflection.peek(target.constructor as ClassType<any>).properties
        .set(propertyKey, new metadataClass(objOrType || propertyKey));
    };
  };
}
