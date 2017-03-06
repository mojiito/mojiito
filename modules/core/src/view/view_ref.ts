import { View, destroyView } from './view';
import { ViewContainerRef } from './view_container_ref';
import { ApplicationRef } from '../application/application';
import { unimplemented } from '../facade/error';

export abstract class ViewRef { // extends ChangeDetectorRef {

  /** Allows you to trigger a parse on the DOM managed by this view. */
  abstract parse(): void;

  /** Destroys the view and all of the data structures associated with it. */
  abstract destroy(): void;

  abstract get destroyed(): boolean;

  abstract onDestroy(callback: Function): any;

}

export interface InternalViewRef extends ViewRef {
  detachFromAppRef(): void;
  attachToAppRef(appRef: ApplicationRef): void;
}

// tslint:disable-next-line:class-name
export class ViewRef_ implements InternalViewRef {
  _view: View;
  private _viewContainerRef: ViewContainerRef;
  private _appRef: ApplicationRef;

  constructor(_view: View) {
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
