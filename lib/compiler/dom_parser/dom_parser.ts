import { Logger, LogLevel, LogType } from '../../debug/debug';
import { Injectable } from '../../runtime/injectable/injectable';

export interface IDOMParserElementHook {
    predicate: (element: Element) => boolean;
    onBeforeParse?: (element: Element, context: Array<any>) => IDOMParserContextObject;
    onParse?: (element: Element, context: Array<any>) => void;
    onAfterParse?: (element: Element, context: Array<any>) => void;
    onDestroy?: (element: Element) => void;
}

export interface IDOMParserAttributeHook {
    removeAttributeNode?: boolean;
    predicate: (attribute: Attr) => boolean;
    onBeforeParse?: (element: Element, attribute: Attr, context: Array<any>) => IDOMParserContextObject;
    onParse?: (element: Element, attribute: Attr, context: Array<any>) => void;
    onAfterParse?: (element: Element, attribute: Attr, context: Array<any>) => void;
    onDestroy?: (element: Element, attribute: Attr) => void;
}

export interface IDOMParserContextObject {
    type: string,
    name: string,
    context: IDOMParserContext
}

export interface IDOMParserContextList extends Array<IDOMParserContextObject> {
    [index: number]: IDOMParserContextObject;
};

export interface IDOMParserContext extends Array<IDOMParserContextList> {
    [index: number]: IDOMParserContextList;
};

@Injectable
export class DOMParser {

    static _instance: DOMParser;    
    private elementHooks: Array<IDOMParserElementHook> = [];
    private attributeHooks: Array<IDOMParserAttributeHook> = [];

    parseTree(rootElement?: Element): void {
        this.parseNode(rootElement, []);
    }

    private parseNode(element: Element, context?: IDOMParserContext): void {
        if (!(element instanceof Element)) {
            throw new Error('The property element has to be an Element');
        }

        if (!Array.isArray(context)) {
            context = [];
        }
        
        // Skip script and styles elements
        const tagName: string = element.tagName.toUpperCase();
        if (tagName.toUpperCase() === 'SCRIPT' || tagName.toUpperCase() === 'STYLES') {
            return;
        }

        const elementHooks = this.elementHooks;
        const parseFunctions: any[] = [];
        const afterParseFunctions: any[] = [];
        let localContext: IDOMParserContextList = [];
        let filteredContext = context.filter((context: any) => !!context);
        for (let i = 0, max = elementHooks.length; i < max; i++) {
            var elementHook = elementHooks[i];
            if (elementHook.predicate(element)) {
                if (elementHook.onBeforeParse) {
                    try {
                        localContext = localContext.concat(elementHook.onBeforeParse(element, filteredContext));
                    } catch (ex) {
                        console.error(ex);
                    }
                }

                (function(hook: IDOMParserElementHook, element: Element) {
                    if (hook.onParse) parseFunctions.push((context: Array<any>) => { hook.onParse(element, context); });
                    if (hook.onAfterParse) afterParseFunctions.push((context: Array<any>) => { hook.onAfterParse(element, context); });
                })(elementHook, element);
            }
        }

        const attributes: NamedNodeMap = element.attributes;
        const attributeHooks = this.attributeHooks;
        let diff: number = 0;
        for (let i = 0, max = attributes.length; i < max; i++) {
            let attribute: Attr = attributes[i - diff];
            for (let j = 0, max = attributeHooks.length; j < max; j++) {
                let attributeHook = attributeHooks[j];

                if (attributeHook.predicate(attribute)) {
                    if (attributeHook.onBeforeParse) {
                        try {
                            localContext = localContext.concat(attributeHook.onBeforeParse(element, attribute, filteredContext));
                        } catch (ex) {
                            Logger.log(LogLevel.critical, ex, LogType.error);
                        }
                    }
                    if (attributeHook.removeAttributeNode) {
                        element.removeAttributeNode(attribute);
                        diff++;
                    }

                    (function(hook: IDOMParserAttributeHook, element: Element, attribute: Attr) {
                        if (hook.onParse) parseFunctions.push((context: Array<any>) => { hook.onParse(element, attribute, context); });
                        if (hook.onAfterParse) afterParseFunctions.push((context: Array<any>) => { hook.onAfterParse(element, attribute, context); });
                    })(attributeHook, element, attribute);
                }
            }
        }
        context.unshift(localContext.length ? localContext : null);
        filteredContext = context.filter((context: any) => !!context);

        for (let i = 0, max = parseFunctions.length; i < max; i++) {
            parseFunctions[i](filteredContext);
        }

        // loop through child nodes and recursively parse them       
        const nodes: NodeList = element.childNodes;
        for (let i = 0, max = nodes.length; i < max; i++) {
            let node: Node = nodes[i];
            let nodeType: number = node.nodeType;

            if (nodeType !== Node.ELEMENT_NODE && nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                continue;
            }

            if (node instanceof Element) {
                this.parseNode(node, context);
            }
        }



        for (let i = 0, max = afterParseFunctions.length; i < max; i++) {
            afterParseFunctions[i](filteredContext);
        }
        
        context.shift();
    }

    registerElementHook(hook: IDOMParserElementHook): void {
        this.elementHooks.push(hook);
    }


    registerAttributeHook(hook: IDOMParserAttributeHook): void {
        this.attributeHooks.push(hook);
    }

    static getInstance(): DOMParser {
        if (!(DOMParser._instance instanceof DOMParser)) {
            let instance = new DOMParser();
            Object.defineProperty(DOMParser, '_instance', {
                writable: false,
                configurable: false,
                enumerable: false,
                value: instance 
            });
            return instance;
        }

        return this._instance;
    }
}
