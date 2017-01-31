import { ComponentFactoryResolver } from '../component/factory_resolver';
import { ComponentRef } from '../component/reference';
import { ComponentFactory } from '../component/factory';
import { ClassType } from '../utils/facade';
import {
  InvalidComponentTypeError,
  NoComponentsOrFactoriesProvidedError,
  NoMetadataFoundError,
  ComponentAlreadyFoundError,
  NotYetBootstrappedError
} from './application_errors';
import { ClassReflection } from '../reflection';
import { ComponentMetadata } from '../component/metadata';

export class ApplicationRef {
  private _nativeElement: Element;
  private _componentFactoryResolver: ComponentFactoryResolver;
  private _componentTypes: ClassType<any>[];
  private _components: ComponentRef<any>[] = [];

  constructor(nativeElement: Element) {
    this._nativeElement = nativeElement;
  }

  get nativeElement(): Element { return this._nativeElement; }
  get componentFactoryResolver(): ComponentFactoryResolver {
    return this._componentFactoryResolver;
  };
  get components(): ComponentRef<any>[] { return this._components; };
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
          const ref = factory.create(foundElements[i]);
          this._components.push(ref);
        }
      }
    });
  }
}
