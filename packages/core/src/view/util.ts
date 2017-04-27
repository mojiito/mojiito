import { stringify } from '../facade/lang';
import {
  ViewDefinition, ViewDefinitionFactory, ViewData, BindingDef, BindingFlags,
  NodeDef, NodeFlags, asElementData
} from './types';

export const NOOP: any = () => {};

const _tokenKeyCache = new Map<any, string>();

export function tokenKey(token: any): string {
  let key = _tokenKeyCache.get(token);
  if (!key) {
    key = stringify(token) + '_' + _tokenKeyCache.size;
    _tokenKeyCache.set(token, key);
  }
  return key;
}

const VIEW_DEFINITION_CACHE = new WeakMap<any, ViewDefinition>();
export function resolveViewDefinition(factory: ViewDefinitionFactory): ViewDefinition {
  let value: ViewDefinition = VIEW_DEFINITION_CACHE.get(factory);
  if (!value) {
    value = factory();
    VIEW_DEFINITION_CACHE.set(factory, value);
  }
  return value;
}

const NS_PREFIX_RE = /^:([^:]+):(.+)$/;
export function splitNamespace(name: string): string[] {
  if (name[0] === ':') {
    const match = name.match(NS_PREFIX_RE)!;
    return [match[1], match[2]];
  }
  return ['', name];
}

export function calcBindingFlags(bindings: BindingDef[]): BindingFlags {
  let flags = 0;
  for (let i = 0; i < bindings.length; i++) {
    flags |= bindings[i].flags;
  }
  return flags;
}

export function viewParentEl(view: ViewData): NodeDef | null {
  const parentView = view.parent;
  if (parentView) {
    return view.parentNodeDef!.parent;
  } else {
    return null;
  }
}

export function isComponentView(view: ViewData): boolean {
  return !!view.parent && !!(view.parentNodeDef !.flags & NodeFlags.TypeComponent);
}

export function dispatchEvent(view: ViewData, nodeIndex: number,
    eventName: string, event: any): boolean {
  // const nodeDef = view.def.nodes[nodeIndex];
  // const startView =
  // nodeDef.flags & NodeFlags.ComponentView ? asElementData(view, nodeIndex).componentView : view;
  // markParentViewsForCheck(startView);
  return view.def.handleEvent(view, nodeIndex, eventName, event);
}

export function elementEventFullName(target: string | null, name: string): string {
  return target ? `${target}:${name}` : name;
}

export function getParentRenderElement(view: ViewData, renderHost: any, def: NodeDef): any {
  let renderParent = def.renderParent;
  if (renderParent) {
    if ((renderParent.flags & NodeFlags.TypeElement) === 0 ||
        (renderParent.flags & NodeFlags.ComponentView) === 0 ||
        (renderParent.element !.componentRendererType/* &&
         renderParent.element !.componentRendererType !.encapsulation ===
             ViewEncapsulation.Native*/)) {
      // only children of non components, or children of components with native encapsulation should
      // be attached.
      return asElementData(view, def.renderParent !.index).renderElement;
    }
  } else {
    return renderHost;
  }
}
