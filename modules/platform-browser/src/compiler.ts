import {
  ComponentFactory, ClassType, Component, ComponentResolver, Injectable,
  AppView, Renderer, RootRenderer, ComponentRef, ComponentFactoryResolver,
  resolveReflectiveProviders, ElementRef, Injector, ApplicationRef
} from '../../core';
import { stringify, ListWrapper } from '../../facade';
import { CssSelector, SelectorMatcher } from './selector';
import { Visitor, DomVisitor } from './dom_visitor';
import { DomRenderer } from './dom_renderer';
import { DomTraverser } from './dom_traverser';

export class ComponentCompiledResult<C> {
  constructor(public componentType: ClassType<C>, public viewClass: ClassType<AppView<C>>,
    public matcher: SelectorMatcher, public visitor: Visitor) { }
}

@Injectable()
export class Compiler {
  private _results = new Map<ClassType<any>, ComponentCompiledResult<any>>();

  constructor(private _resolver: ComponentResolver) { }

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
    const matcher = new SelectorMatcher();
    matcher.addSelectables(CssSelector.parse(metadata.selector));

    let visitor: Visitor = null;
    if (metadata.components) {
      let compiled = this.compileComponents(ListWrapper.flatten(metadata.components));
      visitor = new DomVisitor(compiled);
      compiled.forEach(c => {
        if (!c.visitor) {
          c.visitor = visitor;
        }
      });
    }
    const viewClass = this._compileView(component);
    const result =
      new ComponentCompiledResult(component, viewClass, matcher, visitor);
    this._results.set(component, result);
    return result;
  }

  private _compileView<C>(component: ClassType<C>): ClassType<AppView<C>> {
    const compiler = this;
    return class extends AppView<C> {
      private _ref: ComponentRef<C>;
      renderer: Renderer;
      clazz = component;

      createInternal(rootSelectorOrNode: string | Element): ComponentRef<C> {
        let rootRenderer =
          this._parentInjector.get(RootRenderer);
        let renderer = rootRenderer.renderComponent(rootSelectorOrNode);
        this.renderer = renderer;

        let provider = resolveReflectiveProviders([component])[0];
        if (!provider.resolvedFactories.length) {
          throw new Error(`Could not create component "${stringify(component)}". ` +
            `No factory found.`);
        }
        const resolved = provider.resolvedFactories[0];
        const deps = resolved.dependencies.map(d => this.get(d.key.token));
        this.context = resolved.factory(...deps);
        const ref = this._ref = new ComponentRef(this, renderer.location);
        return ref;
      }

      parseInternal(): void {
        const visitor = compiler.get(this.clazz).visitor;
        const traverser = new DomTraverser();
        traverser.traverse(this.renderer.location, visitor, this._ref);
      }

      getInternal(token: any, notFoundValue?: any): any {
        if (token === Injector) {
          return this;
        }
        if (token === ElementRef) {
          return new ElementRef(this.renderer.location);
        }
        if (token === Renderer) {
          return this.renderer;
        }
        return this._parentInjector.get(token, notFoundValue);
      }
    };
  }

}
