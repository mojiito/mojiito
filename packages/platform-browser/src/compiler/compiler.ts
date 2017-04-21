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
import { NoAnnotationError, NoVisitorError } from './compiler_errors';

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

  compileComponents(
      components: ClassType<any>[], parent?: CompileComponentSummary): CompileComponentSummary[] {
    return components.map(c => this.compileComponent(c, parent));
  }

  compileComponent<C>(
      component: ClassType<C>, parent: CompileComponentSummary = null): CompileComponentSummary {
    let compileSummary = this._compileResults.get(component);
    if (compileSummary) {
      return compileSummary;
    }

    // grab component metadata
    const metadata = this._resolver.resolve(component);
    const selector = CssSelector.parse(metadata.selector);

    compileSummary = {
      type: component,
      selector: selector,
      hostListeners: metadata.host,
      childListeners: metadata.childs,
      componentFactory: null,
      viewDefinitionFactory: null,
      components: null,
      visitor: null,
      parent: parent
    };

    // compile child components
    let childComponents: CompileComponentSummary[];
    let visitor: Visitor = null;
    if (metadata.components) {
      childComponents =
        this.compileComponents(ListWrapper.flatten(metadata.components), compileSummary);
      visitor = new DomVisitor(childComponents);
      compileSummary.visitor = visitor;
    }

    // create a view definition factory for this component type
    const viewDefinitionFactory = this._createComponentViewDef(
      component, metadata.providers || [], selector[0].element || '*', visitor, parent);
    compileSummary.viewDefinitionFactory = viewDefinitionFactory;

    // create a component factory for this component type
    compileSummary.componentFactory =
      createComponentFactory(metadata.selector, component, viewDefinitionFactory);

    this._compileResults.set(component, compileSummary);
    return compileSummary;
  }

  private _createComponentViewDef(component: ClassType<any>, providers: Provider[],
      namespaceAndName: string, visitor: Visitor,
      parent?: CompileComponentSummary): ViewDefinitionFactory {
    const viewDefinitionFactory: ViewDefinitionFactory = () => {
      const elementChildCount =  (providers && providers.length || 0) + 1;

      let summary = parent;
      while (visitor === null && summary) {
        visitor = summary.visitor || null;
        summary = summary.parent || null;
      }
      if (visitor === null) {
        throw new NoVisitorError(component);
      }

      // create a renderer type with a visitor
      const rendererType: RendererType = {
        visitor,
        data: null
      };

      return viewDef(ViewFlags.None, [
        // Create element node
        elementDef(NodeFlags.TypeElement, elementChildCount, namespaceAndName, [], [],
          viewDefinitionFactory, rendererType),

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
