import { ClassType, getClassName } from '../../utils/class/class';
import { doesSelectorMatchElement } from '../../utils/dom/dom';
import { assert } from '../../debug/debug';
import { ComponentReference } from './reference';
import { ComponentMetadata } from '../directive/metadata';
import { HostElement } from '../view/host';
import { ElementRef } from '../view/element';
import { ClassReflection } from '../reflect/reflection';
import { Injector, provide, forwardRef } from '../di/di';
import { Injectable } from '../di/di';

export class ComponentFactory<C> {

    private _componentType: ClassType<C>;
    
    constructor(componentType: ClassType<C>) {
        this._componentType = componentType;
    }

    get componentType():ClassType<C> { return this._componentType; }

    create(injector: Injector, nativeElement: Element): ComponentReference<C> {
        let metadata: ComponentMetadata = ClassReflection.peek(this._componentType).annotations.get(ComponentMetadata);
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
        return ref;
    }
}

@Injectable()
export class ComponentFactoryResolver {
    resolveComponent<C>(componentClass: ClassType<C>): ComponentFactory<C> {
        let factory = ClassReflection.peek(componentClass).annotations.get(ComponentFactory);
        if (!(factory instanceof ComponentFactory)) {
            factory = new ComponentFactory(componentClass);
            ClassReflection.peek(componentClass).annotations.set(ComponentFactory, factory);
        }
        return factory;
    }
}