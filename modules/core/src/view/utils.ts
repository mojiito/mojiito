import { stringify } from '../facade/lang';
import { resolveReflectiveProviders, ReflectiveDependency } from '../di/reflective_provider';
import { ReflectiveKey } from '../di/reflective_key';
import { Provider } from '../di/provider';
import { Injector } from '../di/injector';
import { ViewDefinition, ViewDefinitionFactory, ViewData, ProviderData } from './types';
import { createInjector, createViewContainerRef } from './refs';
import { Renderer } from '../render';
import { ViewContainerRef } from './view_container_ref';
import { ElementRef } from './element_ref';

const VIEW_DEFINITION_CACHE = new WeakMap<any, ViewDefinition>();
export function resolveViewDefinition(factory: ViewDefinitionFactory): ViewDefinition {
  let value: ViewDefinition = VIEW_DEFINITION_CACHE.get(factory);
  if (!value) {
    value = factory();
    VIEW_DEFINITION_CACHE.set(factory, value);
  }
  return value;
}

const VIEW_INJECTOR_CACHE = new WeakMap<any, Injector>();
export function resolveInjector(view: ViewData): Injector {
  let value: Injector = VIEW_INJECTOR_CACHE.get(view);
  if (!value) {
    value = createInjector(view);
    VIEW_INJECTOR_CACHE.set(view, value);
  }
  return value;
}

// tslint:disable:variable-name
const _tokenKeyCache = new Map<any, string>();
const RendererTokenKey = tokenKey(Renderer);
const ElementRefTokenKey = tokenKey(ElementRef);
const ViewContainerRefTokenKey = tokenKey(ViewContainerRef);
// const ChangeDetectorRefTokenKey = tokenKey(ChangeDetectorRef);
const InjectorRefTokenKey = tokenKey(Injector);
// tslint:enable:variable-name

export function tokenKey(token: any): string {
  let key = _tokenKeyCache.get(token);
  if (!key) {
    key = stringifyToken(token); // + '_' + _tokenKeyCache.size;
    _tokenKeyCache.set(token, key);
  }
  return key;
}

function stringifyToken(token: any): string {
  if (token instanceof ReflectiveDependency) {
    return token.key.displayName;
  }
  if (token instanceof ReflectiveKey) {
    return token.displayName;
  }
  return stringify(token);
}

export function resolveDep(view: ViewData, token: any, allowPrivateServices: boolean,
    notFoundValue = Injector.THROW_IF_NOT_FOUND): any {
  const startView = view;
  const tKey = tokenKey(token);

  while (view) {
    let def = view.def;
    if (def) {
      switch (tKey) {
        case RendererTokenKey:
          return view.renderer;
        case ElementRefTokenKey:
          return new ElementRef(view.renderElement);
        case ViewContainerRefTokenKey:
          return createViewContainerRef(view);
        // case ChangeDetectorRefTokenKey: {
        //   let cdView = findCompView(view, elDef, allowPrivateServices);
        //   return createChangeDetectorRef(cdView);
        // }
        case InjectorRefTokenKey:
          return createInjector(view);
        default:
          const providerData =
            (allowPrivateServices ? def.allProviders : def.publicProviders)[tKey];
          if (providerData) {
            if (providerData.instance === void 0) {
              providerData.instance =
                _createProviderInstance(view, providerData, false);
            }
            return providerData.instance;
          }
      }
    }
    view = view.parent;
  }
  return startView.root.injector.get(token, notFoundValue);
}

function _createProviderInstance(view: ViewData, providerData: ProviderData,
    allowPrivateServices: boolean): any {
  let deps: any[] = [];
  if (providerData.dependencies) {
    deps = providerData.dependencies.map(d => resolveDep(view, d.key, allowPrivateServices));
  }
  return providerData.factory(...deps);
}
