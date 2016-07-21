import { Parser } from '../../render/parser/parser';
import { ViewFactory } from './factory';
import { Injector } from '../di/di';
import { ViewElement } from './view_element';


export class View {
    
    private _parser: Parser;  
    private _rootElement: Element;
    private _hostElement: ViewElement;

    get rootElement(): Element {
        return this._rootElement;
    }

    constructor(element: Element, hostElement: ViewElement) {
        this._rootElement = element;
        this._hostElement = hostElement;
        this._parser = this._hostElement.injector.get(Parser);
        console.log(this._hostElement.injector);
    }

    parse() {
        this._parser.parse(this._rootElement);
    }

    destroy() { }
}