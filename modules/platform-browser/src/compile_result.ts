import { Provider, ComponentFactory, ClassType } from 'mojiito-core';

export class ComponentCompileResult<C> {
  componentFactory: ComponentFactory<C>;
  hostListeners: {[key: string]: string};
  providers: Provider[];
  selector: string;
  type: ClassType<C>;

  constructor({
    componentFactory,
    hostListeners,
    providers,
    selector,
    type
  }: {
    componentFactory: ComponentFactory<C>,
    hostListeners?: {[key: string]: string},
    providers?: Provider[],
    selector: string,
    type: ClassType<C>
  }) {
    this.componentFactory = componentFactory;
    this.hostListeners = hostListeners;
    this.providers = providers;
    this.selector = selector;
    this.type = type;
  }
}
