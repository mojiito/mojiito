export interface IDOMParseElementHook {
    predicate: (element: Element) => boolean;
    onBeforeParse?: (element: Element, context: Array<any>) => Object;
    onParse?: (element: Element, context: Array<any>) => void;
    onAfterParse?: (element: Element, context: Array<any>) => void;
    onDestroy?: (element: Element) => void;
}

export interface IDOMParseAttributeHook {
    predicate: (attribute: Attr) => boolean;
    onBeforeParse?: (element: Element, attribute: Attr, context: Array<any>) => Object;
    onParse?: (element: Element, attribute: Attr, context: Array<any>) => void;
    onAfterParse?: (element: Element, attribute: Attr, context: Array<any>) => void;
    onDestroy?: (element: Element, attribute: Attr) => void;
}

export class DOMParser {

    private elementHooks: Array<IDOMParseElementHook> = [];
    private attributeHooks: Array<IDOMParseAttributeHook> = [];

    parseTree(rootElement?: Element): void {
        this.parseNode(rootElement, []);
    }

    private parseNode(element: Element, context?: Array<any>): void {
        if (!(element instanceof Element)) {
            throw new Error('The element element has to be an Element');
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
        let localContext: Array<Object> = [];
        let filteredContext = context.filter((context: any) => !!context);
        for (let i = 0, max = elementHooks.length; i < max; i++) {
            var elementHook = elementHooks[i];
            if (elementHook.predicate(element)) {
                if (elementHook.onBeforeParse) {
                    localContext = localContext.concat(elementHook.onBeforeParse(element, filteredContext));
                }

                (function(hook: IDOMParseElementHook, element: Element) {
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
                        localContext = localContext.concat(attributeHook.onBeforeParse(element, attribute, filteredContext));
                    }
                    element.removeAttributeNode(attribute);
                    diff++;

                    (function(hook: IDOMParseAttributeHook, element: Element, attribute: Attr) {
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

    registerElementHook(hook: IDOMParseElementHook): void {
        this.elementHooks.push(hook);
    }


    registerAttributeHook(hook: IDOMParseAttributeHook): void {
        this.attributeHooks.push(hook);
    }
}
