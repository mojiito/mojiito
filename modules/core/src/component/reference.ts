import { ClassType } from '../type';
import { unimplemented } from '../facade/error';
import { Injector } from '../di/injector';
import { ElementRef } from '../view/element_ref';
import { View } from '../view/view';
import { ViewRef } from '../view/view_ref';
import { createViewInjector } from '../view/view_injector';

/**
 * Represents an instance of a Component created via a ComponentFactory.
 * `ComponentRef` provides access to the Component Instance as well other objects related to this
 * Component Instance and allows you to destroy the Component Instance via the destroy method.
 *
 * @export
 * @class ComponentRef
 * @template C
 */
export abstract class ComponentRef<C> {

  /** Location of the component instance */
  abstract get location(): ElementRef;

  /** The injector on which the component instance exists. */
  abstract get injector(): Injector;

  /** The instance of the Component. */
  abstract get instance(): C;

  abstract get hostView(): ViewRef;

  // get changeDetectorRef(): ChangeDetectorRef;

  /** The component type. */
  abstract get componentType(): ClassType<C>;

  /** Allows you to trigger a parse on the DOM managed by this component. */
  abstract parse(): void;

  /** Destroys the component instance and all of the data structures associated with it. */
  abstract destroy(): void;

  /** Allows to register a callback that will be called when the component is destroyed. */
  abstract onDestroy(callback: Function): void;
}

// tslint:disable-next-line
class ComponentRef_ extends ComponentRef<any> {
  constructor(private _view: View, private _viewRef: ViewRef, private _component: any) {
    super();
  }

  get location(): ElementRef { return new ElementRef(null); }
  get injector(): Injector { return createViewInjector(this._view, null); }
  get instance(): any { return this._component; };
  get hostView(): ViewRef { return this._viewRef; };
  // get changeDetectorRef(): ChangeDetectorRef { return this._viewRef; };
  get componentType(): ClassType<any> { return <any>this._component.constructor; }

  parse(): void { this._viewRef.parse(); }
  destroy(): void { this._viewRef.destroy(); }
  onDestroy(callback: Function): void { this._viewRef.onDestroy(callback); }
}

