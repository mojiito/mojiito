export interface IDOMParseElementHook {
    predicate: (element: Element) => boolean;
    onResolvedPredicate: (element: Element, context: Array<any>) => void;
    onDestroy?: (element: Element) => void;
}

export interface IDOMParseAttributeHook {
    predicate: (attribute: Attr) => boolean;
    onResolvedPredicate: (element: Element, attribute: Attr, context: Array<any>) => Object;
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
        for (let i = 0, max = elementHooks.length; i < max; i++) {
            let hook = elementHooks[i];
            if (hook.predicate(element)) {
                hook.onResolvedPredicate(element, context);
            }
        }

        const attributes: NamedNodeMap = element.attributes;
        const attributeHooks = this.attributeHooks;
        let diff: number = 0;
        let localContext: Array<Object> = [];
        for (let i = 0, max = attributes.length; i < max; i++) {
            let attribute: Attr = attributes[i - diff];
            for (let j = 0, max = attributeHooks.length; j < max; j++) {
                let hook = attributeHooks[j];

                if (hook.predicate(attribute)) {
                    localContext = localContext.concat(hook.onResolvedPredicate(element, attribute, context.filter( (value: any) => {
                        return !!value;
                    })));
                    element.removeAttributeNode(attribute);
                    diff++;
                }
            }
        }
        context.unshift(localContext.length ? localContext : null);

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

        context.shift();
    }

    registerElementHook(hook: IDOMParseElementHook): void;
    registerElementHook(predicate: (element: Element) => boolean, onResolvedPredicate: (element: Element, context: Array<any>) => Object, onDestroy?: (element: Element) => void): void;
    registerElementHook(...args: Array<any>) {
        this.registerHook(this.elementHooks, ...args);
    }


    registerAttributeHook(hook: IDOMParseAttributeHook): void;
    registerAttributeHook(predicate: (attribute: Attr) => boolean, onResolvedPredicate: (element: Element, attribute: Attr, context: Array<any>) => Object, onDestroy?: (element: Element, attribute: Attr) => void): void;
    registerAttributeHook(...args: Array<any>) {
        this.registerHook(this.attributeHooks, ...args);
    }

    private registerHook(hooksArray: Array<any>, ...args: Array<any>) {
        if (args.length === 1) {
            hooksArray.push(args[0]);
        } else {
            hooksArray.push({
                predicate: args[0],
                onResolvedPredicate: args[1],
                onDestroy: args[2]
            });
        }
    }
}
