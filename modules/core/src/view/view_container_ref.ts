import { ViewRef, ViewRef_ } from './view_ref';
import { destroyView } from './view';
import { ElementRef } from './element_ref';
import { ViewData } from './types';
import { Injector } from '../di/injector';
import { ComponentFactory } from '../component/factory';
import { ComponentRef } from '../component/reference';
import { createViewInjector } from './view_injector';

export abstract class ViewContainerRef {

  abstract get anchorElement(): ElementRef;
  abstract get injector(): Injector;
  abstract get parentInjector(): Injector;

  /** Destroys all Views in this container. */
  abstract clear(): void;

  /** Returns the ViewRef for the View located in this container at the specified index. */
  abstract get(index: number): ViewRef;

  /** Returns the number of Views currently attached to this container. */
  abstract get length(): number;

  /**
   * Instantiates an Embedded View based on the TemplateRef `templateRef`} and inserts it
   * into this container at the specified `index`.
   *
   * If `index` is not specified, the new View will be inserted as the last View in the container.
   *
   * Returns the ViewRef for the newly created View.
   */
  abstract createEmbeddedView<C>(templateRef: any, context?: C, index?: number):
    any; // EmbeddedViewRef<C>;

  /**
   * Instantiates a single Component and inserts its Host View into this container at the
   * specified `index`.
   *
   * The component is instantiated using its ComponentFactory which can be
   * obtained via ComponentFactoryResolver#resolveComponentFactory}.
   *
   * If `index` is not specified, the new View will be inserted as the last View in the container.
   *
   * You can optionally specify the Injector that will be used as parent for the Component.
   *
   * Returns the ComponentRef of the Host View created for the newly instantiated Component.
   */
  abstract createComponent<C>(
      componentFactory: ComponentFactory<C>, index?: number, injector?: Injector,
      projectableNodes?: any[][]): ComponentRef<C>;

  /**
   * Inserts a View identified by a ViewRef into the container at the specified `index`.
   *
   * If `index` is not specified, the new View will be inserted as the last View in the container.
   *
   * Returns the inserted ViewRef.
   */
  // abstract insert(viewRef: ViewRef, index?: number): ViewRef;

  /**
   * Moves a View identified by a ViewRef into the container at the specified `index`.
   *
   * Returns the inserted {@link ViewRef}.
   */
  // abstract move(viewRef: ViewRef, currentIndex: number): ViewRef;

  /**
   * Returns the index of the View, specified via ViewRef, within the current container or
   * `-1` if this container doesn't contain the View.
   */
  abstract indexOf(viewRef: ViewRef): number;

  /**
   * Destroys a View attached to this container at the specified `index`.
   *
   * If `index` is not specified, the last View in the container will be removed.
   */
  abstract remove(index?: number): void;

  /**
   * Use along with #nsert} to move a View within the current container.
   *
   * If the `index` param is omitted, the last ViewRef is detached.
   */
  abstract detach(index?: number): ViewRef;
}

// tslint:disable-next-line
class ViewContainerRef_ implements ViewContainerRef {

  renderElement: any;
  embeddedViews: ViewData[];

  constructor(private _view: ViewData) { }

  get anchorElement(): ElementRef { return new ElementRef(this.renderElement); }
  get injector(): Injector { return createViewInjector(this._view, null); }
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

// export function createViewContainerRef(view: ViewData, elDef: NodeDef): ViewContainerRef {
//   return new ViewContainerRef_(view, elDef);
// }


function detachEmbeddedView(container: ViewContainerRef_, viewIndex: number): View {
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
