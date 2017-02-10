import { ClassType } from '../type';
import { unimplemented } from '../facade';
import { ElementRef } from '../element_ref';
import { AppView } from './view';
import { Injector } from '../di/injector';

/**
 * Represents an instance of a Component created via a ComponentFactory.
 * `ComponentRef` provides access to the Component Instance as well other objects related to this
 * Component Instance and allows you to destroy the Component Instance via the destroy method.
 *
 * @export
 * @class ComponentRef
 * @template C
 */
export class ComponentRef<C> {

  constructor(private _view: AppView<C>, private _nativeElement: any) {
  }

  /** Location of the component instance */
  get location(): ElementRef { return new ElementRef(this._nativeElement); }

  /** The injector on which the component instance exists. */
  get injector(): Injector { return this._view.injector; }

  /** The instance of the Component. */
  get instance(): C { return this._view.context; }

  /** The component type. */
  get componentType(): ClassType<C> { return <any>this.instance.constructor; }

  get view(): AppView<C> { return this._view; }

  /** Allows you to trigger a parse on the DOM managed by this component. */
  parse() {
    this._view.parse();
  }

  /** Destroys the component instance and all of the data structures associated with it. */
  destroy(): void {
    throw unimplemented();
  }

  /** Allows to register a callback that will be called when the component is destroyed. */
  onDestroy(/*callback: Function*/): void {
    throw unimplemented();
  }
}

