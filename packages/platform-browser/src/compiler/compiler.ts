import { ListWrapper } from '../facade/collection';
import {
  ClassType, ComponentResolver, Injectable, Inject, Optional, RendererType,
  ComponentFactory, ComponentFactoryResolver, createComponentFactory,
  Provider, SkipSelf, NodeFlags, ViewDefinitionFactory, DepFlags, Visitor, viewDef, providerDef,
  elementDef, componentDef, ViewFlags, reflector
} from 'mojiito-core';
import { CssSelector } from '../selector';
import { DomVisitor } from '../dom_visitor';
import { BindingParser } from '../binding_parser';
import { CompileComponentSummary } from './compile_result';
import { NoAnnotationError } from './compiler_errors';

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
      const elementChildCount =  providers.length + 1;
      return viewDef(ViewFlags.None, [
        // Create element node
        elementDef(NodeFlags.TypeElement, elementChildCount, '*', [], [],
          viewDefinitionFactory, componentRendererType),

        // Create provider nodes
        ...this._resolveProviders(providers),

        // Create component node
        componentDef(NodeFlags.TypeComponent, 0, component,
          this._resolveDependencies(component), null, null)
      ]);
    };
    return viewDefinitionFactory;
  }

  private _resolveProviders(providers: Provider[]): any[] {
    return ListWrapper.flatten(providers).map(provider => {
      let token: any;
      let value: any;
      let flags: NodeFlags;
      let deps: ([DepFlags, any] | any)[] = [];
      if (provider instanceof Function) {
        token = provider;
        value = provider;
        flags = NodeFlags.TypeClassProvider;
        deps = this._resolveDependencies(value);
      } else {
        token = provider.provide;
        if (provider.useClass) {
          value = provider.useClass;
          flags = NodeFlags.TypeClassProvider;
          deps = this._resolveDependencies(value);
        } else if (provider.useValue) {
          value = provider.useValue;
          flags = NodeFlags.TypeValueProvider;
        } else if (provider.useFactory) {
          value = provider.useFactory;
          flags = NodeFlags.TypeFactoryProvider;
          deps = provider.deps.map((dep: any) => [DepFlags.None, dep]);
        } else if (provider.useExisting) {
          flags = NodeFlags.TypeUseExistingProvider;
          deps = [provider.useExisting];
        }
      }
      return providerDef(flags, token, value, deps);
    });
  }

  private _resolveDependencies(typeOrFunc: any) {
    const deps = reflector.parameters(typeOrFunc);
    if (!deps) return [];
    if (deps.some(p => p == null)) {
      throw new NoAnnotationError(typeOrFunc, deps);
    }
    return deps.map((metadata: any) => {
      if (!Array.isArray(metadata)) {
        if (metadata instanceof Inject) {
          return [DepFlags.None, metadata.token];
        } else {
          return [DepFlags.None, metadata];
        }
      }
      let token: any = null;
      let flags: DepFlags = DepFlags.None;
      for (let i = 0; i < metadata.length; ++i) {
        const paramMetadata = metadata[i];
        if (paramMetadata instanceof Function) {
          token = paramMetadata;
        } else if (paramMetadata instanceof Inject) {
          token = paramMetadata.token;
        } else if (paramMetadata instanceof Optional) {
          flags |= DepFlags.Optional;
        } else if (paramMetadata instanceof SkipSelf) {
          flags |= DepFlags.SkipSelf;
        }
      }
      if (token != null) {
        return [flags, token];
      } else {
        throw new NoAnnotationError(typeOrFunc, deps);
      }
    });
  }
}
