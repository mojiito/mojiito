import { Injector } from '../di/di';
import { AppView } from './view';
import { ViewContainerRef } from './view-container';
import { ElementRef } from './element-ref';

export class AppElement {
    public nestedViews: AppView<any>[] = null;
    public componentView: AppView<any> = null;

    public component: any;

    constructor(public parentView: AppView<any>, public nativeElement: any) { }

    get elementRef(): ElementRef { return new ElementRef(this.nativeElement); }
    get vcRef(): ViewContainerRef { return new ViewContainerRef(this); }

    initComponent(component: any, view: AppView<any>) {
        this.component = component;
        this.componentView = view;
    }

    get parentInjector(): Injector { return null; /* this.parentView.injector(this.parentIndex);*/ }
    get injector(): Injector { return null; /*this.parentView.injector(this.index);*/ }

    moveView(view: AppView<any>, currentIndex: number) { }
    attachView(view: AppView<any>, viewIndex: number) { }
    detachView(viewIndex: number): AppView<any> { return null; }
}