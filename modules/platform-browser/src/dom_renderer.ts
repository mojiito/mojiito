import { Renderer, RootRenderer,  Inject, Injectable } from '../../core';
import { isPresent, stringify } from '../../facade';
import { DOCUMENT } from './tokens';

@Injectable()
export class DomRenderer implements Renderer {

  constructor(@Inject(DOCUMENT) public document: Document) {}

  selectElements(selector: string): Element[] {
    const elements = this.document.querySelectorAll(selector);
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

  listen(element: Element, eventName: string, handler: Function): Function {
    element.addEventListener(eventName, handler as any, false);
    return () => element.removeEventListener(eventName, handler as any, false);
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
