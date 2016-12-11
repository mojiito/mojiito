import { Injector } from '../core/di/di';
import { BoundElementPropertyAst, BoundEventAst, TextAst, ElementAst } from './ast';
export declare class NodeVisitor {
    private _selectables;
    private _expressionParser;
    constructor(selectables: any[]);
    visitElement(element: Element, parentContext: ContextRef): any;
    visitAttribute(element: Element, attr: Attr, context: ContextRef): ContextRef;
    visitText(text: Text, context: ContextRef): ContextRef;
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
export declare function getVisitorForContext(context: any): NodeVisitor;
export declare function createNodeVisitor(selectables: any[], injector: Injector): NodeVisitor;
export declare class ContextRef {
    contextFactory: any;
    ast: ElementAst;
    node: Node;
    inputs: BoundElementPropertyAst[];
    outputs: BoundEventAst[];
    childNodes: Map<Node, ElementAst | TextAst>;
    bindings: Map<Node, BoundElementPropertyAst>;
    disposables: Map<Node, BoundEventAst>;
    constructor(contextFactory: any, ast: ElementAst, node: Node, inputs: BoundElementPropertyAst[], outputs: BoundEventAst[]);
}
