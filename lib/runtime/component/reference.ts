import { ClassType } from '../../utils/class/class';
import { View } from '../view/view';
import { ComponentReflection } from './reflection';

export class ComponentReference<C> {
    private _view: View;
    private _instance: C;
    // private _injector: Injector;
    private _parentRef: ComponentReference<any>;

    constructor(
        componentInstance: C,
        view: View,
        parentReference: ComponentReference<any> = null) {
        this._view = view;
        this._instance = componentInstance;
        this._parentRef = parentReference;
    }

    get view(): View {
        return this._view;
    }

    get instance(): C {
        return this._instance;
    }

    get parent(): ComponentReference<any> {
        return this._parentRef;
    }

    // get injector(): Injector {
    //     return this._injector;
    // }

    destroy() { }
}