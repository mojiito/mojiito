import { assert } from '../../debug/debug';
import { Injectable } from '../di/di';
import { ClassType, getClassName } from '../../utils/class/class';
import { ComponentFactory } from './factory';
import { ComponentMetadataReference } from './metadata';
import { Annotations } from '../annotations/annotations';

@Injectable()
export class ComponentResolver {
    resolveComponent<C>(componentClass: ClassType<C>): ComponentFactory<C> {
        let factory = Annotations.peek(componentClass).getSingle(ComponentFactory);
        if (!(factory instanceof ComponentFactory)) {
            factory = new ComponentFactory(componentClass);
            Annotations.peek(componentClass).set(factory);
        }
        return factory;
    }
}