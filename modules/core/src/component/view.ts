import { Renderer } from '../render';
import { ComponentRef } from './reference';
import { Injector } from '../di/injector';
import { ClassType } from '../type';
import { ElementRef } from '../element_ref';

export abstract class AppView<C> implements Injector {
  public nestedViews: AppView<any>[] = [];
  public nativeElement: any;
  protected _hostInjector: Injector;
  abstract renderer: Renderer;
  abstract clazz: ClassType<C>;
  context: C;

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

  attachView(view: AppView<any>, viewIndex: number) {
    let nestedViews = this.nestedViews;
    if (!Array.isArray(nestedViews)) {
      nestedViews = [];
      this.nestedViews = nestedViews;
    }
    if (viewIndex >= nestedViews.length) {
      nestedViews.push(view);
    } else {
      nestedViews.splice(viewIndex, 0, view);
    }
  }

  protected abstract createInternal(rootSelectorOrNode: string | any): ComponentRef<any>;
  protected abstract parseInternal(): void;
  protected abstract getInternal(token: any, notFoundValue?: any): any;
}
