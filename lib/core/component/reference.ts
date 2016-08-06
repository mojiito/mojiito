import { ClassType } from '../../utils/class/class';
import { HostElement } from '../view/host';
import { Injector } from '../di/di';

export class ComponentReference<C> {
    // private _view: View;
    private _hostElement: HostElement;
    private _componentType: ClassType<C>;

    constructor(hostElement: HostElement, componentType: ClassType<C>) {
        this._hostElement = hostElement;
        this._componentType = componentType;
    }

    get hostElement(): HostElement {
        return this._hostElement;
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

    parse() {
        this._hostElement.parse();
    }

    destroy() {
        // TODO!
    }
}