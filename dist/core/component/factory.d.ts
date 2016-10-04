import { ClassType } from '../../utils/class/class';
import { AppElement } from '../view/element';
import { ElementRef } from '../view/element';
import { ViewRef } from '../view/view';
import { Injector } from '../di/di';
import { ChangeDetector } from '../change_detection/change_detection';
export declare class ComponentFactory<C> {
    private _componentType;
    constructor(componentType: ClassType<C>);
    componentType: ClassType<C>;
    create(injector: Injector, nativeElement: Element): ComponentRef<C>;
}
export declare class ComponentRef<C> {
    private _hostElement;
    private _componentType;
    constructor(_hostElement: AppElement, _componentType: ClassType<C>);
    location: ElementRef;
    injector: Injector;
    instance: C;
    hostView: ViewRef<C>;
    changeDetectorRef: ChangeDetector;
    componentType: ClassType<C>;
    destroy(): void;
    onDestroy(callback: Function): void;
}
export declare class ComponentFactoryResolver {
    private _parent;
    private _factories;
    constructor(factories: ComponentFactory<any>[], _parent?: ComponentFactoryResolver);
    resolveComponentFactory<T>(component: {
        new (...args: any[]): T;
    }): ComponentFactory<T>;
}
