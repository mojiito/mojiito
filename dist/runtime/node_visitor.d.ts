export declare class NodeVisitor {
    private _selectables;
    private _expressionParser;
    constructor(selectables: any[]);
    visitElement(element: Element, context: any): any;
    visitAttribute(attr: Attr, context: any): void;
    visitText(text: Text, context: any): void;
    private _parseAttribute(attr, targetProperties, targetEvents);
    private _parsePropertyOrAnimation(name, expression, targetProperties);
    private _parseProperty(name, expression, targetProperties);
    private _parseEvent(name, expression, targetEvents);
    /**
     * Normalizes attribute name, removes "data-"
     * See: https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/template_parser/template_parser.ts#L583
     *
     * @private
     * @param {string} attrName
     * @returns {string}
     *
     * @memberOf NodeVisitor
     */
    private _normalizeAttributeName(attrName);
}
