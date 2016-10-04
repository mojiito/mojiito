import { Injector } from '../di/di';
import { View } from './view';
import { ViewContainerRef } from './view-container';
import { ElementRef } from './element-ref';

export class AppElement {
    public nestedViews: View<any>[] = null;
    public componentView: View<any> = null;

    public component: any;

    constructor(public index: number, public parentIndex: number, public parentView: View<any>, public nativeElement: any) { }

    get elementRef(): ElementRef { return new ElementRef(this.nativeElement); }
    get vcRef(): ViewContainerRef { return new ViewContainerRef(this); }

    initComponent(component: any, view: View<any>) {
        this.component = component;
        this.componentView = view;
    }

    get parentInjector(): Injector { return null; /* this.parentView.injector(this.parentIndex);*/ }
    get injector(): Injector { return null; /*this.parentView.injector(this.index);*/ }

    moveView(view: View<any>, currentIndex: number) { }
    attachView(view: View<any>, viewIndex: number) { }
    detachView(viewIndex: number): View<any> { return null; }
}