import {
  ComponentFactory, ClassType, Component, ComponentResolver, Injectable,
  AppView, Renderer, RootRenderer, ComponentRef, ComponentFactoryResolver,
  resolveReflectiveProviders, ElementRef, Injector, ApplicationRef, Provider,
  ReflectiveInjector, ReflectorReader, HostListener, ChildListener
} from 'mojiito-core';
import { ComponentCompileResult } from './compile_result';
import { ListWrapper } from './facade/collection';
import { stringify } from './facade/lang';
import { CssSelector, SelectorMatcher } from './selector';
import { Visitor, DomVisitor } from './dom_visitor';
import { DomRenderer } from './dom_renderer';
import { DomTraverser } from './dom_traverser';

const UNDEFINED = new Object();

export class ComponentCompiledResult<C> {
  constructor(public componentType: ClassType<C>, public viewClass: ClassType<AppView<C>>,
    public matcher: SelectorMatcher, public visitor: Visitor) { }
}

@Injectable()
export class Compiler {
  private _results = new Map<ClassType<any>, ComponentCompiledResult<any>>();

  constructor(private _resolver: ComponentResolver, private _reflector: ReflectorReader) { }

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
    let injector: Injector = null;
    if (metadata.providers) {
      injector = ReflectiveInjector.resolveAndCreate(metadata.providers);
    }
    const viewClass = this._compileView(component, injector);

    let props = this._reflector.propMetadata(component);
    let hostListeners: {[key: string]: string};
    const childListeners: any[] = [];

    for (var handler in props) {
      if (props.hasOwnProperty(handler)) {
        ListWrapper.forEach(props[handler], obj => {
          if (obj instanceof HostListener) {
            if (!hostListeners) {
              hostListeners = {};
            }
            if (hostListeners[obj.eventName]) {
              throw new Error(`Multible host listeners with the event name ` +
                `'${obj.eventName}' are declared in the component '${stringify(component)}'`);
            }
            hostListeners[obj.eventName] = handler;
          }else if (obj instanceof ChildListener) {
          }
        });
      }
    }

    const l = new ComponentCompileResult<C>({
      componentFactory: new ComponentFactory(viewClass, component),
      hostListeners: hostListeners,
      providers: metadata.providers,
      selector: metadata.selector,
      type: component
    });
    console.log(l);

    // TODO
    // Always compile a visitor even if no sub components are there
    // Issue: #38
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
    const result =
      new ComponentCompiledResult(component, viewClass, matcher, visitor);
    this._results.set(component, result);
    return result;
  }

  private _compileView<C>(component: ClassType<C>, injector: Injector): ClassType<AppView<C>> {
    const compiler = this;
    return class extends AppView<C> {
      private _ref: ComponentRef<C>;
      renderer: Renderer;
      clazz = component;

      createInternal(rootSelectorOrNode: string | Element): ComponentRef<C> {
        let rootRenderer = this.getInternal(RootRenderer) as RootRenderer;
        let element = rootSelectorOrNode as Element;
        if (typeof rootSelectorOrNode === 'string') {
          element = rootRenderer.selectRootElement(rootSelectorOrNode);
        }
        this.nativeElement = element;
        let renderer = rootRenderer.renderComponent(this);
        this.renderer = renderer;

        let provider = resolveReflectiveProviders([component])[0];
        if (!provider.resolvedFactories.length) {
          throw new Error(`Could not create component "${stringify(component)}". ` +
            `No factory found.`);
        }
        const resolved = provider.resolvedFactories[0];
        const deps = resolved.dependencies.map(d => this.getInternal(d.key.token));
        this.context = resolved.factory(...deps);
        const ref = this._ref = new ComponentRef(this, this.nativeElement);
        return ref;
      }

      protected parseInternal(): void {
        const visitor = compiler.get(this.clazz).visitor;
        if (visitor) {
          const traverser = new DomTraverser();
          traverser.traverse(this.nativeElement, visitor, this);
        }
      }

      protected getInternal(token: any, notFoundValue?: any): any {
        if (token === Injector) {
          return this;
        }
        if (token === ElementRef) {
          return new ElementRef(this.nativeElement);
        }
        if (token === Renderer) {
          return this.renderer;
        }
        let result = UNDEFINED;
        if (injector) {
          result = injector.get(token, UNDEFINED);
        }

        if (result === UNDEFINED && this._hostInjector) {
          result = this._hostInjector.get(token, this.parentView ? UNDEFINED : notFoundValue);
        }
        if (result === UNDEFINED && this.parentView) {
          result = this.parentView.get(token, notFoundValue);
        }
        return result;
      }
    };
  }

}
