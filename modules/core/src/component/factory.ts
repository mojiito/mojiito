import { ClassType } from '../type';
import { BaseError, stringify } from '../facade';
import { ComponentRef } from './reference';
import { Injector } from '../di/injector';
import { resolveReflectiveProviders } from '../di/reflective_provider';
import { ElementRef } from '../element_ref';

export class ComponentFactory<C> {

  private _componentType: ClassType<C>;

  constructor(componentType: ClassType<C>) {
    this._componentType = componentType;
  }

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
  create(injector: Injector, nativeElement: Element): ComponentRef<C> {
    const type = this._componentType;

    let provider = resolveReflectiveProviders([type])[0];
    if (!provider.resolvedFactories.length) {
      throw new NoFactoryForComponentError(type);
    }
    const resolved = provider.resolvedFactories[0];
    const element = new ElementRef(nativeElement);
    const deps = resolved.dependencies.map(d => {
      if (d.key.token === ElementRef) {
        return element;
      }
      return injector.get(d.key.token);
    });

    const component = resolved.factory(...deps);
    return new ComponentRef(component, element);
  }
}

export class NoFactoryForComponentError extends BaseError {
  constructor(type: ClassType<any>) {
    super(`Could not create component "${stringify(type)}". No factory found.`);
  }
}
