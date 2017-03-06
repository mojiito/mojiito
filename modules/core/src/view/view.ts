import { Renderer } from '../render';
import { ComponentRef } from '../component/reference';
import { Injector } from '../di/injector';
import { ClassType } from '../type';
import { ElementRef } from '../view/element_ref';
import { ViewContainerRef } from './view_container_ref';

export abstract class View {
  constructor(public parent: View, public context: any, public component: any, public root: any,
    public renderer: Renderer, public node: any, public disposables: Function[]) { }

  create(rootSelectorOrNode: string | any, injector: Injector) {
    this.createInternal(rootSelectorOrNode);
  }

  parse() {
    this.parseInternal();
  }

  get(token: any, notFoundValue?: any) {
    this.getInternal(token, notFoundValue);
  }

  destroy() {
    this.destroyInternal();
  }

  protected abstract createInternal(rootSelectorOrNode: string | any): ComponentRef<any>;
  protected abstract parseInternal(): void;
  protected abstract getInternal(token: any, notFoundValue?: any): any;
  protected abstract destroyInternal(): any;
}

function createView(root: any, renderer: Renderer, parent: View,
  type: ClassType<View>, node: any) {
  const view = new type(parent, null, null, root, renderer, node, undefined);
  return view;
}

function initView(view: View, component: any, context: any) {
  view.component = component;
  view.context = context;
}

export function destroyView(view: View) {
  // if (view.state & ViewState.Destroyed) {
  //   return;
  // }
  // execEmbeddedViewsAction(view, ViewAction.Destroy);
  // execComponentViewsAction(view, ViewAction.Destroy);
  // callLifecycleHooksChildrenFirst(view, NodeFlags.OnDestroy);
  if (view.disposables) {
    for (let i = 0; i < view.disposables.length; i++) {
      view.disposables[i]();
    }
  }
  // view.state |= ViewState.Destroyed;
}
