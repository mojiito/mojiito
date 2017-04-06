import { Renderer, RendererFactory, RendererType } from '../render';
import { ComponentRef } from '../component/reference';
import { Injector } from '../di/injector';
import { Provider } from '../di/provider';
import { resolveReflectiveProviders } from '../di/reflective_provider';
import { ClassType } from '../type';
import { ViewContainerRef } from './view_container_ref';
import {
  ViewData, ViewState, RootData, ViewDefinition, NodeFlags, ProviderData,
  NodeData, BindingFlags, ViewFlags, NodeDef
} from './types';
import { tokenKey, createProviderInstance } from './provider';
import { createViewContainerData } from './refs';


export function viewDefNew(flags: ViewFlags, nodes: NodeDef[]): ViewDefinition {
  let viewBindingCount = 0;
  let viewNodeFlags = 0;
  let viewRootNodeFlags = 0;
  let currentParent: NodeDef|null = null;
  let currentElementHasPublicProviders = false;
  let currentElementHasPrivateProviders = false;

  for (let i = 0; i < nodes.length; i++) {

    while (currentParent && i > currentParent.index + currentParent.childCount) {
      const newParent: NodeDef|null = currentParent.parent;
      if (newParent) {
        newParent.childFlags |= currentParent.childFlags !;
      }
      currentParent = newParent;
    }

    const node = nodes[i];
    node.index = i;
    node.parent = currentParent;
    node.bindingIndex = viewBindingCount;

    if (node.element) {
      const elDef = node.element;
      elDef.publicProviders =
          currentParent ? currentParent.element !.publicProviders : Object.create(null);
      elDef.allProviders = elDef.publicProviders;
      // Note: We assume that all providers of an element are before any child element!
      currentElementHasPublicProviders = false;
      currentElementHasPrivateProviders = false;
    }

    validateNode(currentParent, node, nodes.length);
    viewNodeFlags |= node.flags;
    if (currentParent) {
      currentParent.childFlags |= node.flags;
      currentParent.directChildFlags |= node.flags;
    } else {
      viewRootNodeFlags |= node.flags;
    }
    viewBindingCount += node.bindings.length;

    if (node.flags & NodeFlags.CatProvider) {
      if (!currentElementHasPublicProviders) {
        currentElementHasPublicProviders = true;
        // Use prototypical inheritance to not get O(n^2) complexity...
        currentParent !.element !.publicProviders =
            Object.create(currentParent !.element !.publicProviders);
        currentParent !.element !.allProviders = currentParent !.element !.publicProviders;
      }
      const isPrivateService = (node.flags & NodeFlags.PrivateProvider) !== 0;
      const isComponent = (node.flags & NodeFlags.TypeComponent) !== 0;
      if (!isPrivateService || isComponent) {
        currentParent !.element !.publicProviders ![node.provider !.tokenKey] = node;
      } else {
        if (!currentElementHasPrivateProviders) {
          currentElementHasPrivateProviders = true;
          // Use protoyypical inheritance to not get O(n^2) complexity...
          currentParent !.element !.allProviders =
              Object.create(currentParent !.element !.publicProviders);
        }
        currentParent !.element !.allProviders ![node.provider !.tokenKey] = node;
      }
      if (isComponent) {
        currentParent !.element !.componentProvider = node;
      }
    }
    if (node.childCount) {
      currentParent = node;
    }
  }
  while (currentParent) {
    const newParent = currentParent.parent;
    if (newParent) {
      newParent.childFlags |= currentParent.childFlags;
    }
    currentParent = newParent;
  }
  return {
    // Will be filled later...
    factory: null,
    nodeFlags: viewNodeFlags,
    rootNodeFlags: viewRootNodeFlags,
    flags,
    nodes: nodes,
    bindingCount: viewBindingCount,

    componentRendererType: null,
    componentProvider: null,
    publicProviders: null,
    allProviders: null,
  };
}

function validateNode(parent: NodeDef | null, node: NodeDef, nodeCount: number) {
  if (node.flags & NodeFlags.CatProvider) {
    const parentFlags = parent ? parent.flags : 0;
    if ((parentFlags & NodeFlags.TypeElement) === 0) {
      throw new Error(`Illegal State: Provider/Directive nodes need to be children of ` +
      `elements or anchors, at index ${node.index}!`);
    }
  }
  if (node.childCount) {
    const parentEnd = parent ? parent.index + parent.childCount : nodeCount - 1;
    if (node.index <= parentEnd && node.index + node.childCount > parentEnd) {
      throw new Error(
        `Illegal State: childCount of node leads outside of parent, at index ${node.index}!`);
    }
  }
}

export function createRootView(def: ViewDefinition, injector: Injector,
  rootSelectorOrNode: string | any, context?: any): ViewData {
  const rendererFactory: RendererFactory = injector.get(RendererFactory);
  const root = createRootData(injector, rendererFactory, rootSelectorOrNode);
  const view = createView(root, null, root.element, def);
  view.renderer.parse(view);
  return view;
}

export function createView(root: RootData,
  parent: ViewData, renderElement: any, def: ViewDefinition): ViewData {
  const nodes: NodeData[] = new Array(def.nodes.length);
  const view: ViewData = {
    def,
    renderElement,
    root,
    renderer: createRenderer(renderElement, def, parent, root),
    nodes,
    parent,
    viewContainerParent: undefined,
    viewContainer: undefined,
    context: undefined,
    component: undefined,
    state: ViewState.FirstCheck | ViewState.ChecksEnabled,
    disposables: undefined,
    bindings: undefined,
    bindingFlags: 0,
    bindingIndex: 0
  };
  if (def.nodeFlags & NodeFlags.TypeComponent) {
    view.viewContainer = createViewContainerData(view);
  }
  createViewNodes(view);
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
  destroyViewNodes(view);
  view.renderer.destroy();
  view.state |= ViewState.Destroyed;
}

function createViewNodes(view: ViewData) {
  const def = view.def;
  const nodes = view.nodes;
  let nodeData: any;
  for (let i = 0; i < def.nodes.length; i++) {
    const nodeDef = def.nodes[i];
    switch (nodeDef.flags & NodeFlags.Types) {
      case NodeFlags.TypeProvider: {
        const instance = createProviderInstance(view, nodeDef);
        nodeData = <ProviderData>{ instance };
        break;
      }
      case NodeFlags.TypeComponent: {
        const instance = createProviderInstance(view, nodeDef);
        nodeData = <ProviderData>{ instance };

        initView(view, instance, instance);
        break;
      }
    }
    nodes[i] = nodeData;
  }
}

function destroyViewNodes(view: ViewData) {
  view.renderer.destroyNode(view.renderElement);
}

function createRootData(
  injector: Injector, rendererFactory: RendererFactory, rootSelectorOrNode: any): RootData {
  const renderer = rendererFactory.createRenderer(null, null);
  let element = rootSelectorOrNode;
  if (typeof rootSelectorOrNode === 'string') {
    element = renderer.selectRootElement(rootSelectorOrNode);
  }
  return {
    injector,
    selectorOrNode: rootSelectorOrNode,
    element,
    rendererFactory,
    renderer
  };
}

function viewDef(publicProviders: Provider[], componentProvider: any): ViewDefinition {
  var viewDef: any = {};
  // resolve public providers
  const publicProv: any = Object.create(null);
  if (publicProviders) {
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

function createRenderer(hostElement: any, viewDef: ViewDefinition,
      parentView: ViewData, root: RootData) {
    let rendererType: RendererType = viewDef.componentRendererType;
    let view = parentView;
    while (view && !rendererType) {
      rendererType = view.def.componentRendererType;
      view = view.parent;
    }

    if (!rendererType) {
      return root.renderer;
    } else {
      return root.rendererFactory.createRenderer(hostElement, rendererType);
    }
}
