import { ComponentFactoryResolver } from '../component/factory_resolver';
import { ComponentRef } from '../component/reference';
import { ComponentFactory } from '../component/factory';
import { ClassType } from '../type';
import {
  InvalidComponentTypeError,
  NoMetadataFoundError,
  ComponentAlreadyFoundError,
  NotYetBootstrappedError,
  AlreadyBootstrappedError
} from './application_errors';
import { Component } from '../component/metadata';
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
export class ApplicationRef implements Injector {
  private _componentFactoryResolver: ComponentFactoryResolver;
  private _componentTypes: ClassType<any>[];
  private _components = new Map<ClassType<any>, ComponentRef<any>[]>();

  constructor(public parent: Injector) { }

  get componentFactoryResolver(): ComponentFactoryResolver {
    return this._componentFactoryResolver;
  };

  get injector(): Injector { return this; }

  /**
   * Will get you all the references of component that
   * are instantiated on this application.
   *
   * @readonly
   * @type {ComponentRef<any>[]}
   * @memberOf ApplicationRef
   */
  get components(): ComponentRef<any>[] {
    const refs: ComponentRef<any>[] = [];
    // this._components.forEach(r => refs.push(r));
    return refs;
  };

  /**
   * Will get you all the component type or classes this application
   * contains and can instantiate.
   *
   * @readonly
   * @type {ClassType<any>[]}
   * @memberOf ApplicationRef
   */
  get componentTypes(): ClassType<any>[] { return this._componentTypes; };

  bootstrap<C>(componentOrFactory: ClassType<C> | ComponentFactory<C>) {
    if (this._componentFactoryResolver) {
      throw new AlreadyBootstrappedError();
    }

    let componentFactory: ComponentFactory<C>;
    if (componentOrFactory instanceof ComponentFactory) {
      componentFactory = componentOrFactory;
    } else {
      componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentOrFactory);
    }

    // const factories: ComponentFactory<any>[] = [];
    // const types: ClassType<any>[] = [];
    // componentsOrFactories.forEach(c => {
    //   let factory: ComponentFactory<any>;
    //   let type: ClassType<any>;
    //   if (c instanceof ComponentFactory) {
    //     factory = c;
    //     type = factory.componentType;
    //   } else if (c instanceof Function) {
    //     factory = new ComponentFactory(c);
    //     type = c;
    //   } else {
    //     throw new InvalidComponentTypeError(c);
    //   }
    //   if (types.indexOf(type) === -1) {
    //     factories.push(factory);
    //     types.push(type);
    //   } else {
    //     throw new ComponentAlreadyFoundError(type);
    //   }
    // });
    // this._componentTypes = types;
    // this._componentFactoryResolver = new ComponentFactoryResolver(factories);
    // this.parse();
  }

  get(token: any, notFoundValue: any = THROW_IF_NOT_FOUND): any {
    if (token === Injector) {
      return this;
    }
    if (token === ComponentFactoryResolver) {
      return this._componentFactoryResolver;
    }

    let result = this._components.get(token);
    return result || this.parent.get(token, notFoundValue);
  }

  parse() {
    if (!this._componentFactoryResolver) {
      throw new NotYetBootstrappedError('parse');
    }

    this._componentTypes.forEach(type => {
      const annotations = reflector.annotations(type);
      let selector: string;
      annotations.forEach(a => {
        if (a.selector)
          selector = a.selector;
      });

      const foundElements = document.querySelectorAll(selector);
      if (foundElements && foundElements.length) {
        const factory = this._componentFactoryResolver.resolveComponentFactory(type);
        for (let i = 0, max = foundElements.length; i < max; i++) {
          const element = foundElements[i];
          let refs = this._components.get(type);
          if (!Array.isArray(refs)) {
            refs = [];
            this._components.set(type, refs);
          }

          // Check if this component is already created on this element
          // if so, the skip and continue with next element
          if (refs.length && refs.find(r => r.location.nativeElement === element)) {
            continue;
          }

          // create a new component on this element
          const ref = factory.create(this, element);
          // refs.push(ref);
        }
      }
    });
  }

}
