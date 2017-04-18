import { RendererFactory, Renderer } from '../render';
import { Injector } from '../di/injector';
import {
  ViewData, ViewState, RootData, ViewDefinition, NodeFlags, NodeData,
  ViewFlags, NodeDef, asElementData, ElementData, ViewHandleEventFn,
  ProviderData
} from './types';
import { createViewContainerData } from './refs';
import {
  createComponentInstance, callLifecycleHooksChildrenFirst, createProviderInstance,
} from './provider';
import { isComponentView, resolveViewDefinition, NOOP } from './util';


export function viewDef(flags: ViewFlags, nodes: NodeDef[]): ViewDefinition {
  let viewBindingCount = 0;
  let viewDisposableCount = 0;
  let viewNodeFlags = 0;
  let viewRootNodeFlags = 0;
  let currentParent: NodeDef | null = null;
  let currentElementHasPublicProviders = false;
  let currentElementHasPrivateProviders = false;

  for (let i = 0; i < nodes.length; i++) {

    while (currentParent && i > currentParent.index + currentParent.childCount) {
      const newParent: NodeDef | null = currentParent.parent;
      if (newParent) {
        newParent.childFlags |= currentParent.childFlags!;
      }
      currentParent = newParent;
    }

    const node = nodes[i];
    node.index = i;
    node.parent = currentParent;
    node.bindingIndex = viewBindingCount;
    node.outputIndex = viewDisposableCount;

    if (node.element) {
      const elDef = node.element;
      elDef.publicProviders =
        currentParent ? currentParent.element!.publicProviders : Object.create(null);
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
    viewDisposableCount += node.outputs.length;

    if (node.flags & NodeFlags.CatProvider) {
      if (!currentElementHasPublicProviders) {
        currentElementHasPublicProviders = true;
        // Use prototypical inheritance to not get O(n^2) complexity...
        currentParent!.element!.publicProviders =
          Object.create(currentParent!.element!.publicProviders);
        currentParent!.element!.allProviders = currentParent!.element!.publicProviders;
      }
      const isPrivateService = (node.flags & NodeFlags.PrivateProvider) !== 0;
      const isComponent = (node.flags & NodeFlags.TypeComponent) !== 0;
      if (!isPrivateService || isComponent) {
        currentParent!.element!.publicProviders![node.provider!.tokenKey] = node;
      } else {
        if (!currentElementHasPrivateProviders) {
          currentElementHasPrivateProviders = true;
          // Use protoyypical inheritance to not get O(n^2) complexity...
          currentParent!.element!.allProviders =
            Object.create(currentParent!.element!.publicProviders);
        }
        currentParent!.element!.allProviders![node.provider!.tokenKey] = node;
      }
      if (isComponent) {
        currentParent!.element!.componentProvider = node;
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
  const handleEvent: ViewHandleEventFn = (view, nodeIndex, eventName, event) =>
    nodes[nodeIndex].element!.handleEvent!(view, eventName, event);
  return {
    // Will be filled later...
    factory: null,
    nodeFlags: viewNodeFlags,
    rootNodeFlags: viewRootNodeFlags,
    flags,
    nodes: nodes,
    handleEvent: handleEvent || NOOP,
    bindingCount: viewBindingCount,
    outputCount: viewDisposableCount
  };
}

function validateNode(parent: NodeDef | null, node: NodeDef, nodeCount: number) {
  if (node.flags & NodeFlags.CatProvider) {
    const parentFlags = parent ? parent.flags : 0;
    if ((parentFlags & NodeFlags.TypeElement) === 0) {
      throw new Error(`Illegal State: Provider/Component nodes need to be children of ` +
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

  let renderElement = rootSelectorOrNode;
  if (typeof rootSelectorOrNode === 'string') {
    renderElement = root.renderer.selectRootElement(rootSelectorOrNode);
  }
  const view = createView(root, root.renderer, null, null, def);
  createViewNodes(view, renderElement);
  const renderer = asElementData(view, 0).componentView.renderer;
  renderer.parse(view);
  return view;
}

export function createComponentView(parent: ViewData, def: ViewDefinition, renderElement: any) {
  const view = createView(parent.root, parent.renderer, parent, null, def);
  createViewNodes(view, renderElement);
  console.log(view);
}

function createView(root: RootData, renderer: Renderer, parent: ViewData | null,
    parentNodeDef: NodeDef | null, def: ViewDefinition): ViewData {
  const nodes: NodeData[] = new Array(def.nodes.length);
  const disposables = def.outputCount ? new Array(def.outputCount) : null;
  const view: ViewData = {
    def,
    parent,
    parentNodeDef,
    viewContainerParent: null,
    context: null,
    component: null,
    nodes,
    state: ViewState.FirstCheck | ViewState.ChecksEnabled,
    root,
    renderer,
    oldValues: new Array(def.bindingCount),
    disposables
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
  execEmbeddedViewsAction(view, ViewAction.Destroy);
  execComponentViewsAction(view, ViewAction.Destroy);
  callLifecycleHooksChildrenFirst(view, NodeFlags.OnDestroy);
  if (view.disposables) {
    for (let i = 0; i < view.disposables.length; i++) {
      view.disposables[i]();
    }
  }
  if (view.renderer.destroyNode) {
    destroyViewNodes(view);
  }
  view.renderer.destroy();
  view.state |= ViewState.Destroyed;
}

function createViewNodes(view: ViewData, renderElement?: any) {
  const def = view.def;
  const nodes = view.nodes;
  let el: any = renderElement || null;
  for (let i = 0; i < def.nodes.length; i++) {
    const nodeDef = def.nodes[i];
    let nodeData: any;
    switch (nodeDef.flags & NodeFlags.Types) {
      case NodeFlags.TypeElement:
        let componentView: ViewData = undefined!;
        if (nodeDef.flags & NodeFlags.ComponentView) {
          const compViewDef = resolveViewDefinition(nodeDef.element!.componentView!);
          const rendererType = nodeDef.element!.componentRendererType;
          let compRenderer: Renderer;
          if (!rendererType) {
            compRenderer = view.root.renderer;
          } else {
            compRenderer = view.root.rendererFactory.createRenderer(el, rendererType);
          }
          componentView = createView(view.root, compRenderer, view,
            nodeDef.element !.componentProvider, compViewDef);
        }
        // listenToElementOutputs(view, componentView, nodeDef, el);
        nodeData = <ElementData>{
          renderElement: el,
          componentView,
          viewContainer: createViewContainerData(view, nodeDef, nodeData),
          // template: nodeDef.element !.template ? createTemplateData(view, nodeDef) : undefined
        };
        break;
      case NodeFlags.TypeClassProvider:
      case NodeFlags.TypeFactoryProvider:
      case NodeFlags.TypeUseExistingProvider:
      case NodeFlags.TypeValueProvider: {
        const instance = createProviderInstance(view, nodeDef);
        nodeData = <ProviderData>{instance};
        break;
      }
      case NodeFlags.TypeComponent: {
        const instance = createComponentInstance(view, nodeDef);
        nodeData = <ProviderData>{instance};
        const compView = asElementData(view, nodeDef.parent !.index).componentView;
        initView(compView, instance, instance);
        break;
      }
    }
    nodes[i] = nodeData;
  }
  // TODO: Why? vvvvvv
  // execComponentViewsAction(view, ViewAction.CreateViewNodes);
}

function destroyViewNodes(view: ViewData) {
  const len = view.def.nodes.length;
  for (let i = 0; i < len; i++) {
    const def = view.def.nodes[i];
    if (def.flags & NodeFlags.TypeElement) {
      view.renderer.destroyNode !(asElementData(view, i).renderElement);
    // } else if (def.flags & NodeFlags.TypeText) {
    //   view.renderer.destroyNode !(asTextData(view, i).renderText);
    }
  }
}

function createRootData(
  injector: Injector, rendererFactory: RendererFactory, rootSelectorOrNode: any): RootData {
  const renderer = rendererFactory.createRenderer(null, null);

  return {
    injector,
    selectorOrNode: rootSelectorOrNode,
    // element,
    rendererFactory,
    renderer
  };
}

// function createRenderer(hostElement: any, viewDef: ViewDefinition,
//       parentView: ViewData, root: RootData) {
//     let rendererType: RendererType = viewDef.componentRendererType;
//     let view = parentView;
//     while (view && !rendererType) {
//       rendererType = view.def.componentRendererType;
//       view = view.parent;
//     }

//     if (!rendererType) {
//       return root.renderer;
//     } else {
//       return root.rendererFactory.createRenderer(hostElement, rendererType);
//     }
// }

enum ViewAction {
  CreateViewNodes,
  CheckNoChanges,
  CheckAndUpdate,
  Destroy
}

function execComponentViewsAction(view: ViewData, action: ViewAction) {
  const def = view.def;
  if (!(def.nodeFlags & NodeFlags.ComponentView)) {
    return;
  }
  for (let i = 0; i < def.nodes.length; i++) {
    const nodeDef = def.nodes[i];
    if (nodeDef.flags & NodeFlags.ComponentView) {
      // a leaf
      callViewAction(asElementData(view, i).componentView, action);
    } else if ((nodeDef.childFlags & NodeFlags.ComponentView) === 0) {
      // a parent with leafs
      // no child is a component,
      // then skip the children
      i += nodeDef.childCount;
    }
  }
}

function execEmbeddedViewsAction(view: ViewData, action: ViewAction) {
  const def = view.def;
  if (!(def.nodeFlags & NodeFlags.EmbeddedViews)) {
    return;
  }
  for (let i = 0; i < def.nodes.length; i++) {
    const nodeDef = def.nodes[i];
    if (nodeDef.flags & NodeFlags.EmbeddedViews) {
      // a leaf
      const embeddedViews = asElementData(view, i).viewContainer!._embeddedViews;
      for (let k = 0; k < embeddedViews.length; k++) {
        callViewAction(embeddedViews[k], action);
      }
    } else if ((nodeDef.childFlags & NodeFlags.EmbeddedViews) === 0) {
      // a parent with leafs
      // no child is a component,
      // then skip the children
      i += nodeDef.childCount;
    }
  }
}

function callViewAction(view: ViewData, action: ViewAction) {
  const viewState = view.state;
  switch (action) {
    case ViewAction.CheckNoChanges:
      if ((viewState & ViewState.ChecksEnabled) &&
        (viewState & (ViewState.Errored | ViewState.Destroyed)) === 0) {
        // checkNoChangesView(view);
      }
      break;
    case ViewAction.CheckAndUpdate:
      if ((viewState & ViewState.ChecksEnabled) &&
        (viewState & (ViewState.Errored | ViewState.Destroyed)) === 0) {
        // checkAndUpdateView(view);
      }
      break;
    case ViewAction.Destroy:
      destroyView(view);
      break;
    case ViewAction.CreateViewNodes:
      createViewNodes(view);
      break;
  }
}
