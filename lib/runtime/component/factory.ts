import { ClassType, getClassName } from '../../utils/class/class';
import { doesSelectorMatchElement } from '../../utils/dom/dom';
import { assert } from '../../debug/debug';
import { ComponentReference } from './reference';
import { ComponentMetadataReference } from './metadata';
import { View } from '../view/view';
import { ComponentReflection } from './reflection';

export class ComponentFactory<C> {

    private _metaRef: ComponentMetadataReference<C>;
    private _componentClass: ClassType<C>;
    
    constructor(componentClass: ClassType<C>, parentRef?: ComponentFactory<any>) {
        this._componentClass = componentClass;
        this._metaRef = ComponentReflection.get(componentClass).metadataReference;
    }

    get metadataReference() {
        return this._metaRef;
    }

    create(element: HTMLElement, parentRef: ComponentReference<any>): ComponentReference<C> {
        assert(doesSelectorMatchElement(this.metadataReference.selector, element), `The provided element does not match the selector "${this.metadataReference.selector}" specified in the metadata of the component "${getClassName(this._componentClass)}"`);
        let view = new View(element);
        let componentInstance = new this._componentClass();
        let ref = new ComponentReference(componentInstance, view, parentRef);
        return ref;
    }
}