import { ComponentFactory } from '../component/factory';
import { ComponentReference } from '../component/reference';
import { ViewRef } from './reference';
import { View } from './view';
import { ViewFactory } from './factory';
import { ViewElement } from './view_element';
import { ElementRef } from './element';
import { Injector, provide } from '../di/di';

export class ViewContainerRef {

    private _element: ViewElement;

    constructor(element: ViewElement) {
        this._element = element;
    }

    // TODO: implement!    
    createEmbeddedView() {}

    // TODO: implement!
    createComponent<C>(componentFactory: ComponentFactory<C>, injector: Injector, nativeElement: Element) { //: ComponentReference<C>{
    }

    // TODO: implement!
    destroy() {
    }
}