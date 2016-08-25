import { ClassType, getClassName } from '../../utils/class/class';
import { doesSelectorMatchElement } from '../../utils/dom/dom';
import { assert } from '../../debug/debug';
import { ComponentReference } from './reference';
import { ComponentMetadata } from './metadata';
import { HostElement } from '../view/host';
import { ElementRef } from '../view/element';
import { ClassReflection } from '../reflect/reflection';
import { Injector, provide, forwardRef } from '../di/di';

export class ComponentFactory<C> {

    private _componentType: ClassType<C>;
    
    constructor(componentType: ClassType<C>) {
        this._componentType = componentType;
    }

    get componentType():ClassType<C> { return this._componentType; }

    create(injector: Injector, nativeElement: Element): ComponentReference<C> {
        console.log('start create factory');
        let metadata: ComponentMetadata = ClassReflection.peek(this._componentType).annotations.get(ComponentMetadata)
        let parentHostElement: HostElement = injector.get(HostElement);
        let hostElement = new HostElement(nativeElement, parentHostElement);
        if (parentHostElement instanceof HostElement) {
            parentHostElement.registerChild(hostElement);
        }
        let providers = Array.isArray(metadata.providers) ? metadata.providers : [];
        providers = providers.concat([
            provide(ElementRef, { useValue: hostElement.elementRef }),
            provide(HostElement, { useValue: hostElement }),
            provide(hostElement, { useClass: forwardRef(() => this._componentType) })
        ]);
        
        let inj = injector.resolveAndCreateChild(providers);
        let component = inj.get(hostElement);
        hostElement.initComponent(component, inj);
        
        let ref = new ComponentReference(hostElement, this._componentType);
        console.log('end create factory');
        return ref;
    }
}