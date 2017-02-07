import { ClassType } from '../type';
import { BaseError, stringify } from '../facade';
import { ComponentRef } from './reference';
import { Injector } from '../di/injector';
import { resolveReflectiveProviders } from '../di/reflective_provider';
import { ElementRef } from '../element_ref';
import { AppView } from './view';

export class ComponentFactory<C> {
  constructor(private _viewClass: ClassType<AppView<C>>, private _componentType: ClassType<C>) { }

  get componentType(): ClassType<C> { return this._componentType; }

  /**
   * Creates a new component.
   *
   * @param {Injector} injector
   * @param {Element} nativeElement
   * @returns {ComponentRef<C>}
   *
   * @memberOf ComponentFactory
   */
  create(rootSelectorOrNode: string|any, injector: Injector): ComponentRef<C> {
    const view = new this._viewClass();
    return view.create(rootSelectorOrNode, injector);
  }
}

export class NoFactoryForComponentError extends BaseError {
  constructor(type: ClassType<any>) {
    super(`Could not create component "${stringify(type)}". No factory found.`);
  }
}
