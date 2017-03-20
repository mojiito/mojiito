import { ClassType } from '../type';
import { Renderer, RendererFactory, RendererType } from '../render';
import { Injector } from '../di/injector';
import { Provider } from '../di/provider';

export interface NodeDef {
  flags: NodeFlags;
  index: number;
  provider: ProviderDef;
}

export interface ProviderDef {
  token: any;
  tokenKey: string;
  factory: (...deps: any[]) => any;
  deps: DepDef[];
}

export interface DepDef {
  flags: DepFlags;
  token: any;
  tokenKey: string;
}

export const enum DepFlags {
  None = 0,
  SkipSelf = 1 << 0,
  Optional = 1 << 1,
  Value = 2 << 2,
}

export interface ProviderData { instance: any; }

export function asProviderData(view: ViewData, index: number): ProviderData {
  return <any>view.nodes[index];
}

export interface ViewDefinition {
  factory: ViewDefinitionFactory;
  nodes: NodeDef[];
  /** aggregated NodeFlags for all nodes **/
  nodeFlags: NodeFlags;
  componentRendererType: RendererType;
  componentProvider: NodeDef;
  publicProviders: {[tokenKey: string]: NodeDef};
  allProviders: {[tokenKey: string]: NodeDef};
}

export type ViewDefinitionFactory = () => ViewDefinition;

export interface BindingDef {
  flags: BindingFlags;
  ns: string;
  name: string;
  nonMinifiedName: string;
  suffix: string;
}


// ==================================
// DATA
// ==================================

// tslint:disable-next-line:variable-name
export class NodeData { private __brand: any; }

export interface ViewData {
  def: ViewDefinition;
  renderElement: any;
  root: RootData;
  renderer: Renderer;
  nodes: NodeData[];
  parent: ViewData;
  viewContainerParent: ViewData;
  embeddedViews: ViewData[];
  component: any;
  context: any;
  state: ViewState;
  disposables: DisposableFn[];
  bindingIndex: number;
  bindings: BindingData[];
  bindingFlags: BindingFlags;
}

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
  element: any;
}


export const enum NodeFlags {
  None = 0,
  // TypeElement = 1 << 0,
  // TypeText = 1 << 1,
  // CatRenderNode = TypeElement | TypeText,
  // TypeNgContent = 1 << 2,
  // TypePipe = 1 << 3,
  // TypePureArray = 1 << 4,
  // TypePureObject = 1 << 5,
  // TypePurePipe = 1 << 6,
  // CatPureExpression = TypePureArray | TypePureObject | TypePurePipe,
  TypeProvider = 1 << 7,
  LazyProvider = 1 << 11,
  PrivateProvider = 1 << 12,
  // TypeDirective = 1 << 13,
  TypeComponent = 1 << 14,
  CatProvider = TypeProvider | TypeComponent,
  // OnInit = 1 << 15,
  // OnDestroy = 1 << 16,
  // DoCheck = 1 << 17,
  // OnChanges = 1 << 18,
  // AfterContentInit = 1 << 19,
  // AfterContentChecked = 1 << 20,
  // AfterViewInit = 1 << 21,
  // AfterViewChecked = 1 << 22,
  EmbeddedViews = 1 << 23,
  ComponentView = 1 << 24,
  // TypeContentQuery = 1 << 25,
  // TypeViewQuery = 1 << 26,
  // StaticQuery = 1 << 27,
  // DynamicQuery = 1 << 28,
  // CatQuery = TypeContentQuery | TypeViewQuery,

  // mutually exclusive values...
  // Types = CatRenderNode | TypeNgContent | TypePipe | CatPureExpression | CatProvider | CatQuery
  Types = CatProvider
}

export interface BindingData extends BindingDef {}

export const enum BindingFlags {
  TypeElementAttribute = 1 << 0,
  TypeElementClass = 1 << 1,
  TypeElementStyle = 1 << 2,
  TypeProperty = 1 << 3,
  // SyntheticProperty = 1 << 4,
  // SyntheticHostProperty = 1 << 5,
  // CatSyntheticProperty = SyntheticProperty | SyntheticHostProperty,

  // mutually exclusive values...
  Types = TypeElementAttribute | TypeElementClass | TypeElementStyle | TypeProperty
}
