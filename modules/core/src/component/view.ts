import { Renderer } from '../render';
import { ComponentRef } from './reference';
import { Injector } from '../di/injector';
import { ClassType } from '../type';
import { ElementRef } from '../element_ref';

export abstract class AppView<C> implements Injector {
  abstract renderer: Renderer;
  abstract clazz: ClassType<C>;
  context: C;
  protected _hostInjector: Injector;

  constructor(public parentView: AppView<any>) { }

  get injector(): Injector { return this; }

  create(rootSelectorOrNode: string | any, injector: Injector): ComponentRef<any> {
    this._hostInjector = injector;
    if (rootSelectorOrNode) {
      return this.createInternal(rootSelectorOrNode);
    }
  }

  parse(): void {
    this.parseInternal();
  }

  get(token: any, notFoundValue?: any): any {
    return this.getInternal(token, notFoundValue);
  }

  protected abstract createInternal(rootSelectorOrNode: string | any): ComponentRef<any>;
  protected abstract parseInternal(): void;
  protected abstract getInternal(token: any, notFoundValue?: any): any;
}
