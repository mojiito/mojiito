export class DOMParser {
    
    private REGEX_IS_ACTION = /^\(\w+\)$/;
    private REGEX_IS_BIND_ATTR_ONEWAY = /^\[\w+\]$/;
    private REGEX_IS_BIND_ATTR_TWOWAY = /^\[\(\w+\)\]$/;
    private REGEX_IS_FUNCTION = /\w+\(.*\)/;
    private REGEX_FIND_FUNCTION_PARAMS = /\(.+\)$/;
    private REGEX_FIND_NAME = /\w+/;
    private ATTR_TYPE_ACTION = 'action';
    private ATTR_TYPE_BINDING_ONEWAY = 'action';
    private ATTR_TYPE_BINDING_TWOWAY = 'action';
    private ATTR_TYPE_BINDING_CLASS = 'action';

    parseTree(root?: Element): void {
        if (!(root instanceof Element)) {
            throw new Error('The root element has to be an Element');
        }
        
        // Skip script and styles elements
        const tagName: string = root.tagName.toUpperCase();
        if (tagName === 'SCRIPT' || tagName === 'STYLES') {
            return;
        }

        this.parseElement(root);

        // loop through child nodes and recursively parse them       
        const nodes: NodeList = root.childNodes;
        for (let i = 0, max = nodes.length; i < max; i++) {
            let node: Node = nodes[i];
            let nodeType: number = node.nodeType;

            if (nodeType !== Node.ELEMENT_NODE && nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                continue;
            }

            if (node instanceof Element) {
                this.parseTree(node);
            }

        }
    }

    parseElement(element: Element): void {
        if (!(element instanceof Element)) {
            throw new Error('The element has to be type of Element');
        }

        const attributes: NamedNodeMap = element.attributes;
        for (let i = 0, max = attributes.length; i < max; i++) {
            let attribute: Attr = attributes[i];
            let attributeName: string = attribute.name;
            let attributeValue: string = attribute.value;
            let type: string = ''; 
            
            if (attributeName.match(this.REGEX_IS_ACTION)) {
                type = this.ATTR_TYPE_ACTION;
            } else if(attributeName.match(this.REGEX_IS_BIND_ATTR_ONEWAY)){
                type = this.ATTR_TYPE_BINDING_ONEWAY;
            } else if(attributeName.match(this.REGEX_IS_BIND_ATTR_TWOWAY)){
                type = this.ATTR_TYPE_BINDING_TWOWAY;
            } else if (attributeName === 'class') {
                
            } else {
                continue;
            }
            
            let identifier: string = attributeName.match(this.REGEX_FIND_NAME)[0];
            let isValueFunction: boolean = !!attributeValue.match(this.REGEX_IS_FUNCTION);
            let value: string = isValueFunction ? attributeValue.match(this.REGEX_FIND_NAME)[0] : attributeValue;
            let params: Array<any> = [];
            
            if (isValueFunction) {
                let paramsString: any = attributeValue.match(this.REGEX_FIND_FUNCTION_PARAMS);
            }
            
        }
    }
}