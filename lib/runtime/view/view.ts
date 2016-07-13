import { DOMParser } from '../../parser/parser';

export class View {

    private parser: DOMParser;  
    private _rootElement: HTMLElement;

    get rootElement(): HTMLElement {
        return this._rootElement;
    }

    constructor(element: HTMLElement) {
        this._rootElement = element;
    }

    /**
     * TODO: Implement 
     */
    render() { }

    parse() { }
    destroy() { }
}