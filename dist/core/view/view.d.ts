import { HostElement } from './host';
import { ChangeDetectorStatus } from '../change_detection/change_detection';
export declare class View {
    private _parser;
    private _rootElement;
    private _hostElement;
    private _templateVars;
    rootElement: Element;
    hostElement: HostElement;
    templateVars: {
        [key: string]: Element;
    };
    constructor(element: Element, hostElement: HostElement, cdStatus?: ChangeDetectorStatus);
    parse(): void;
    addTemplateVar(key: string, element: Element): void;
    getTemplateVar(key: string, hostLookup?: boolean): Element;
    destroy(): void;
}
