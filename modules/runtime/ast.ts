/**
 * A binding for an element property (e.g. `[property]="expression"`).
 */
export class BoundElementPropertyAst {
    constructor(public name: string, public value: string, public type: PropertyBindingType) {}
}

/**
 * A binding for an element event (e.g. `(event)="handler()"`).
 */
export class BoundEventAst {
    constructor(public name: string, public target: string, public value: string) {}
}

// https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/template_parser/template_ast.ts#L211
export enum PropertyBindingType {

  /**
   * A normal binding to a property (e.g. `[property]="expression"`).
   */
  Property,

  /**
   * A binding to an element attribute (e.g. `[attr.name]="expression"`).
   */
  Attribute,

  /**
   * A binding to a CSS class (e.g. `[class.name]="condition"`).
   */
  Class,

  /**
   * A binding to a style rule (e.g. `[style.rule]="expression"`).
   */
  Style,

  /**
   * A binding to an animation reference (e.g. `[animate.key]="expression"`).
   */
  Animation
}