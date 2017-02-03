import { ClassType } from '../type';
import { unimplemented } from '../facade';
import { ElementRef } from '../element_ref';

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
  private _nativeElement: Element;
  private _componentType: ClassType<C>;
  private _instance: C;

  constructor(nativeElement: Element, componentType: ClassType<C>) {
    this._nativeElement = nativeElement;
    this._componentType = componentType;
    this._instance = new componentType(this.location);
  }

  /** Location of the component instance */
  get location(): ElementRef { return new ElementRef(this._nativeElement); }

  /** The instance of the Component. */
  get instance(): C { return this._instance; }

  /** The component type. */
  get componentType(): ClassType<C> { return this._componentType; }

  /** Allows you to trigger a parse on the DOM managed by this component. */
  parse() {
    throw unimplemented();
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

