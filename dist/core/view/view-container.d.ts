import { Injector } from '../di/di';
import { ComponentFactory, ComponentRef } from '../directive/factory';
import { ElementRef } from './element-ref';
import { AppElement } from './element';
import { ViewRef } from './view';
export declare class ViewContainerRef {
    private _element;
    constructor(_element: AppElement);
    get(index: number): ViewRef<any>;
    length: number;
    element: ElementRef;
    injector: Injector;
    parentInjector: Injector;
    createEmbeddedView<C>(templateRef: any, context?: any, index?: number): ViewRef<C>;
    createComponent<C>(componentFactory: ComponentFactory<C>, index: number, injector: Injector, nativeElement: Element): ComponentRef<C>;
}
