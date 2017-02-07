import { Renderer } from '../render';
import { ComponentRef } from './reference';
import { Injector } from '../di/injector';
import { ClassType } from '../type';

export abstract class AppView<C> {
  abstract renderer: Renderer;
  abstract rootNode: any;
  abstract clazz: ClassType<C>;
  context: C;
  injector: Injector;

  create(rootSelectorOrNode: string|any, injector: Injector): ComponentRef<any> {
    this.injector = injector;
    if (rootSelectorOrNode) {
      return this.createInternal(rootSelectorOrNode);
    }
  }

  protected abstract createInternal(rootSelectorOrNode: string|any): ComponentRef<any>;
}
