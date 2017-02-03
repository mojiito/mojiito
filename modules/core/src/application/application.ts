import { ComponentFactoryResolver } from '../component/factory_resolver';
import { ComponentRef } from '../component/reference';
import { ComponentFactory } from '../component/factory';
import { ClassType } from '../type';
import {
  InvalidComponentTypeError,
  NoComponentsOrFactoriesProvidedError,
  NoMetadataFoundError,
  ComponentAlreadyFoundError,
  NotYetBootstrappedError
} from './application_errors';
import { ClassReflection } from '../reflection';
import { ComponentMetadata } from '../component/metadata';

/**
 * This is a reference of a Mojito Application.
 *
 * @export
 * @class ApplicationRef
 */
export class ApplicationRef {
  private _nativeElement: Element;
  private _componentFactoryResolver: ComponentFactoryResolver;
  private _componentTypes: ClassType<any>[];
  private _components = new Map<ClassType<any>, ComponentRef<any>[]>();

  constructor(nativeElement: Element) {
    this._nativeElement = nativeElement;
  }

  get nativeElement(): Element { return this._nativeElement; }
  get componentFactoryResolver(): ComponentFactoryResolver {
    return this._componentFactoryResolver;
  };

  /**
   * Will get you all the references of component that
   * are instantiated on this application.
   *
   * @readonly
   * @type {ComponentRef<any>[]}
   * @memberOf ApplicationRef
   */
  get components(): ComponentRef<any>[] {
    const refs = [];
    this._components.forEach(r => refs.push(r));
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

  bootstrap(componentsOrFactories: Array<ClassType<any> | ComponentFactory<any>>) {
    if (!Array.isArray(componentsOrFactories) || !componentsOrFactories.length) {
      throw new NoComponentsOrFactoriesProvidedError();
    }
    const factories: ComponentFactory<any>[] = [];
    const types: ClassType<any>[] = [];
    componentsOrFactories.forEach(c => {
      let factory: ComponentFactory<any>;
      let type: ClassType<any>;
      if (c instanceof ComponentFactory) {
        factory = c;
        type = factory.componentType;
      } else if (c instanceof Function) {
        factory = new ComponentFactory(c);
        type = c;
      } else {
        throw new InvalidComponentTypeError(c);
      }
      if (types.indexOf(type) === -1) {
        factories.push(factory);
        types.push(type);
      } else {
        throw new ComponentAlreadyFoundError(type);
      }
    });
    this._componentTypes = types;
    this._componentFactoryResolver = new ComponentFactoryResolver(factories);
    this.parse();
  }

  parse() {
    if (!this._componentFactoryResolver) {
      throw new NotYetBootstrappedError('parse');
    }
    this._componentTypes.forEach(type => {
      const reflection = ClassReflection.peek(type);
      const metadata = reflection.annotations.get(ComponentMetadata) as ComponentMetadata;
      if (!(metadata instanceof ComponentMetadata)) {
        throw new NoMetadataFoundError(type);
      }
      const foundElements = this._nativeElement.querySelectorAll(metadata.selector);
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
          const ref = factory.create(element);
          refs.push(ref);
        }
      }
    });
  }

}
