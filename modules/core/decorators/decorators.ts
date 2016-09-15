import { ClassType } from '../../utils/class/class';
import { ClassReflection } from '../../core/reflect/reflection';
import { DirectiveRegistry } from '../../core/directive/registry';

export function createClassDecorator(metadataClass: ClassType<any>): (objOrType: any) => ClassDecorator {
    return function(objOrType: any): ClassDecorator {
        return function (cls: ClassType<any>) {
            ClassReflection.peek(cls).annotations.set(metadataClass, new metadataClass(objOrType));
            // if objOrType has a selector property we asume that cls is a component or DirectiveMetadata
            // so we can add it to the c
            if (typeof objOrType === 'object' && typeof objOrType.selector === 'string') {
                DirectiveRegistry.register(cls, objOrType.selector);
            }
        }
    }
}

export function createParameterDecorator(metadataClass: ClassType<any>): (objOrType: any) => ParameterDecorator {
    return function (objOrType: any): ParameterDecorator {
        return function (cls: ClassType<any>, propertyKey: string | symbol, parameterIndex: number): void {
            if (typeof parameterIndex === 'number' && parameterIndex >= 0) {
                ClassReflection.peek(cls).parameters[parameterIndex] = new metadataClass(objOrType);
            } else {
                ClassReflection.peek(cls).parameters.push(new metadataClass(objOrType));
            }
        }
    }
}

export function createPropertyDecoratory(metadataClass: ClassType<any>): (objOrType: any) => ParameterDecorator {
    return function (objOrType: any): ParameterDecorator {
        return function (target: Object, propertyKey: string | symbol): void {
            ClassReflection.peek(<ClassType<any>>target.constructor).properties.set(propertyKey, new metadataClass(objOrType || propertyKey));
        }
    }
}