import { CssSelector, SelectorMatcher } from './selector';
import { Injector, ComponentRef, ApplicationRef, ClassType } from 'mojiito-core';
import { WrappedError } from './facade/error';
import { stringify } from './facade/lang';
import { ListWrapper } from './facade/collection';
import { CompileComponentSummary } from './compiler/compile_result';

export class VisitorFactory {

}

export interface Visitor {
  visitElement(element: Element, context: any): any;
  visitAttribute(element: Element, attr: Attr, context: any): any;
  visitText(text: Text, context: any): any;
  visitComment(comment: Comment, context: any): any;
  // getVisitorForContext(context: any): Visitor;
}

export class DomVisitor implements Visitor {

  selectorMatcher = new SelectorMatcher();
  componentsIndex = new Map<CompileComponentSummary, number>();

  constructor(components: CompileComponentSummary[]) {
    components.forEach((component, index) => {
      const selector = CssSelector.parse(component.selector);
      this.selectorMatcher.addSelectables(selector, component);
      this.componentsIndex.set(component, index);
    });
  }

  visitElement(element: Element, context: any): any {
    const elementCssSelector = CssSelector.fromElement(element);
    let matchingComponent: any;
    this.selectorMatcher.match(elementCssSelector, (selector, component) => {
      if (matchingComponent) {
        throw new MultipleComponentsOnElementError([matchingComponent.type, component.type]);
      }
      matchingComponent = component;
    });

    if (!matchingComponent) {
      return this;
    }

    console.log(`Found ${stringify(matchingComponent)} on element:`, element);

    ListWrapper.forEach(element.attributes, attr => {

    });
  }

  visitAttribute(element: Element, attr: Attr, context: any) { }
  visitText(text: Text, context: any) { }
  visitComment(comment: Comment, context: any) { }

}

export class ParseError extends WrappedError {
  constructor(error: any) {
    super(`Parse Error`, error);
  }
}

export class MultipleComponentsOnElementError extends ParseError {
  constructor(components: ClassType<any>[]) {
    const names = components.map(c => stringify(c)).join(', ');
    super(`The selectors of the components ${names} are matching the same DOM Element. ` +
      `Only one component per element is allowed.`);
  }
}
