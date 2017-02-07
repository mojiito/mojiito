import {
  ComponentFactory, ClassType, Component, ComponentResolver, Injectable,
  AppView, Renderer, ComponentRef, ComponentFactoryResolver,
  resolveReflectiveProviders, ElementRef
} from '../../core';
import { stringify, ListWrapper } from '../../facade';
import { CssSelector, SelectorMatcher } from './selector';
import { DomVisitor } from './dom_visitor';

@Injectable()
export class Compiler {
  private _results = new Map<ClassType<any>, ComponentCompiledResult<any>>();

  constructor(private _resolver: ComponentResolver, private _renderer: Renderer) { }

  get componentFactoryResolver() {
    const factories: ComponentFactory<any>[] = [];
    this._results.forEach((r, c) => {
      factories.push(new ComponentFactory(r.viewClass, c));
    });
    return new ComponentFactoryResolver(factories);
  }

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
    const result =
      new ComponentCompiledResult(this._compileView(component, this._renderer), matcher, visitor);
    this._results.set(component, result);
    return result;
  }

  private _compileView<C>(component: ClassType<C>, _renderer: Renderer): ClassType<AppView<C>> {
    return class extends AppView<C> {
      renderer = _renderer;
      rootNode: Element;
      clazz = component;

      createInternal(rootSelectorOrNode: string | any): ComponentRef<C> {
        if (typeof rootSelectorOrNode === 'string') {
          const elements = this.renderer.selectElements(rootSelectorOrNode);
          if (!elements.length) return;
          this.rootNode = elements[0];
        } else if (rootSelectorOrNode instanceof Element) {
          this.rootNode = rootSelectorOrNode;
        }

        let provider = resolveReflectiveProviders([component])[0];
        if (!provider.resolvedFactories.length) {
          throw new Error(`Could not create component "${stringify(component)}". ` +
            `No factory found.`);
        }
        const resolved = provider.resolvedFactories[0];
        const deps = resolved.dependencies.map(d => {
          if (d.key.token === ElementRef) {
            return this.rootNode;
          }
          return this.injector.get(d.key.token);
        });
        this.context = resolved.factory(...deps);
        return new ComponentRef(this);
      }
    };
  }

}

export class ComponentCompiledResult<C> {
  constructor(public viewClass: ClassType<AppView<C>>, public matcher: SelectorMatcher,
    public visitor?: DomVisitor) { }

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
