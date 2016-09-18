import { RuntimeCompiler } from './compiler';
export declare class NodeVisitor {
    private _compiler;
    private _selectables;
    private _expressionParser;
    constructor(_compiler: RuntimeCompiler);
    visitElement(element: Element, context: any): any;
    visitAttribute(attribute: Attr, context: any): void;
    visitText(text: Text, context: any): void;
    private _parseAttribute(attr);
    private _parsePropertyOrAnimation(name, expression);
    private _parseProperty(name, expression);
    private _parseEvent(name, expression);
    private _parseBinding(expression);
    private _createDirective(factory, context);
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
