import { assert } from '../../debug/assert/assert';
import { Parser } from '../../render/parser/parser';
import { ViewFactory } from './factory';
import { Injector } from '../di/di';
import { HostElement } from './host';


export class View {
    
    private _parser: Parser;  
    private _rootElement: Element;
    private _hostElement: HostElement;
    private _templateVars: { [key: string]: Element } = {};

    get rootElement(): Element {
        return this._rootElement;
    }

    get hostElement(): HostElement {
        return this._hostElement;
    }

    get templateVars() {
        return this._templateVars;
    }

    constructor(element: Element, hostElement: HostElement) {
        this._rootElement = element;
        this._hostElement = hostElement;
        this._parser = this._hostElement.injector.get(Parser);
        // console.log(this._hostElement.injector);
    }

    parse() {
        this._parser.parse(this._rootElement, this, true);
    }

    addTemplateVar(key: string, element: Element) {
        assert(!(this._templateVars[key] instanceof Element), `There is already a template variable "${key}" set on this view!`);
        this._templateVars[key] = element;
    }

    getTemplateVar(key: string, hostLookup = true): Element {
        let hostView = this.hostElement.getView(-1);
        let element = this._templateVars[key] || null;
        if (hostLookup && !(element instanceof Element) && hostView !== this) {
            element = hostView.getTemplateVar(key);
        }
        return element;
    }

    destroy() { }
}