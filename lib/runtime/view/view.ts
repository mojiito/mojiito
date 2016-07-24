import { Parser } from '../../render/parser/parser';
import { ViewFactory } from './factory';
import { Injector } from '../di/di';
import { HostElement } from './host';


export class View {
    
    private _parser: Parser;  
    private _rootElement: Element;
    private _hostElement: HostElement;

    get rootElement(): Element {
        return this._rootElement;
    }

    get hostElement(): HostElement {
        return this._hostElement;
    }

    constructor(element: Element, hostElement: HostElement) {
        this._rootElement = element;
        this._hostElement = hostElement;
        this._parser = this._hostElement.injector.get(Parser);
        // console.log(this._hostElement.injector);
    }

    parse() {
        this._parser.parse(this._rootElement, this._hostElement, true);
    }

    destroy() { }
}