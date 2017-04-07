import { ListWrapper } from '../facade/collection';
import {
  ClassType, ComponentResolver, Injectable, RendererType,
  ComponentFactory, ComponentFactoryResolver, createComponentFactory, resolveReflectiveProviders,
  Provider, SkipSelf, NodeFlags, ViewDefinitionFactory, DepFlags, Visitor, viewDef, providerDef,
  elementDef, componentDef, ViewFlags
} from 'mojiito-core';
import { CssSelector } from '../selector';
import { DomVisitor } from '../dom_visitor';
import { BindingParser } from '../binding_parser';
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

    // grab component metadata
    const metadata = this._resolver.resolve(component);
    const selector = CssSelector.parse(metadata.selector);

    // compile child components
    let childComponents: CompileComponentSummary[];
    let rendererType: RendererType;
    if (metadata.components) {
      childComponents = this.compileComponents(ListWrapper.flatten(metadata.components));

      // create a renderer type with a visitor for this component with all
      // sub components
      rendererType = this._createComponentRendererType(new DomVisitor(childComponents));
    }

    // create a view definition factory for this component type
    const viewDefinitionFactory = this._createComponentViewDef(
      component, metadata.providers, selector[0].element || '*', rendererType);

    // create a component factory for this component type
    const componentFactory =
      createComponentFactory(metadata.selector, component, viewDefinitionFactory);

    compileSummary = {
      type: component,
      selector: selector,
      hostListeners: metadata.host,
      childListeners: metadata.childs,
      componentFactory,
      viewDefinitionFactory,
      components: childComponents
    };
    this._compileResults.set(component, compileSummary);
    return compileSummary;
  }

  private _createComponentRendererType(visitor: Visitor): RendererType {
    return {
      visitor,
      data: null
    };
  }

  private _createComponentViewDef(component: ClassType<any>, providers: Provider[],
      namespaceAndName: string, componentRendererType: RendererType): ViewDefinitionFactory {
    const viewDefinitionFactory: ViewDefinitionFactory = () => {
      const { token, factory, deps } = this._transformProviders([component])[0];
      const elementChildCount =  providers.length + 1;
      return viewDef(ViewFlags.None, [
        // Create element node
        elementDef(NodeFlags.TypeElement, elementChildCount, '*', [], [],
          viewDefinitionFactory, componentRendererType),

        // Create component node
        componentDef(NodeFlags.TypeComponent, 0, token, factory, deps, null, null),

        // Create provider nodes
        ...this._transformProviders(providers).map(provider => {
          return providerDef(
            NodeFlags.TypeProvider, provider.token, provider.factory, provider.deps);
        })
      ]);
    };
    return viewDefinitionFactory;
  }

  private _transformProviders(providers: Provider[]) {
    return resolveReflectiveProviders(ListWrapper.flatten(providers)).map(provider => {
      const token = provider.key.token;
      const factoryObj = provider.resolvedFactories[0];
      const factory = factoryObj.factory as (...deps: any[]) => any;
      const deps: ([DepFlags, any] | any)[] = factoryObj.dependencies.map(dep => {
        let flags = DepFlags.None;
        if (dep.optional) {
          flags += DepFlags.Optional;
        }
        if (dep.visibility instanceof SkipSelf) {
          flags += DepFlags.SkipSelf;
        }
        return [flags, dep.key.token];
      });
      return { token, factory, deps };
    });
  }
}
