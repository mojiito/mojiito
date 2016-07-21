import { ClassType } from '../../utils/class/class';
import { ViewElement } from '../view/view_element';
import { ViewContainerRef } from '../view/view_container';
import { Injector } from '../di/di';

export class ComponentReference<C> {
    // private _view: View;
    private _hostElement: ViewElement;
    private _componentType: ClassType<C>;

    constructor(hostElement: ViewElement, componentType: ClassType<C>) {
        this._hostElement = hostElement;
        this._componentType = componentType;
    }

    get hostElement(): ViewElement {
        return this._hostElement;
    }

    get viewContainerRef(): ViewContainerRef {
        return this._hostElement.viewContainerRef;
    }

    get instance(): C {
        return this._hostElement.component;
    }

    get injector(): Injector {
        return this._hostElement.injector;
    }

    get componentType(): ClassType<C> {
        return this._componentType;
    }

    destroy() {
        // TODO!
    }
}