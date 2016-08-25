import { EventEmitter } from '../async/events';
import { HostElement } from './host';
export declare enum ViewType {
    Embedded = 0,
    Host = 1,
}
export declare class View {
    private _parser;
    private _rootElement;
    private _hostElement;
    private _type;
    private _templateVars;
    private _bindings;
    rootElement: Element;
    hostElement: HostElement;
    type: ViewType;
    templateVars: {
        [key: string]: Element;
    };
    isAttached: boolean;
    constructor(element: Element);
    parse(): void;
    addTemplateVar(key: string, element: Element): void;
    getTemplateVar(key: string, hostLookup?: boolean): Element;
    attach(hostElement: HostElement, type?: ViewType): void;
    detach(): void;
    destroy(): void;
    addBinding(key: string, fn: () => void): void;
    getBindingsForKey(key: string): EventEmitter<any>;
    private _peekBindingForKey(key);
}
