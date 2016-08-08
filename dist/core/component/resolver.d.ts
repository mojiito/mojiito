import { ClassType } from '../../utils/class/class';
import { ComponentFactory } from './factory';
export declare class ComponentResolver {
    resolveComponent<C>(componentClass: ClassType<C>): ComponentFactory<C>;
}
