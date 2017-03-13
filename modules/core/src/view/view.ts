import { Renderer, RendererFactory } from '../render';
import { ComponentRef } from '../component/reference';
import { Injector } from '../di/injector';
import { Provider } from '../di/provider';
import { resolveReflectiveProviders } from '../di/reflective_provider';
import { ClassType } from '../type';
import { ElementRef } from '../view/element_ref';
import { ViewContainerRef } from './view_container_ref';
import { ViewData, ViewState, RootData, ViewDefinition } from './types';
import { tokenKey } from './utils';

export function createRootView(def: ViewDefinition, injector: Injector,
  rootSelectorOrNode: string | any, context?: any): ViewData {
  const rendererFactory: RendererFactory = injector.get(RendererFactory);
  const root = createRootData(injector, rendererFactory, rootSelectorOrNode);
  let node = rootSelectorOrNode;
  if (typeof rootSelectorOrNode === 'string') {
    node = root.renderer.selectRootElement(rootSelectorOrNode);
  }
  const view = createView(root, root.renderer, null, node, def);
  initView(view, context, context);
  return view;
}

export function createView(root: RootData, renderer: Renderer,
  parent: ViewData, renderElement: any, def: ViewDefinition): ViewData {
  const view: ViewData = {
    def,
    renderElement,
    root,
    renderer,
    parent,
    viewContainerParent: undefined,
    context: undefined,
    component: undefined,
    // tslint:disable:no-bitwise
    state: ViewState.FirstCheck | ViewState.ChecksEnabled,
    disposables: undefined
  };
  return view;
}

export function initView(view: ViewData, component: any, context: any) {
  view.component = component;
  view.context = context;
}

export function destroyView(view: ViewData) {
  if (view.state & ViewState.Destroyed) {
    return;
  }
  // execEmbeddedViewsAction(view, ViewAction.Destroy);
  // execComponentViewsAction(view, ViewAction.Destroy);
  // callLifecycleHooksChildrenFirst(view, NodeFlags.OnDestroy);
  if (view.disposables) {
    for (let i = 0; i < view.disposables.length; i++) {
      view.disposables[i]();
    }
  }
  view.state |= ViewState.Destroyed;
}

function createRootData(
  injector: Injector, rendererFactory: RendererFactory, rootSelectorOrNode: any): RootData {
  const renderer = rendererFactory.createRenderer(null);
  return {
    injector,
    selectorOrNode: rootSelectorOrNode,
    rendererFactory,
    renderer
  };
}

function viewDef(publicProviders: Provider[], componentProvider: any): ViewDefinition {
  var viewDef: any = {};
  // resolve public providers
  const publicProv: any = Object.create(null);
  if (publicProviders)  {
    resolveReflectiveProviders(publicProviders).forEach(p => {
      const resolvedFactory = p.resolvedFactories[0];
      publicProv[tokenKey(p.key)] = {
        factory: resolvedFactory.factory,
        dependencies: resolvedFactory.dependencies,
        multi: p.multiProvider
      };
    });
  }
  viewDef.publicProviders = publicProv;

  // combine to all providers
  const allProviders = Object.create(publicProv);
  viewDef.allProviders = allProviders;

  // resolve component provider
  if (componentProvider) {
    const resolvedComp = resolveReflectiveProviders([componentProvider])[0];
    const resolvedCompFactory = resolvedComp.resolvedFactories[0];
    viewDef.componentProvider = {
      factory: resolvedCompFactory.factory,
      dependencies: resolvedCompFactory.dependencies,
      multi: false,
    };
    allProviders[tokenKey(resolvedComp.key)] = viewDef.componentProvider;
  }

  return viewDef;
}

export function createViewDefinitionFactory(publicProviders: Provider[], componentProvider: any) {
  return () => {
    return viewDef(publicProviders, componentProvider);
  };
}
