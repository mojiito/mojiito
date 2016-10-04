import { Injector } from '../di/di';
import { View } from './view';
import { ViewContainerRef } from './view-container';
import { ElementRef } from './element-ref';
export declare class AppElement {
    index: number;
    parentIndex: number;
    parentView: View<any>;
    nativeElement: any;
    nestedViews: View<any>[];
    componentView: View<any>;
    component: any;
    constructor(index: number, parentIndex: number, parentView: View<any>, nativeElement: any);
    elementRef: ElementRef;
    vcRef: ViewContainerRef;
    initComponent(component: any, view: View<any>): void;
    parentInjector: Injector;
    injector: Injector;
    moveView(view: View<any>, currentIndex: number): void;
    attachView(view: View<any>, viewIndex: number): void;
    detachView(viewIndex: number): View<any>;
}
