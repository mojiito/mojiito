import { Logger, LogLevel, LogType } from '../../debug/debug';
import { Injectable } from '../../runtime/di/di';

export interface IDOMParserElementHook {
    predicate: (element: HTMLElement) => boolean;
    onBeforeParse?: (element: HTMLElement, context: Array<any>) => Object | Function;
    onParse?: (element: HTMLElement, context: Array<any>) => void;
    onAfterParse?: (element: HTMLElement, context: Array<any>) => void;
    onDestroy?: (element: HTMLElement) => void;
}

export interface IDOMParserAttributeHook {
    removeAttributeNode?: boolean;
    predicate: (attribute: Attr) => boolean;
    onBeforeParse?: (element: HTMLElement, attribute: Attr, context: Array<any>) => Object | Function;
    onParse?: (element: HTMLElement, attribute: Attr, context: Array<any>) => void;
    onAfterParse?: (element: HTMLElement, attribute: Attr, context: Array<any>) => void;
    onDestroy?: (element: HTMLElement, attribute: Attr) => void;
}

@Injectable()
export class DOMParser {
  
    private elementHooks: Array<IDOMParserElementHook> = [];
    private attributeHooks: Array<IDOMParserAttributeHook> = [];

    parseTree(rootElement?: HTMLElement): void {
        this.parseNode(rootElement, []);
    }

    private parseNode(element: HTMLElement, context?: Array<Array<Object | Function>>): void {
        if (!(element instanceof HTMLElement)) {
            throw new Error('The property element has to be an HTMLElement');
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
        let localContext: Array<Object | Function> = [];
        let filteredContext = context.filter((context: any) => !!context);
        for (let i = 0, max = elementHooks.length; i < max; i++) {
            var elementHook = elementHooks[i];
            if (elementHook.predicate(element)) {
                if (elementHook.onBeforeParse) {
                    try {
                        localContext = localContext.concat(elementHook.onBeforeParse(element, filteredContext));
                    } catch (ex) {
                        Logger.log(LogLevel.error, ex, LogType.error);
                    }
                }

                (function(hook: IDOMParserElementHook, element: HTMLElement) {
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

                    (function(hook: IDOMParserAttributeHook, element: HTMLElement, attribute: Attr) {
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

            if (node instanceof HTMLElement) {
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
}
