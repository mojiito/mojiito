import { CssSelector, SelectorMatcher } from './selector';
import { ComponentCompiledResult } from './compiler';
import { Injector, AppView, ComponentRef, ApplicationRef, ClassType } from '../../core';
import { stringify, WrappedError } from '../../facade';

export interface Visitor {
  visitElement(element: Element, context: AppView<any>): any;
  visitAttribute(element: Element, attr: Attr, context: AppView<any>): any;
  visitText(text: Text, context: AppView<any>): any;
  visitComment(comment: Comment, context: AppView<any>): any;
  getVisitorForContext(context: AppView<any>): Visitor;
}

export class DomVisitor implements Visitor {

  constructor(private _selectables: ComponentCompiledResult<any>[]) { }

  visitElement(element: Element, context: AppView<any>): any {
    const elSelector = CssSelector.fromElement(element);
    const matching = this._selectables.filter(s => s.matcher.match(elSelector));
    if (matching.length) {
      if (matching.length > 1) {
        throw new MultipleComponentsOnElementError(matching.map(c => c.componentType));
      }
      if (context.nestedViews && context.nestedViews.length &&
        context.nestedViews.filter(v => v.nativeElement === element).length) {
        return context;
      }
      const ref = this._createComponent(element, context, matching[0]);
      return ref.view;
    }
  }

  visitAttribute(element: Element, attr: Attr) { }
  visitText(text: Text) { }
  visitComment(comment: Comment, context: AppView<any>) { }

  getVisitorForContext(context: AppView<any>): Visitor {
    const compiled =
      this._selectables.find(s => s.componentType === context.clazz);
    if (!compiled) {
      throw new ParseError(`No Visitor found for ${stringify(context.clazz)}!`);
    }
    return compiled.visitor;
  }

  private _createComponent(element: Element, context: AppView<any>,
    compile: ComponentCompiledResult<any>) {
    let injector: Injector;
    if (!(context instanceof AppView)) {
      throw new Error(`Error while parsing. Could not create view for ` +
        `${stringify(compile.componentType)} because no or the wrong context was provided!`);
    }

    const view = new compile.viewClass(context);
    const ref = view.create(element, injector);
    context.attachView(view, context.nestedViews.length);
    return ref;
  }
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
