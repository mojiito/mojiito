import { EventEmitter } from '../async/events';
import { HostElement } from './host';
import { ChangeDetectorStatus } from '../change_detection/change_detection';
export declare class View {
    private _parser;
    private _rootElement;
    private _hostElement;
    private _templateVars;
    private _bindings;
    rootElement: Element;
    hostElement: HostElement;
    templateVars: {
        [key: string]: Element;
    };
    isAttached: boolean;
    constructor(element: Element, cdStatus?: ChangeDetectorStatus);
    parse(): void;
    addTemplateVar(key: string, element: Element): void;
    getTemplateVar(key: string, hostLookup?: boolean): Element;
    attach(hostElement: HostElement): void;
    detach(): void;
    destroy(): void;
    addBinding(key: string, fn: () => void): void;
    getBindingsForKey(key: string): EventEmitter<any>;
    private _peekBindingForKey(key);
}
