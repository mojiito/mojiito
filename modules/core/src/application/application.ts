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
import { AppView } from '../component/view';
import { Injectable, Inject } from '../di/metadata';
import { Injector, THROW_IF_NOT_FOUND } from '../di/injector';
import {reflector} from '../reflection/reflection';
import { getPlatform } from './platform';

/**
 * This is a reference of a Mojito Application.
 *
 * @export
 * @class ApplicationRef
 */
@Injectable()
export class ApplicationRef {

  private _rootComponents: ComponentRef<any>[] = [];
  private _rootComponentTypes: ClassType<any>[] = [];
  private _views: AppView<any>[] = [];

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
    this._rootComponentTypes.push(componentFactory.componentType);
    const ref = componentFactory.create(metadata.selector, this.injector);
    this._views.push(ref.view);
    ref.parse();
    return ref;
  }

  _loadComponent(componentRef: ComponentRef<any>): void {
    this._rootComponents.push(componentRef);
  }

}
