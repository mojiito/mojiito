import { Renderer, RendererFactory } from '../render';
import { ComponentRef } from '../component/reference';
import { Injector } from '../di/injector';
import { ClassType } from '../type';
import { ElementRef } from '../view/element_ref';
import { ViewContainerRef } from './view_container_ref';
import { ViewData, ViewState, RootData } from './types';

export function createRootView(injector: Injector, rootSelectorOrNode: string | any,
  context?: any): ViewData {
  const rendererFactory: RendererFactory = injector.get(RendererFactory);
  const root = createRootData(injector, rendererFactory, rootSelectorOrNode);
  let node = rootSelectorOrNode;
  if (typeof rootSelectorOrNode === 'string') {
    node = root.renderer.selectRootElement(rootSelectorOrNode);
  }
  const view = createView(root, root.renderer, null, node);
  initView(view, context, context);
  return view;
}

export function createView(root: RootData, renderer: Renderer,
  parent: ViewData, renderElement: any): ViewData {
  const view: ViewData = {
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

export function createClass(view: ViewData) {
  // let provider = resolveReflectiveProviders([component])[0];
}
