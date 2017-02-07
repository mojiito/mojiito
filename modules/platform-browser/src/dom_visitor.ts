import { CssSelector, SelectorMatcher } from './selector';

export interface Selectable {
  matcher: SelectorMatcher;
  visitElement: (element: Element) => any;
}

export class DomVisitor {

  constructor(private _selectables: Selectable[]) { }

  visitElement(element: Element): any {
    const elSelector = CssSelector.fromElement(element);
    this._selectables.forEach(s => {
      if (s.matcher.match(elSelector)) {
        s.visitElement(element);
      }
    });
  }

  visitAttribute(element: Element, attr: Attr) { }
  visitText(text: Text) { }
}
