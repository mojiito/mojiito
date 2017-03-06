import { ListWrapper } from '../facade/collection';
import { ComponentFactoryResolver } from '../component/factory_resolver';
import { ComponentRef } from '../component/reference';
import { ComponentFactory } from '../component/factory';
import { ComponentResolver } from '../component/resolver';
import { ClassType } from '../type';
import {
  InvalidComponentTypeError,
  NoMetadataFoundError,
  ComponentAlreadyFoundError,
  NotYetBootstrappedError,
  AlreadyBootstrappedError
} from './application_errors';
import { Component } from '../component/metadata';
import { View } from '../view/view';
import { ViewRef, InternalViewRef } from '../view/view_ref';
import { Injectable, Inject } from '../di/metadata';
import { Injector, THROW_IF_NOT_FOUND } from '../di/injector';
import {reflector} from '../reflection/reflection';
import { getPlatform } from './platform';

/**
 * This is a reference of a Mojiito Application.
 *
 * @export
 * @class ApplicationRef
 */
@Injectable()
export class ApplicationRef {

  private _rootComponents: ComponentRef<any>[] = [];
  private _rootComponentTypes: ClassType<any>[] = [];
  private _views: InternalViewRef[] = [];

  constructor(public injector: Injector, private _resolver: ComponentResolver,
    private _componentFactoryResolver: ComponentFactoryResolver) { }


  bootstrap<C>(componentOrFactory: ClassType<C> | ComponentFactory<C>): ComponentRef<C> {
    let componentFactory: ComponentFactory<C>;
    if (componentOrFactory instanceof ComponentFactory) {
      componentFactory = componentOrFactory;
    } else {
      componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentOrFactory);
    }
    const metadata = this._resolver.resolve(componentFactory.componentType);
    const ref = componentFactory.create(this.injector, metadata.selector);
    this.attachView(ref.hostView);
    this._rootComponents.push(ref);
    this._rootComponentTypes.push(componentFactory.componentType);
    ref.parse();
    return ref;
  }

  attachView(viewRef: ViewRef): void {
    const view = (viewRef as InternalViewRef);
    this._views.push(view);
    view.attachToAppRef(this);
  }

  detachView(viewRef: ViewRef): void {
    const view = (viewRef as InternalViewRef);
    ListWrapper.remove(this._views, view);
    view.detachFromAppRef();
  }

}
