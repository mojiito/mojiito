import { Provider, ComponentFactory, ClassType } from 'mojiito-core';
import { Expression } from './expression/expression';
import { SelectorMatcher } from './selector';

export class ComponentCompileResult<C> {
  selector: string;
  type: ClassType<C>;
  componentFactory: ComponentFactory<C>;
  providers: Provider[];
  hostListeners: EventBindingCompileResult[];
  childListeners: Map<SelectorMatcher, EventBindingCompileResult[]>;

  constructor({
    selector,
    type,
    componentFactory,
    providers,
    hostListeners,
    childListeners
  }: {
    selector: string,
    type: ClassType<C>
    componentFactory: ComponentFactory<C>,
    providers?: Provider[],
    hostListeners?: EventBindingCompileResult[],
    childListeners?: Map<SelectorMatcher, EventBindingCompileResult[]>
  }) {
    this.selector = selector;
    this.type = type;
    this.componentFactory = componentFactory;
    this.providers = providers;
    this.hostListeners = hostListeners;
    this.childListeners = childListeners;
  }
}

export class BindingCompileResult {
  constructor(public expression: Expression) { }
}

export class EventBindingCompileResult extends BindingCompileResult {
  constructor(public eventName: string, expression: Expression) {
    super(expression);
  }
}
