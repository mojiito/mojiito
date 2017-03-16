import {
  ClassType, Component, ComponentResolver, Injectable, Renderer, ComponentRef,
  ComponentFactory, ComponentFactoryResolver, createComponentFactory, resolveReflectiveProviders,
  ElementRef, Injector, ApplicationRef, Provider, ReflectiveInjector, ReflectorReader,
  HostListener, ChildListener, createViewDefinitionFactory, SkipSelf,

  NodeFlags, NodeDef, ViewDefinitionFactory, DepFlags, constructDependencies, ProviderDef, DepDef
} from 'mojiito-core';
import { ListWrapper } from '../facade/collection';
import { stringify } from '../facade/lang';
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
    let visitor: Visitor;
    let compiledComponents: CompileComponentSummary[];
    if (metadata.components) {
      compiledComponents = this.compileComponents(ListWrapper.flatten(metadata.components));
      visitor = new DomVisitor(compiledComponents);
    }

    const viewDefFactory: ViewDefinitionFactory = () => {
      const nodes: NodeDef[] = [];
      let nodeFlags = NodeFlags.ComponentView;

      const providers = metadata.providers;
      let publicProviders: {[key: string]: NodeDef};
      if (providers) {
        publicProviders = {};
        this._createProviderNodes(providers, nodes, NodeFlags.TypeProvider).forEach(node => {
          publicProviders[node.provider.tokenKey] = node;
        });
        nodeFlags += NodeFlags.TypeProvider;
      }

      this._createProviderNodes([component], nodes, NodeFlags.TypeComponent);
      const componentProvider = nodes[nodes.length - 1];
      nodeFlags += NodeFlags.TypeComponent;

      const allProviders = publicProviders;
      allProviders[componentProvider.provider.tokenKey] = componentProvider;

      return {
        factory: viewDefFactory,
        nodeFlags,
        nodes,
        componentProvider,
        publicProviders,
        allProviders,
        componentRendererType: null // TODO
      };
    };

    compileSummary = {
      type: component,
      selector: metadata.selector,
      hostListeners: metadata.host,
      childListeners: metadata.childs,
      componentFactory: createComponentFactory(metadata.selector, component, viewDefFactory),
      rendererType: DomRenderer,
      viewDefinitionFactory: viewDefFactory,
      components: compiledComponents,
      visitor: visitor
    };
    this._compileResults.set(component, compileSummary);
    return compileSummary;
  }

  private _createProviderNodes(providers: Provider[], nodes: NodeDef[],
    nodeType: NodeFlags): NodeDef[] {
    const nodeDefs = resolveReflectiveProviders(ListWrapper.flatten(providers))
      .map((provider, index) => {
        const factory = provider.resolvedFactories[0];
        const node = <NodeDef>{
          flags: nodeType,
          index: nodes.length + index,
          provider: <ProviderDef>{
            token: provider.key.token,
            tokenKey: provider.key.displayName,
            factory: factory.factory,
            deps: factory.dependencies.map(dep => {
              let flags = 0;
              if (dep.optional) {
                flags += DepFlags.Optional;
              }
              if (dep.visibility instanceof SkipSelf) {
                flags += DepFlags.SkipSelf;
              }
              return <DepDef>{
                flags,
                token: dep.key.token,
                tokenKey: dep.key.displayName
              };
            })
          }
        };
        return node;
      });
    nodes.push(...nodeDefs);
    return nodeDefs;
  }
}
