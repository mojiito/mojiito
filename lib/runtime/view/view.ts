import { DOMParser } from '../../render/render';
import { ViewRef } from './reference';
import { ViewFactory } from './factory';
import { Injector } from '../di/di';


export class View {

    private _ref: ViewRef<View>;    
    private _parser: DOMParser;  
    private _rootElement: Element;

    get rootElement(): Element {
        return this._rootElement;
    }

    get ref(): ViewRef<View> {
        return this._ref;
    }

    constructor(element: Element) {
        this._rootElement = element;
        this._ref = new ViewRef(this);
    }

    parse() {

    }

    destroy() { }
}