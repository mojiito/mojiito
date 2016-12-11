import { Injector } from '../di/di';
import { AppView } from './view';
import { ViewContainerRef } from './view-container';
import { ElementRef } from './element-ref';
export declare class AppElement {
    parentView: AppView<any>;
    nativeElement: any;
    nestedViews: AppView<any>[];
    componentView: AppView<any>;
    component: any;
    constructor(parentView: AppView<any>, nativeElement: any);
    elementRef: ElementRef;
    vcRef: ViewContainerRef;
    initComponent(component: any, view: AppView<any>): void;
    parentInjector: Injector;
    injector: Injector;
    moveView(view: AppView<any>, currentIndex: number): void;
    attachView(view: AppView<any>, viewIndex: number): void;
    detachView(viewIndex: number): AppView<any>;
}
