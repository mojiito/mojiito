import { ApplicationRef } from '../application/application';

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
