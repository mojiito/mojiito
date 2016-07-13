import { assert } from '../../debug/debug';
// import { Injectable } from '../../runtime/injectable/injectable';
import { ClassType, getClassName } from '../../utils/class/class';
import { ComponentFactory } from './factory';
import { ComponentMetadataReference } from './metadata';

// @Injectable()
export class ComponentResolver {
    resolve<C>(componentClass: ClassType<C>): ComponentFactory<C> {
        let factory = <ComponentFactory<C>>Reflect.getMetadata('factory', componentClass);
        if (!(factory instanceof ComponentFactory)) {
            factory = new ComponentFactory(componentClass);
        }
        return factory;
    }
}