import { isPresent } from '../../utils/utils';
import { Injector } from '../di/di';
import { ComponentFactory, ComponentRef } from '../directive/factory';
import { ElementRef } from './element-ref';
import { AppElement } from './element';
import { View, ViewRef } from './view';

export class ViewContainerRef {
  constructor(private _element: AppElement) {}

  get(index: number): ViewRef<any> { return this._element.nestedViews[index].ref; }
  get length(): number {
    var views = this._element.nestedViews;
    return isPresent(views) ? views.length : 0;
  }
  get element(): ElementRef { return this._element.elementRef; }
  get injector(): Injector { return this._element.injector; }
  get parentInjector(): Injector { return this._element.parentInjector; }


  createEmbeddedView<C>(templateRef: any, context: any = null, index: number = -1): ViewRef<C> { return null; }

  createComponent<C>(componentFactory: ComponentFactory<C>, index: number = -1, injector: Injector = null): ComponentRef<C> {
      const contextInjector = isPresent(injector) ? injector : this._element.parentInjector;
    //   var componentRef = componentFactory.create(contextInjector);
      return null;
  }

//   insert(viewRef: ViewRef, index: number = -1): ViewRef { return null; }
//   move(viewRef: ViewRef, currentIndex: number): ViewRef { return null; }
//   indexOf(viewRef: ViewRef): number { return 0; }
//   remove(index: number = -1): void { }
//   detach(index: number = -1): ViewRef { return null; }
//   clear() { }
}