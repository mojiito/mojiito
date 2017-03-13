import { Renderer, RendererFactory } from '../render';
import { Injector } from '../di/injector';
import { Provider } from '../di/provider';

export interface ProviderData {
  factory: (...deps: any[]) => any;
  dependencies: any[];
  multi: boolean;
  instance: any;
}

export interface DepData {
  key: any;
  optional: boolean;
  visibility: any;
}

export interface ViewDefinition {
  allProviders: {[tokenKey: string]: ProviderData};
  componentProvider: ProviderData;
  publicProviders: {[tokenKey: string]: ProviderData};
}

export type ViewDefinitionFactory = () => ViewDefinition;

// tslint:disable-next-line:variable-name
export class NodeData { private __brand: any; }

/**
 * View instance data.
 */
export interface ViewData {
  def: ViewDefinition;
  renderElement: any;
  root: RootData;
  renderer: Renderer;
  // index of component provider / anchor.
  parent: ViewData;
  viewContainerParent: ViewData;
  componentView: ViewData;
  embeddedViews: ViewData[];
  component: any;
  context: any;
  state: ViewState;
  disposables: DisposableFn[];
}

export const enum ViewState {
  // tslint:disable:no-bitwise
  FirstCheck = 1 << 0,
  ChecksEnabled = 1 << 1,
  Errored = 1 << 2,
  Destroyed = 1 << 3
  // tslint:enable:no-bitwise
}

export type DisposableFn = () => void;

export interface RootData {
  injector: Injector;
  selectorOrNode: any;
  renderer: Renderer;
  rendererFactory: RendererFactory;
}
