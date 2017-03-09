// tslint:disable:class-name
import { ClassType } from '../type';
import { ApplicationRef } from '../application/application';
import { Renderer } from '../render';
import { Injector } from '../di/injector';
import { ComponentRef } from '../component/reference';
import { ComponentFactory } from '../component/factory';
import { createRootView, destroyView } from './view';
import { ViewRef, InternalViewRef } from './view_ref';
import { ViewContainerRef } from './view_container_ref';
import { ElementRef } from './element_ref';
import { ViewData, ViewDefinitionFactory, ViewDefinition } from './types';
import { resolveViewDefinition } from './utils';

const EMPTY_CONTEXT = new Object();

/**
 * Internal View Injector
 */
class Injector_ implements Injector {
  constructor(private _view: ViewData) { }

  get(token: any, notFoundValue: any = Injector.THROW_IF_NOT_FOUND): any {
    const startView = this._view;

    if (token === Injector) {
      return this;
    }

    let view = startView;

    while (view) {
      switch (token) {
        case ViewContainerRef:
          return createViewContainerRef(view);
        case ElementRef:
          return new ElementRef(view.renderElement);
        case Renderer:
          return view.renderer;
        default:
          if (view.def.providers) {
            let result = view.def.injector.get(token, void 0);
            if (result) {
              return result;
            }
          }
      }
      view = view.parent;
    }
    return view.root.injector.get(token, notFoundValue);
  }
}

function createInjector(view: ViewData): Injector {
  return new Injector_(view);
}

/**
 * Internal ComponentRef
 */
class ComponentRef_ extends ComponentRef<any> {
  constructor(private _view: ViewData, private _viewRef: ViewRef, private _component: any) {
    super();
  }

  get location(): ElementRef { return new ElementRef(null); }
  get injector(): Injector { return createInjector(this._view); }
  get instance(): any { return this._component; };
  get hostView(): ViewRef { return this._viewRef; };
  // get changeDetectorRef(): ChangeDetectorRef { return this._viewRef; };
  get componentType(): ClassType<any> { return <any>this._component.constructor; }

  parse(): void { this._viewRef.parse(); }
  destroy(): void { this._viewRef.destroy(); }
  onDestroy(callback: Function): void { this._viewRef.onDestroy(callback); }
}

/**
 * Internal ViewContainerRef
 */
class ViewContainerRef_ implements ViewContainerRef {

  renderElement: any;
  embeddedViews: ViewData[];

  constructor(private _view: ViewData) {
    this.renderElement = _view.renderElement;
  }

  get anchorElement(): ElementRef { return new ElementRef(this.renderElement); }
  get injector(): Injector { return createInjector(this._view); }
  get parentInjector(): Injector {
    return null;
  }

  clear(): void { }

  get(index: number): ViewRef {
    const view = this.embeddedViews[index];
    if (view) {
      const ref = new ViewRef_(view);
      ref.attachToViewContainerRef(this);
      return ref;
    }
    return null;
  }

  get length(): number { return this.embeddedViews.length; }

  createEmbeddedView<C>(templateRef: any, context?: C, index?: number):
    any { } // EmbeddedViewRef<C> { }

  createComponent<C>(componentFactory: ComponentFactory<C>, index?: number, injector?: Injector,
    rootSelectorOrNode?: any): ComponentRef<C> {
    const contextInjector = injector || this.parentInjector;
    const componentRef = componentFactory.create(contextInjector, rootSelectorOrNode);

    return componentRef;
  }

  // insert(viewRef: ViewRef, index?: number): ViewRef { }

  // move(viewRef: ViewRef, currentIndex: number): ViewRef { }

  indexOf(viewRef: ViewRef): number {
    return this.embeddedViews.indexOf((<ViewRef_>viewRef)._view);
  }

  remove(index?: number): void {
    const view = detachEmbeddedView(this, index);
    if (view) {
      destroyView(view);
    }
  }

  detach(index?: number): ViewRef {
    const view = detachEmbeddedView(this, index);
    return view ? new ViewRef_(view) : null;
  }
}

function createViewContainerRef(view: ViewData): ViewContainerRef {
  return new ViewContainerRef_(view);
}


function detachEmbeddedView(container: ViewContainerRef_, viewIndex: number): ViewData {
  const embeddedViews = container.embeddedViews;
  if (viewIndex == null || viewIndex >= embeddedViews.length) {
    viewIndex = embeddedViews.length - 1;
  }
  if (viewIndex < 0) {
    return null;
  }
  const view = embeddedViews[viewIndex];
  embeddedViews.splice(viewIndex, 1);
  return view;
}

class ViewRef_ implements InternalViewRef {
  _view: ViewData;
  private _viewContainerRef: ViewContainerRef;
  private _appRef: ApplicationRef;

  constructor(_view: ViewData) {
    this._view = _view;
    this._viewContainerRef = null;
    this._appRef = null;
  }

  // get rootNodes(): any[] { return rootRenderNodes(this._view); }

  get context() { return this._view.context; }

  // get destroyed(): boolean { return (this._view.state & ViewState.Destroyed) !== 0; }
  get destroyed(): boolean { return false; }

  // markForCheck(): void { markParentViewsForCheck(this._view); }
  // detach(): void { this._view.state &= ~ViewState.ChecksEnabled; }
  // detectChanges(): void { Services.checkAndUpdateView(this._view); }
  // checkNoChanges(): void { Services.checkNoChangesView(this._view); }

  parse() {
    // TODO
  }

  // reattach(): void { this._view.state |= ViewState.ChecksEnabled; }
  onDestroy(callback: Function) {
    if (!this._view.disposables) {
      this._view.disposables = [];
    }
    this._view.disposables.push(<any>callback);
  }

  destroy() {
    if (this._appRef) {
      this._appRef.detachView(this);
    } else if (this._viewContainerRef) {
      this._viewContainerRef.detach(this._viewContainerRef.indexOf(this));
    }
    destroyView(this._view);
  }

  detachFromAppRef() {
    this._appRef = null;
  }

  attachToAppRef(appRef: ApplicationRef) {
    if (this._viewContainerRef) {
      throw new Error('This view is already attached to a ViewContainer!');
    }
    this._appRef = appRef;
  }

  attachToViewContainerRef(vcRef: ViewContainerRef) {
    if (this._appRef) {
      throw new Error('This view is already attached directly to the ApplicationRef!');
    }
    this._viewContainerRef = vcRef;
  }
}

/**
 * Internal ComponentFactory
 */
class ComponentFactory_ extends ComponentFactory<any> {
  constructor(public selector: string, public componentType: ClassType<any>,
    private _viewDefFactory: ViewDefinitionFactory) {
    super();
  }
  create(injector: Injector, rootSelectorOrNode?: string | any): ComponentRef<any> {
    const viewDef = resolveViewDefinition(this._viewDefFactory);
    const view = createRootView(viewDef, injector, rootSelectorOrNode, EMPTY_CONTEXT);
    return new ComponentRef_(view, new ViewRef_(view), null);
  }
}

export function createComponentFactory(selector: string, componentType: ClassType<any>,
  viewDefFactory: ViewDefinitionFactory): ComponentFactory<any> {
  return new ComponentFactory_(selector, componentType, viewDefFactory);
}

