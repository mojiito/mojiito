import { ClassType, getClassName } from '../../utils/class/class';
import { doesSelectorMatchElement } from '../../utils/dom/dom';
import { assert } from '../../debug/debug';
import { ComponentMetadata } from '../directive/metadata';
import { AppElement } from '../view/element';
import { ElementRef } from '../view/element-ref';
import { ViewRef, AppView } from '../view/view';
import { ClassReflection } from '../reflect/reflection';
import { Injector, provide, forwardRef } from '../di/di';
import { Injectable } from '../di/di';
import { ChangeDetector } from '../change_detection/change_detection';

export class ComponentFactory<C> {

    constructor(private _componentType: ClassType<C>, private _viewFactory: Function) { }

    get componentType(): ClassType<C> { return this._componentType; }

    create(injector: Injector, nativeElement: Element): ComponentRef<C> {
        const hostView: AppView<C> = this._viewFactory(injector, null);
        const hostElement = hostView.create(<any>{}, nativeElement);
        return new ComponentRef(hostElement, this._componentType);
    }
}

export class ComponentRef<C> {
    constructor(private _hostElement: AppElement, private _componentType: ClassType<C>) { }
    get location(): ElementRef { return this._hostElement.elementRef; }
    get injector(): Injector { return this._hostElement.injector; }
    get instance(): C { return this._hostElement.component; };
    get hostView(): ViewRef<C> { return this._hostElement.parentView.ref; };
    // get changeDetectorRef(): ChangeDetector { return this._hostElement.parentView.ref; };
    get componentType(): ClassType<C> { return this._componentType; }

    // destroy(): void { this._hostElement.parentView.destroy(); }
    // onDestroy(callback: Function): void { this.hostView.onDestroy(callback); }
}

// https://github.com/angular/angular/blob/master/modules/%40angular/core/src/linker/component_factory_resolver.ts#L40
export class ComponentFactoryResolver {
    private _factories = new Map<any, ComponentFactory<any>>();

    constructor(factories: ComponentFactory<any>[], private _parent?: ComponentFactoryResolver) {
        for (let i = 0; i < factories.length; i++) {
            let factory = factories[i];
            this._factories.set(factory.componentType, factory);
        }
    }

    resolveComponentFactory<T>(component: { new (...args: any[]): T }): ComponentFactory<T> {
        let result = this._factories.get(component);
        if (!result && this._parent instanceof ComponentFactoryResolver) {
            result = this._parent.resolveComponentFactory(component);
        }
        return result;
    }
}