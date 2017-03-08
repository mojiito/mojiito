import {
  ClassType, Component, ComponentResolver, Injectable, Renderer, ComponentRef,
  ComponentFactory, ComponentFactoryResolver, createComponentFactory, resolveReflectiveProviders,
  ElementRef, Injector, ApplicationRef, Provider, ReflectiveInjector, ReflectorReader,
  HostListener, ChildListener
} from 'mojiito-core';
import { ComponentCompileResult, EventBindingCompileResult } from './compile_result';
import { ListWrapper } from '../facade/collection';
// import { stringify } from './facade/lang';
import { Visitor, DomVisitor } from '../dom_visitor';
import { DomRenderer } from '../dom_renderer';
import { DomTraverser } from '../dom_traverser';
import { BindingParser, EventBindingParseResult } from '../binding_parser';

const UNDEFINED = new Object();

@Injectable()
export class Compiler {

  private _compileResults = new Map<ClassType<any>, CompileComponentSummary>();

  constructor(private _resolver: ComponentResolver, private _bindParser: BindingParser) { }

  createComponentFactoryResolver() {
    const factories: ComponentFactory<any>[] = [];
    this._compileResults.forEach(summary => {
      factories.push(summary.componentFactory);
    });
    return new ComponentFactoryResolver(factories);
  }

  compileComponents(components: ClassType<any>[]): CompileComponentSummary[] {
    return components.map(c => this.compileComponent(c));
  }

  compileComponent<C>(component: ClassType<C>): CompileComponentSummary {
    let compileSummary = this._compileResults.get(component);
    if (compileSummary) {
      return compileSummary;
    }
    const metadata = this._resolver.resolve(component);

    // TODO
    // Always compile a visitor even if no sub components are there
    // Issue: #38
    let visitor: Visitor = null;
    let compiledComponents: CompileComponentSummary[];
    if (metadata.components) {
      compiledComponents = this.compileComponents(ListWrapper.flatten(metadata.components));
      visitor = new DomVisitor(compiledComponents);
      // compiled.forEach(c => {
      //   if (!c.visitor) {
      //     c.visitor = visitor;
      //   }
      // });
    }

    compileSummary = {
      type: component,
      selector: metadata.selector,
      hostListeners: metadata.host,
      childListeners: metadata.childs,
      componentFactory: createComponentFactory(metadata.selector, component),
      rendererType: DomRenderer,
      providers: metadata.providers,
      components: compiledComponents
    };
    this._compileResults.set(component, compileSummary);
    return compileSummary;
  }

  // private _compileView<C>(component: ClassType<C>, injector: Injector): ClassType<AppView<C>> {
  //   const compiler = this;
  //   return class extends View {
  //     private _ref: ComponentRef<C>;
  //     renderer: Renderer;
  //     clazz = component;

  //     createInternal(rootSelectorOrNode: string | Element): ComponentRef<C> {
  //       let rootRenderer = this.getInternal(RootRenderer) as RootRenderer;
  //       let element = rootSelectorOrNode as Element;
  //       if (typeof rootSelectorOrNode === 'string') {
  //         element = rootRenderer.selectRootElement(rootSelectorOrNode);
  //       }
  //       this.nativeElement = element;
  //       let renderer = rootRenderer.renderComponent(this);
  //       this.renderer = renderer;

  //       let provider = resolveReflectiveProviders([component])[0];
  //       if (!provider.resolvedFactories.length) {
  //         throw new Error(`Could not create component "${stringify(component)}". ` +
  //           `No factory found.`);
  //       }
  //       const resolved = provider.resolvedFactories[0];
  //       const deps = resolved.dependencies.map(d => this.getInternal(d.key.token));
  //       this.context = resolved.factory(...deps);
  //       const ref = this._ref = new ComponentRef(this, this.nativeElement);
  //       return ref;
  //     }

  //     protected parseInternal(): void {
  //       const visitor = compiler.get(this.clazz).visitor;
  //       if (visitor) {
  //         const traverser = new DomTraverser();
  //         traverser.traverse(this.nativeElement, visitor, this);
  //       }
  //     }

  //     protected getInternal(token: any, notFoundValue?: any): any {
  //       if (token === Injector) {
  //         return this;
  //       }
  //       if (token === ElementRef) {
  //         return new ElementRef(this.nativeElement);
  //       }
  //       if (token === Renderer) {
  //         return this.renderer;
  //       }
  //       let result = UNDEFINED;
  //       if (injector) {
  //         result = injector.get(token, UNDEFINED);
  //       }

  //       if (result === UNDEFINED && this._hostInjector) {
  //         result = this._hostInjector.get(token, this.parentView ? UNDEFINED : notFoundValue);
  //       }
  //       if (result === UNDEFINED && this.parentView) {
  //         result = this.parentView.get(token, notFoundValue);
  //       }
  //       return result;
  //     }
  //   };
  // }

}


export interface CompileComponentSummary {
  type: ClassType<any>;
  selector: string;
  hostListeners: {[key: string]: string};
  childListeners: {[key: string]: string};
  rendererType: ClassType<Renderer>;
  componentFactory: ComponentFactory<any>;
  providers: Provider[];
  components: CompileComponentSummary[];
}
