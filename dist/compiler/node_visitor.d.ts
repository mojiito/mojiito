import { Visitor, VisitElement, VisitAttribute } from './def';
export declare class NodeVisitor extends Visitor implements VisitAttribute, VisitElement {
    visitElement(element: Element, context: any): void;
    visitAttribute(attribute: Attr, context: any): void;
}
