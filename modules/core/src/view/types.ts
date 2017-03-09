import { Renderer, RendererFactory } from '../render';
import { Injector } from '../di/injector';
import { Provider } from '../di/provider';

export interface ViewDefinition {
  providers: Provider[];
  injector: Injector;
}

export type ViewDefinitionFactory = () => ViewDefinition;

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
  component: any;
  context: any;
  state: ViewState;
  disposables: DisposableFn[];
}

// tslint:disable:no-bitwise
export const enum ViewState {
  FirstCheck = 1 << 0,
  ChecksEnabled = 1 << 1,
  Errored = 1 << 2,
  Destroyed = 1 << 3
}

export type DisposableFn = () => void;

export interface RootData {
  injector: Injector;
  selectorOrNode: any;
  renderer: Renderer;
  rendererFactory: RendererFactory;
}
