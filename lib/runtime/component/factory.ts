import { ClassType } from '../../utils/class/class';
import { ComponentReference } from './reference';
import { ComponentMetadataReference } from './metadata';

export class ComponentFactory<C> {

    constructor(private componentClass: ClassType<C>, private metaRef: ComponentMetadataReference<C>) { }

    create(element: HTMLElement): ComponentReference<C> {
        return new ComponentReference(element, this.componentClass);
    }
}