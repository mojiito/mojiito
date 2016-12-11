/**
 * A plain attribute on an element.
 */
export declare class AttrAst {
    name: string;
    value: string;
    constructor(name: string, value: string);
}
/**
 * A segment of text.
 */
export declare class TextAst {
    value: string;
    constructor(value: string);
}
/**
 * An element declaration
 */
export declare class ElementAst {
    name: string;
    attrs: AttrAst[];
    boundProperties: BoundElementPropertyAst[];
    boundEvents: BoundEventAst[];
    hasViewContainer: boolean;
    constructor(name: string, attrs: AttrAst[], boundProperties: BoundElementPropertyAst[], boundEvents: BoundEventAst[], hasViewContainer: boolean, children: ElementAst[]);
}
/**
 * A binding for an element property (e.g. `[property]="expression"`).
 */
export declare class BoundElementPropertyAst {
    name: string;
    value: string;
    type: PropertyBindingType;
    constructor(name: string, value: string, type: PropertyBindingType);
}
/**
 * A binding for an element event (e.g. `(event)="handler()"`).
 */
export declare class BoundEventAst {
    name: string;
    target: string;
    value: string;
    constructor(name: string, target: string, value: string);
}
export declare enum PropertyBindingType {
    /**
     * A normal binding to a property (e.g. `[property]="expression"`).
     */
    Property = 0,
    /**
     * A binding to an element attribute (e.g. `[attr.name]="expression"`).
     */
    Attribute = 1,
    /**
     * A binding to a CSS class (e.g. `[class.name]="condition"`).
     */
    Class = 2,
    /**
     * A binding to a style rule (e.g. `[style.rule]="expression"`).
     */
    Style = 3,
    /**
     * A binding to an animation reference (e.g. `[animate.key]="expression"`).
     */
    Animation = 4,
}
