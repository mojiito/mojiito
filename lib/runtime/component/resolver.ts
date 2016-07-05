import { assert } from '../../debug/debug';
import { Injectable } from '../../runtime/injectable/injectable';
import { ClassType, getClassName } from '../../utils/class/class';
import { ComponentFactory } from './factory';
import { ComponentMetadataReference } from './metadata';

@Injectable()
export class ComponentResolver {
    resolve<C>(componentClass: ClassType<C>): ComponentFactory<C> {
        let factory = <ComponentFactory<C>>Reflect.getMetadata('factory', componentClass);
        if (!(factory instanceof ComponentFactory)) {
            let metaRef = <ComponentMetadataReference<C>>Reflect.getMetadata('meta', componentClass);
            assert(metaRef instanceof ComponentMetadataReference, `Component "${getClassName(componentClass)}" can not be resolved because no component metadata reference is reflected on it! `, TypeError);
            factory = new ComponentFactory(componentClass, metaRef);
        }
        return factory;
    }
}