import { Renderer, RendererFactory, RendererType } from '../render';
import { Injector } from '../di/injector';
import { ViewContainerRef } from './view_container_ref';


// ==================================
// DEFS
// ==================================

export interface NodeDef {
  flags: NodeFlags;
  index: number;
  parent: NodeDef|null;
  childCount: number;
  childFlags: NodeFlags;
  directChildFlags: NodeFlags;
  element: ElementDef|null;
  provider: ProviderDef|null;
  bindingIndex: number;
  bindings: BindingDef[];
  bindingFlags: BindingFlags;
  outputIndex: number;
  outputs: OutputDef[];
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

export interface ViewDefinition {
  factory: ViewDefinitionFactory;
  flags: ViewFlags;
  nodes: NodeDef[];
  /** aggregated NodeFlags for all nodes **/
  nodeFlags: NodeFlags;
  rootNodeFlags: NodeFlags;
  bindingCount: number;
  outputCount: number;
}

export type ViewDefinitionFactory = () => ViewDefinition;

export const enum ViewFlags {
  None = 0,
  OnPush = 1 << 1,
}

export interface ElementDef {
  name: string|null;
  ns: string|null;
  componentProvider: NodeDef|null;
  componentRendererType: RendererType|null;
  componentView: ViewDefinitionFactory|null;
  publicProviders: {[tokenKey: string]: NodeDef}|null;
  allProviders: {[tokenKey: string]: NodeDef}|null;
}

export interface BindingDef {
  flags: BindingFlags;
  ns: string;
  name: string;
  nonMinifiedName: string;
  suffix: string;
}

export interface OutputDef {
  type: OutputType;
  target: 'window'|'document'|'body'|'component'|null;
  eventName: string;
  propName: string|null;
}

export const enum OutputType {ElementOutput, DirectiveOutput}

// ==================================
// DATA
// ==================================

// tslint:disable-next-line
export class NodeData { private __brand: any; }

export interface ViewData {
  def: ViewDefinition;
  root: RootData;
  renderer: Renderer;
  parentNodeDef: NodeDef|null;
  parent: ViewData;
  viewContainerParent: ViewData|null;
  component: any;
  context: any;
  nodes: {[key: number]: NodeData};
  state: ViewState;
  oldValues: any[];
  disposables: DisposableFn[]|null;
  // renderElement: any;
  // nodes: NodeData[];
  // viewContainerParent: ViewData;
  // viewContainer: ViewContainerData;
  // component: any;
  // context: any;
  // state: ViewState;
  // disposables: DisposableFn[];
  // bindingIndex: number;
  // bindings: BindingData[];
  // bindingFlags: BindingFlags;
}

export const enum ViewState {
  FirstCheck = 1 << 0,
  ChecksEnabled = 1 << 1,
  Errored = 1 << 2,
  Destroyed = 1 << 3
}

export interface ElementData {
  renderElement: any;
  componentView: ViewData;
  viewContainer: ViewContainerData|null;
  // template: TemplateData;
}

export function asElementData(view: ViewData, index: number): ElementData {
  return <any>view.nodes[index];
}

export interface ViewContainerData extends ViewContainerRef {
  _embeddedViews: ViewData[];
}

export type DisposableFn = () => void;

export interface RootData {
  injector: Injector;
  selectorOrNode: any;
  renderer: Renderer;
  rendererFactory: RendererFactory;
}

export interface ProviderData { instance: any; }

export function asProviderData(view: ViewData, index: number): ProviderData {
  return <any>view.nodes[index];
}

export const enum NodeFlags {
  None = 0,
  TypeElement = 1 << 0,
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
  OnDestroy = 1 << 16,
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
