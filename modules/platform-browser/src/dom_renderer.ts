import { Renderer, RootRenderer,  Inject, Injectable, AppView } from 'mojiito-core';
import { isPresent, stringify } from './facade/lang';
import { DOCUMENT } from './tokens';
import { DomTraverser } from './dom_traverser';

@Injectable()
export abstract class DomRootRenderer implements RootRenderer {
  protected registeredComponents = new Map<AppView<any>, DomRenderer>();

  constructor(@Inject(DOCUMENT) public document: any) {}

  renderComponent(view: AppView<any>): Renderer {
    let renderer = this.registeredComponents.get(view);
    if (!renderer) {
      renderer = new DomRenderer(this, view);
      this.registeredComponents.set(view, renderer);
    }
    return renderer;
  }

  selectRootElement(selector: string): Element {
    const el = this.document.querySelector(selector);
    if (!el) {
      throw new Error(`The selector "${selector}" did not match any elements`);
    }
    return el;
  }

  getGlobalEventTarget(target: string): any {
    if (target === 'window') {
      return window;
    }
    if (target === 'document') {
      return this.document;
    }
    if (target === 'body') {
      return this.document.body;
    }
  }
}

export class DomRenderer implements Renderer {

  constructor(private _rootRenderer: DomRootRenderer, private _view: AppView<any>) { }

  parse() {
    this._view.parse();
  }

  selectRootElement(selector: string): Element {
    return this._rootRenderer.selectRootElement(selector);
  }

  selectElements(selector: string): Element[] {
    const elements = this._view.nativeElement.querySelectorAll(selector);
    return Array.prototype.slice.call(elements);
  }

  createElement(parent: Element | DocumentFragment, name: string): Element {
    let el = document.createElement(name);
    if (parent) {
      parent.appendChild(el);
    }
    return el;
  }

  createText(parentElement: Element | DocumentFragment, value: string): any {
    const node = document.createTextNode(value);
    if (parentElement) {
      parentElement.appendChild(node);
    }
    return node;
  }

  listen(element: Element, name: string, handler: Function): Function {
    element.addEventListener(name, handler as any, false);
    return () => element.removeEventListener(name, handler as any, false);
  }

  listenGlobal(target: string, name: string, handler: Function): Function {
    const element = this._rootRenderer.getGlobalEventTarget(target);
    if (!element) {
      throw new Error(`Unsupported event target ${target} for event ${name}`);
    }
    return this.listen(element, name, handler);
  }

  setElementProperty(element: Element | DocumentFragment, propertyName: string,
    propertyValue: any): void {
    (element as any)[propertyName] = propertyValue;
  }

  setElementAttribute(element: Element, attributeName: string, attributeValue: string): void {
    if (isPresent(attributeValue)) {
      element.setAttribute(attributeName, attributeValue);
    } else {
      element.removeAttribute(attributeName);
    }
  }

  setElementClass(element: Element, className: string, isAdd: boolean): void {
    if (isAdd) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }

  setElementStyle(element: HTMLElement, styleName: string, styleValue: string): void {
    if (isPresent(styleValue)) {
      (element.style as any)[styleName] = stringify(styleValue);
    } else {
      (element.style as any)[styleName] = '';
    }
  }

  invokeElementMethod(element: Element, methodName: string, args: any[]): void {
    (element as any)[methodName].apply(element, args);
  }

  setText(renderNode: Text, text: string): void {
    renderNode.nodeValue = text;
  }
}
