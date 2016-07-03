import { ComponentMetadataReference } from '../directives/component_directive';
import { IDirectiveReference, DirectiveReference, DirectiveFactory } from './directive_factory';
import { ClassFactory } from '../../utils/class/class';

export interface IComponentReference<C> extends IDirectiveReference<C> {
    destroy(): void;
}

export class ComponentReference<C> extends DirectiveReference<C> implements IComponentReference<C> {
    destroy() {
        super.destroy();
    }
}

export class ComponentFactory<C> extends DirectiveFactory<C> {

    constructor(klass: ClassFactory<C>, metaRef: ComponentMetadataReference) {
        super(klass, metaRef);
    }

    create(element: HTMLElement): ComponentReference<C> {
        return super.create(element);
    }
}