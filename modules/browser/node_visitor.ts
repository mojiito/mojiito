export class NodeVisitor {

    visitElement(element: Element, context: any) {
        if (element instanceof HTMLScriptElement || element instanceof HTMLStyleElement) {
            return;
        }
    }

    visitAttribute(attribute: Attr, context: any) {
        console.log('visit Attribute', attribute);
    }

    visitText(text: Text, context: any) {
        console.log('visit Attribute', text);
    }

}