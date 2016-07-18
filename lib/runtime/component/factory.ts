import { ClassType, getClassName } from '../../utils/class/class';
import { doesSelectorMatchElement } from '../../utils/dom/dom';
import { assert } from '../../debug/debug';
import { ComponentReference } from './reference';
import { ComponentMetadataReference } from './metadata';
import { ViewContainerRef } from '../view/view_container';
import { ViewElement } from '../view/view_element';
import { ElementRef } from '../view/element';
import { Annotations } from '../annotations/annotations';
import { Injector, provide } from '../di/di';

export class ComponentFactory<C> {

    private _metaRef: ComponentMetadataReference<C>;
    private _componentType: ClassType<C>;
    
    constructor(componentClass: ClassType<C>) {
        this._componentType = componentClass;
        this._metaRef = Annotations.peek(componentClass).get(ComponentMetadataReference)[0];
    }

    get metadataReference() {
        return this._metaRef;
    }

    create(injector: Injector, nativeElement: Element): ComponentReference<C> {        

        let hostElement = new ViewElement(nativeElement);

        let providers = Array.isArray(this._metaRef.providers) ? this._metaRef.providers : [];
        providers = providers.concat([
            provide(ElementRef, { useValue: hostElement.elementRef }),
            provide(hostElement, { useClass: this._componentType })
        ]);
        
        let inj = injector.resolveAndCreateChild(providers);
        let component = inj.get(hostElement);

        hostElement.initComponent(component, inj);

        let ref = new ComponentReference(hostElement, this._componentType);
        return ref;
    }
}