import { Logger, LogLevel, LogType } from '../../debug/debug';
import { Injectable } from '../../core/di/di';
import { ContextTree } from './context';

export interface IDOMParserElementHook {
    predicate: (element: Element) => boolean;
    onBeforeParse?: (element: Element, context: ContextTree) => Object | Function;
    onParse?: (element: Element, context: ContextTree) => void;
    onAfterParse?: (element: Element, context: ContextTree) => void;
    onDestroy?: (element: Element) => void;
}

export interface IDOMParserAttributeHook {
    removeAttributeNode?: boolean;
    predicate: (attribute: Attr) => boolean;
    onBeforeParse?: (element: Element, attribute: Attr, context: ContextTree) => Object | Function;
    onParse?: (element: Element, attribute: Attr, context: ContextTree) => void;
    onAfterParse?: (element: Element, attribute: Attr, context: ContextTree) => void;
    onDestroy?: (element: Element, attribute: Attr) => void;
}

@Injectable()
export class DOMParser {

    static PARSED_ELEMENT_ATTR = '_mparsed';
  
    private elementHooks: Array<IDOMParserElementHook> = [];
    private attributeHooks: Array<IDOMParserAttributeHook> = [];

    parseTree(rootElement: Element, context?: any | any[], skipRootElement?: boolean): void {
        if (typeof context === 'boolean') {
            skipRootElement = context;
        }
        this.parseNode(rootElement, new ContextTree(context), skipRootElement);
    }

    private parseNode(element: Element, contextTree: ContextTree, skipRootElement = false): void {
        if (!(element instanceof Element)) {
            throw new Error('The property element has to be an Element');
        }

        if (!skipRootElement)  {
            contextTree.down();
        }
        
        // Skip script and styles elements
        const tagName: string = element.tagName.toUpperCase();
        if (tagName.toUpperCase() === 'SCRIPT' || tagName.toUpperCase() === 'STYLES') {
            return;
        }

        const elementHooks = this.elementHooks;
        const parseFunctions: any[] = [];
        const afterParseFunctions: any[] = [];

        if (element.hasAttribute(DOMParser.PARSED_ELEMENT_ATTR)) {
            skipRootElement = true;
        }
        
        if (!skipRootElement) {
            for (let i = 0, max = elementHooks.length; i < max; i++) {
                var elementHook = elementHooks[i];
                if (elementHook.predicate(element)) {
                    if (elementHook.onBeforeParse) {
                        try {
                            contextTree.add(elementHook.onBeforeParse(element, contextTree));
                        } catch (ex) {
                            Logger.log(LogLevel.error, ex, LogType.error);
                        }
                    }

                    (function (hook: IDOMParserElementHook, element: Element) {
                        if (hook.onParse) parseFunctions.push((context: ContextTree) => { hook.onParse(element, context); });
                        if (hook.onAfterParse) afterParseFunctions.push((context: ContextTree) => { hook.onAfterParse(element, context); });
                    })(elementHook, element);
                }
            }
            const attributes: NamedNodeMap = element.attributes;
            const attributeHooks = this.attributeHooks;
            let diff: number = 0;
            for (let i = 0, max = attributes.length; i < max; i++) {
                let attribute: Attr = attributes[i - diff];
                if (attribute.name === DOMParser.PARSED_ELEMENT_ATTR) {
                    continue;
                }
                for (let j = 0, max = attributeHooks.length; j < max; j++) {
                    let attributeHook = attributeHooks[j];

                    if (attributeHook.predicate(attribute)) {
                        if (attributeHook.onBeforeParse) {
                            try {
                                contextTree.add(attributeHook.onBeforeParse(element, attribute, contextTree));
                            } catch (ex) {
                                Logger.log(LogLevel.critical, ex, LogType.error);
                            }
                        }
                        if (attributeHook.removeAttributeNode) {
                            element.removeAttributeNode(attribute);
                            diff++;
                        }

                        (function (hook: IDOMParserAttributeHook, element: Element, attribute: Attr) {
                            if (hook.onParse) parseFunctions.push((context: ContextTree) => { hook.onParse(element, attribute, context); });
                            if (hook.onAfterParse) afterParseFunctions.push((context: ContextTree) => { hook.onAfterParse(element, attribute, context); });
                        })(attributeHook, element, attribute);
                    }
                }
            }
            for (let i = 0, max = parseFunctions.length; i < max; i++) {
                parseFunctions[i](contextTree);
            }
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
                this.parseNode(node, contextTree);
            }
        }


        if (!skipRootElement) {
            for (let i = 0, max = afterParseFunctions.length; i < max; i++) {
                afterParseFunctions[i](contextTree);
            }
        }

        element.setAttribute(DOMParser.PARSED_ELEMENT_ATTR, '');
        if (!skipRootElement) {
            contextTree.up();
        }
    }

    registerElementHook(hook: IDOMParserElementHook): void {
        this.elementHooks.push(hook);
    }


    registerAttributeHook(hook: IDOMParserAttributeHook): void {
        this.attributeHooks.push(hook);
    }
}
