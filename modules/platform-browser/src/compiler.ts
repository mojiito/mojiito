import { ComponentFactory, ClassType, Component, ComponentResolver } from '../../core';
import { stringify, ListWrapper } from '../../facade';
import { CssSelector, SelectorMatcher } from './selector';
import { DomVisitor } from './dom_visitor';

export class Compiler {
  private _results = new Map<ClassType<any>, ComponentCompiledResult<any>>();

  constructor(private _resolver: ComponentResolver) { }

  get<C>(component: ClassType<C>): ComponentCompiledResult<C> {
    return this._results.get(component);
  }

  compileComponents(components: ClassType<any>[]): ComponentCompiledResult<any>[] {
    return components.map(c => this.compileComponent(c));
  }

  compileComponent<C>(component: ClassType<C>): ComponentCompiledResult<C> {
    const metadata = this._resolver.resolve(component);
    let selector = metadata.selector;

    let visitor: DomVisitor;
    if (metadata.components) {
      let compiled = this.compileComponents(ListWrapper.flatten(metadata.components));
      visitor = new DomVisitor(compiled);
    }
    const matcher = new SelectorMatcher();
    matcher.addSelectables(CssSelector.parse(selector));
    const result = new ComponentCompiledResult(new ComponentFactory(component), metadata,
     matcher , visitor);
    this._results.set(component, result);
    return result;
  }
}

export class ComponentCompiledResult<C> {
  constructor(public factory: ComponentFactory<C>, public metadata: Component,
    public matcher: SelectorMatcher, public visitor?: DomVisitor) { }
  get componentType(): ClassType<C> { return this.factory.componentType; }

  visitElement(element: Element) {
    // this.factory.create()
  }
}

// Check if a selector is specified in the metadata.
    // Every directive must have a selector
// if (typeof selector !== 'string')
//   throw new Error(`The component ${stringify(component)} has no ` +
//     `selector specified in the metadata!`);

// selector = selector.trim();

// if (selector.indexOf(' ') !== -1) {
//   throw new Error(`The selector of the component ${stringify(component)} does ` +
//     `cross element boundaries which is not allowed.`);
// }

// if (!selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/)) {
//   throw new Error(`The selector of the component ${stringify(component)} is not valid.`);
// }

// let selectorList =
//   selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');

// for (let i = 0, max = selectorList.length; i < max; i++) {
//   let selectorPart = selectorList[i];
//   if (!selectorPart.length) {
//     continue;
//   }

//   if (!/^\w+(-\w+)*$/.test(selectorPart)) {
//     continue;
//   }

//   // Check if the selector contains element names whicht are not allowed
//   // eg. custom elements without a "-" in it
//   if (document.createElement(selectorPart) instanceof HTMLUnknownElement &&
//     !/^\w+(-\w+)+$/.test(selectorPart)) {
//     throw new Error(`The selector "${selector}" of the component contains an element ` +
//       `name "${selectorPart}" which is not allowed.
//       If you are using a custom element, there has to be a "-" char in it. E.g.: my-component`);
//   }
// }
