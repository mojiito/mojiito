import { AppView } from './component/view';

export abstract class Renderer {
  abstract parse(): void;
  abstract selectRootElement(selector: string): any;
  abstract selectElements(selector: string): any[];
  abstract createElement(parentElement: any, name: string): any;
  /**
   * Creates a new TextNode on the parentElement
   * @param {*} parentElement
   * @param {string} value
   * @memberOf Renderer
   */
  abstract createText(parentElement: any, value: string): any;
  /**
   * Listens for an event on the element and calls callback
   * function. Returns function for removing this listener.
   * @param {*} element
   * @param {string} name
   * @param {Function} callback
   * @returns {Function}
   * @memberOf Renderer
   */
  abstract listen(element: any, name: string, callback: Function): Function;
  abstract setElementProperty(element: any, propertyName: string, propertyValue: any): void;
  abstract setElementAttribute(element: any, attributeName: string, attributeValue: string): void;
  abstract setElementClass(element: any, className: string, isAdd: boolean): void;
  abstract setElementStyle(element: any, styleName: string, styleValue: string): void;
  abstract invokeElementMethod(element: any, methodName: string, args?: any[]): void;
  abstract setText(renderNode: any, text: string): void;
}

export abstract class RootRenderer {
  abstract selectRootElement(selector: string): any;
  abstract renderComponent(view: AppView<any>): Renderer;
}
