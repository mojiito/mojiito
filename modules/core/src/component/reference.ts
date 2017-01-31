import { ClassType } from '../utils/facade';
import { NotImplementedError } from '../error';
import { ElementRef } from '../element_ref';

export class ComponentRef<C> {
  private _nativeElement: Element;
  private _componentType: ClassType<C>;
  private _instance: C;

  constructor(nativeElement: Element, componentType: ClassType<C>) {
    this._nativeElement = nativeElement;
    this._componentType = componentType;
    this._instance = new componentType(this.element);
  }

  get element(): ElementRef {
    return new ElementRef(this._nativeElement);
  }

  get instance(): C {
    return this._instance;
  }

  get componentType(): ClassType<C> {
    return this._componentType;
  }

  parse() {
    throw new NotImplementedError();
  }

  destroy(): void {
    throw new NotImplementedError();
  }

  onDestroy(/*callback: Function*/): void {
    throw new NotImplementedError();
  }
}

