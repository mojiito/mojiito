import { CssSelector, SelectorMatcher } from './selector';
import { ComponentCompiledResult } from './compiler';
import {
  Injector, AppView, ComponentRef, ApplicationRef, ClassType
} from '../../core';
import { stringify, WrappedError } from '../../facade';

export interface Visitor {
  visitElement(element: Element, context: any): any;
  visitAttribute(element: Element, attr: Attr, context: any): any;
  visitText(text: Text, context: any): any;
  visitComment(comment: Comment, context: any): any;
  get(context: any): Visitor;
}

export class DomVisitor implements Visitor {

  constructor(private _selectables: ComponentCompiledResult<any>[]) { }

  visitElement(element: Element, context: any): any {
    const elSelector = CssSelector.fromElement(element);
    const matching = this._selectables.filter(s => s.matcher.match(elSelector));
    if (matching.length) {
      if (matching.length > 1) {
        throw new MultipleComponentsOnElementError(matching.map(c => c.componentType));
      }
      this._createComponent(element, context, matching[0]);
    }
  }

  visitAttribute(element: Element, attr: Attr) { }
  visitText(text: Text) { }
  visitComment(comment: Comment, context: any) { }

  get(context: any): Visitor {
    if (context !== ComponentRef) {
      return this;
    }
    const compiled =
      this._selectables.find(s => s.componentType === context.componentType);
    if (!compiled) {
      throw new ParseError(`No Visitor found for ${stringify(context.compoentType)}!`);
    }
    return compiled.visitor;
  }


  private _createComponent(element: Element, context: any, compile: ComponentCompiledResult<any>) {
    let injector: Injector;
    let parent: AppView<any> = null;
    let app: ApplicationRef;
    if (context instanceof ComponentRef) {
      injector = context.injector;
      parent = context.view;
    } else if (context instanceof ApplicationRef) {
      injector = context.injector;
      app = context;
    } else if (context instanceof AppView) {
      injector = context.injector;
      parent = context;
    } else {
      throw new Error(`Error while parsing. Could not create view for ` +
        `${stringify(compile.componentType)} because no context was provided!`);
    }

    const view = new compile.viewClass(parent);
    const ref = view.create(element, injector);
    if (app instanceof ApplicationRef) {
      app._loadComponent(ref);
    }
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
