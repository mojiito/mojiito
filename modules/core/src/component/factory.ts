import { ClassType } from '../type';
import { BaseError } from '../facade/error';
import { stringify } from '../facade/lang';
import { ComponentRef } from './reference';
import { Injector } from '../di/injector';
import { resolveReflectiveProviders } from '../di/reflective_provider';
import { ElementRef } from '../view/element_ref';
import { createRootView } from '../view/view';

const EMPTY_CONTEXT = new Object();

export abstract class ComponentFactory<C> {
  abstract get selector(): string;
  abstract get componentType(): ClassType<any>;
  /**
   * Creates a new component.
   */
  abstract create(injector: Injector, rootSelectorOrNode?: string|any): ComponentRef<C>;
}

// tslint:disable-next-line:class-name
class ComponentFactory_ extends ComponentFactory<any> {
  constructor(public selector: string, public componentType: ClassType<any>) {
    super();
  }
  create(injector: Injector, rootSelectorOrNode?: string|any): ComponentRef<any> {
    const view = createRootView(injector, rootSelectorOrNode, EMPTY_CONTEXT);
    console.log(view);
    return null;
  }
}

export class NoFactoryForComponentError extends BaseError {
  constructor(type: ClassType<any>) {
    super(`Could not create component "${stringify(type)}". No factory found.`);
  }
}

export function createComponentFactory(selector: string,
  componentType: ClassType<any>): ComponentFactory<any> {
  return new ComponentFactory_(selector, componentType);
}
