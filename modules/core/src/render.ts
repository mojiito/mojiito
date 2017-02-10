export abstract class Renderer {
  abstract location: any;
  abstract parse(element: any): void;
  abstract selectRootElement(selector: string): any;
  abstract selectElements(selector: string): any[];
  abstract createElement(parentElement: any, name: string): any;
  abstract createText(parentElement: any, value: string): any;
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
  abstract renderComponent(elementOrSelector: Element | string): Renderer;
}
