import { ViewContainerRef } from './view_container';
import { View } from './view';
import { ElementRef } from './element';
import { Injector } from '../di/di';

export class ViewElement {

    private _componentView: View = null;
    private _nestedViews: View[] = []; // TODO: Implement embedded views
    private _nativeElement: Element;
    private _component: any;
    private _injector: Injector;

    get component(): any { return this._component; }    
    get elementRef(): ElementRef { return new ElementRef(this._nativeElement); }
    get viewContainerRef(): ViewContainerRef { return new ViewContainerRef(this); }
    get injector(): Injector { return this._injector; };

    constructor(nativeElement: Element) {
        this._nativeElement = nativeElement;
    }

    initComponent(component: any, injector: Injector) {
        this._component = component;
        this._injector = injector;
    }

    // TODO    
    attachView(view: View, viewIndex: number) { }
}