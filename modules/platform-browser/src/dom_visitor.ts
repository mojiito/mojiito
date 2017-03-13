import { CssSelector, SelectorMatcher } from './selector';
import { Injector, ComponentRef, ApplicationRef, ClassType } from 'mojiito-core';
import { WrappedError } from './facade/error';
import { stringify } from './facade/lang';
import { ListWrapper } from './facade/collection';

export interface Visitor {
  visitElement(element: Element, context: any): any;
  visitAttribute(element: Element, attr: Attr, context: any): any;
  visitText(text: Text, context: any): any;
  visitComment(comment: Comment, context: any): any;
  // getVisitorForContext(context: any): Visitor;
}

export class DomVisitor implements Visitor {

  selectorMatcher = new SelectorMatcher();
  componentsIndex = new Map<any, number>();

  constructor(components: any[]) {
    components.forEach((component, index) => {
      const selector = CssSelector.parse(component.selector);
      this.selectorMatcher.addSelectables(selector, component);
      this.componentsIndex.set(component, index);
    });
  }

  visitElement(element: Element, context: any): any {
    const elementCssSelector = CssSelector.fromElement(element);
    let matchingComponent: any = null;
    this.selectorMatcher.match(elementCssSelector, (selector, component) => {
      if (matchingComponent) {
        throw new MultipleComponentsOnElementError([matchingComponent.type, component.type]);
      }
      matchingComponent = component;
    });
    //
    // const matching = this._selectables.filter(s => s.matcher.match(elSelector));
    // if (matching.length) {
    //   if (matching.length > 1) {
    //     throw new MultipleComponentsOnElementError(matching.map(c => c.componentType));
    //   }
    //   if (context.nestedViews && context.nestedViews.length &&
    //     context.nestedViews.filter(v => v.nativeElement === element).length) {
    //     return context;
    //   }
    //   const compiled = matching[0];
    //   const ref = this._createComponent(element, context, compiled);
    //   return ref.view;
    // }

    ListWrapper.forEach(element.attributes, attr => {

    });
  }

  visitAttribute(element: Element, attr: Attr, context: any) { }
  visitText(text: Text, context: any) { }
  visitComment(comment: Comment, context: any) { }

  // getVisitorForContext(context: any): Visitor {
  //   const compiled =
  //     this._selectables.find(s => s.componentType === context.clazz);
  //   if (!compiled) {
  //     throw new ParseError(`No Visitor found for ${stringify(context.clazz)}!`);
  //   }
  //   return compiled.visitor;
  // }

  // private _createComponent(element: Element, context: AppView<any>,
  //   compile: ComponentCompiledResult<any>) {
  //   let injector: Injector;
  //   if (!(context instanceof AppView)) {
  //     throw new Error(`Error while parsing. Could not create view for ` +
  //       `${stringify(compile.componentType)} because no or the wrong context was provided!`);
  //   }

  //   const view = new compile.viewClass(context);
  //   const ref = view.create(element, injector);
  //   context.attachView(view, context.nestedViews.length);
  //   return ref;
  // }
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
