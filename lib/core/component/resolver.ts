import { assert } from '../../debug/debug';
import { Injectable } from '../di/di';
import { ClassType, getClassName } from '../../utils/class/class';
import { ComponentFactory } from './factory';
import { ClassReflection } from '../reflect/reflection';

@Injectable()
export class ComponentResolver {
    resolveComponent<C>(componentClass: ClassType<C>): ComponentFactory<C> {
        let factory = ClassReflection.peek(componentClass).annotations.get(ComponentFactory);
        if (!(factory instanceof ComponentFactory)) {
            factory = new ComponentFactory(componentClass);
            ClassReflection.peek(componentClass).annotations.set(ComponentFactory, factory);
        }
        return factory;
    }
}