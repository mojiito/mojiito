import { Injector } from '../di/injector';
import { Renderer } from '../render';
import { ViewData } from './types';
import { ViewContainerRef, createViewContainerRef } from './view_container_ref';
import { ElementRef } from './element_ref';

// tslint:disable-next-line:class-name
export class ViewInjector implements Injector {
  constructor(private view: ViewData) {}

  get(token: any, notFoundValue: any = Injector.THROW_IF_NOT_FOUND): any {
    const view = this.view;
    switch (token) {
      case ViewContainerRef:
        return createViewContainerRef(view);
      case ElementRef:
        return new ElementRef(view.node);
      case Renderer:
        return view.renderer;
      case Injector:
        return this;
      default:
        return null;
    }
  }
}

export function createViewInjector(view: ViewData): Injector {
  return new ViewInjector(view);
}
