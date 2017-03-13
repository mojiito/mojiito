import {
  ClassType, Component, ComponentResolver, Injectable, Renderer, ComponentRef,
  ComponentFactory, ComponentFactoryResolver, createComponentFactory, resolveReflectiveProviders,
  ElementRef, Injector, ApplicationRef, Provider, ReflectiveInjector, ReflectorReader,
  HostListener, ChildListener, createViewDefinitionFactory
} from 'mojiito-core';
import { ListWrapper } from '../facade/collection';
import { Visitor, DomVisitor } from '../dom_visitor';
import { DomRenderer } from '../dom_renderer';
import { DomTraverser } from '../dom_traverser';
import { BindingParser, EventBindingParseResult } from '../binding_parser';
import { CompileComponentSummary } from './compile_result';

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

    const viewDefFactory = createViewDefinitionFactory(metadata.providers, component);

    compileSummary = {
      type: component,
      selector: metadata.selector,
      hostListeners: metadata.host,
      childListeners: metadata.childs,
      componentFactory: createComponentFactory(metadata.selector, component, viewDefFactory),
      rendererType: DomRenderer,
      viewDefinitionFactory: viewDefFactory,
      components: compiledComponents
    };

    this._compileResults.set(component, compileSummary);
    return compileSummary;
  }
}
