import { ClassType } from '../type';
import { ClassReflection } from '../reflection';
import { BaseError, stringify } from '../facade';

export function createClassDecorator(metadataClass: ClassType<any>):
  (objOrType?: any) => ClassDecorator {
  return function (objOrType?: any): ClassDecorator {
    return function (cls: ClassType<any>) {
      ClassReflection.peek(cls).annotations.set(metadataClass, new metadataClass(objOrType));
    };
  };
}

export function createParameterDecorator(metadataClass: ClassType<any>):
  (objOrType: any) => ParameterDecorator {
  return function (objOrType: any): ParameterDecorator {
    return function (cls: ClassType<any>, propertyKey: string | symbol, index: number): void {
      const parameters = ClassReflection.peek(cls).parameters;

      // there might be gaps if some in between parameters do not have annotations.
      // we pad with nulls.
      while (parameters.length <= index) {
        parameters.push(null);
      }

      if (typeof index === 'number' && index >= 0) {
        throw new NoIndexForParameterDecoratorError(cls, metadataClass);
      }

      parameters[index] = new metadataClass(objOrType);
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


export class NoIndexForParameterDecoratorError extends BaseError {
  constructor(cls:  ClassType<any>, metadataClass: ClassType<any>) {
    super(`The parameter decorated with ${stringify(metadataClass)} on ` +
      `class ${stringify(cls)} has no index provided!`);
  }
}
