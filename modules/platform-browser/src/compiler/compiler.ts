import {
  ClassType, Component, ComponentResolver, Injectable, Renderer, RendererType, ComponentRef,
  ComponentFactory, ComponentFactoryResolver, createComponentFactory, resolveReflectiveProviders,
  ElementRef, Injector, ApplicationRef, Provider, ReflectiveInjector, ReflectorReader,
  HostListener, ChildListener, createViewDefinitionFactory, SkipSelf, NodeFlags, NodeDef,
  ViewDefinitionFactory, ViewDefinition, DepFlags, constructDependencies, ProviderDef, DepDef,
  Visitor
} from 'mojiito-core';
import { ListWrapper } from '../facade/collection';
import { stringify } from '../facade/lang';
import { DomVisitor } from '../dom_visitor';
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
    let componentRendererType: RendererType;
    if (metadata.components) {
      compiledComponents = this.compileComponents(ListWrapper.flatten(metadata.components));
      visitor = new DomVisitor(compiledComponents);
      componentRendererType = {
        visitor,
        data: null
      };
    }

    const viewDefinitionFactory: ViewDefinitionFactory = () => {
      const nodes: NodeDef[] = [];
      let nodeFlags = NodeFlags.ComponentView;

      // Create public provider instances and add to nodes
      const providers = metadata.providers;
      let publicProviders: {[key: string]: NodeDef} = {};
      if (providers) {
        this._createProviderNodes(providers, nodes, NodeFlags.TypeProvider).forEach(node => {
          publicProviders[node.provider.tokenKey] = node;
        });
        nodeFlags += NodeFlags.TypeProvider;
      }

      // Create component instance and add to nodes
      this._createProviderNodes([component], nodes, NodeFlags.TypeComponent);
      const componentProvider = nodes[nodes.length - 1];
      nodeFlags += NodeFlags.TypeComponent;

      // Set allProviders to publicProviders plus private providers (componentProvider)
      const allProviders = publicProviders;
      allProviders[componentProvider.provider.tokenKey] = componentProvider;

      return <ViewDefinition>{
        factory: viewDefinitionFactory,
        nodeFlags,
        nodes,
        componentProvider,
        publicProviders,
        allProviders,
        componentRendererType
      };
    };

    compileSummary = {
      type: component,
      selector: metadata.selector,
      hostListeners: metadata.host,
      childListeners: metadata.childs,
      componentFactory: createComponentFactory(metadata.selector, component, viewDefinitionFactory),
      viewDefinitionFactory,
      components: compiledComponents
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
