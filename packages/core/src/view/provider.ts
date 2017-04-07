import { stringify } from '../facade/lang';
import { Renderer } from '../render';
import { Injector } from '../di/injector';
import { resolveReflectiveProviders, ReflectiveDependency } from '../di/reflective_provider';
import { ReflectiveKey } from '../di/reflective_key';
import { Provider } from '../di/provider';
import { ElementRef } from './element_ref';
import { ViewContainerRef } from './view_container_ref';
import { createViewContainerData, createInjector } from './refs';
import {
  ViewData, ProviderData, NodeDef, NodeFlags, DepDef, DepFlags,
  asProviderData, BindingDef, OutputDef, BindingFlags, OutputType
} from './types';
import { calcBindingFlags } from './util';

const NOT_CREATED = new Object();

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

export function resolveDep(view: ViewData, depDef: DepDef, allowPrivateServices: boolean,
  notFoundValue = Injector.THROW_IF_NOT_FOUND): any {

  if (depDef.flags & DepFlags.Value) {
    return depDef.token;
  }
  const startView = view;
  if (depDef.flags & DepFlags.Optional) {
    notFoundValue = null;
  }

  const tokenKey = depDef.tokenKey;

  if (depDef.flags & DepFlags.SkipSelf) {
    allowPrivateServices = false;
    view = view.parent;
  }

  // while (view) {
  //   let def = view.def;
  //   if (def) {
  //     switch (tokenKey) {
  //       case RendererTokenKey:
  //         return view.renderer;
  //       case ElementRefTokenKey:
  //         return new ElementRef(view.renderElement);
  //       case ViewContainerRefTokenKey:
  //         return view.viewContainer || view.viewContainerParent;
  //       // case ChangeDetectorRefTokenKey: {
  //       //   let cdView = findCompView(view, elDef, allowPrivateServices);
  //       //   return createChangeDetectorRef(cdView);
  //       // }
  //       case InjectorRefTokenKey:
  //         return createInjector(view);
  //       default:
  //         const providerDef =
  //           (allowPrivateServices ? def.allProviders : def.publicProviders)[tokenKey];
  //         if (providerDef) {
  //           const providerData = asProviderData(view, providerDef.index);
  //           if (providerData.instance === NOT_CREATED) {
  //             providerData.instance = _createProviderInstance(view, providerDef);
  //           }
  //           return providerData.instance;
  //         }
  //     }
  //   }
  //   view = view.parent;
  // }
  // return startView.root.injector.get(depDef.token, notFoundValue);
}


// function _createProviderInstance(view: ViewData, def: NodeDef): any {
//   // private services can see other private services

//   const allowPrivateServices = (def.flags & NodeFlags.PrivateProvider) > 0;
//   const providerDef = def.provider;
//   let deps: any[] = [];
//   if (providerDef.deps) {
//     deps = providerDef.deps.map(d => resolveDep(view, d, allowPrivateServices));
//   }
//   return providerDef.factory(...deps);
// }


// export function createProviderInstance(view: ViewData, def: NodeDef): any {
//   return def.flags & NodeFlags.LazyProvider ? NOT_CREATED : _createProviderInstance(view, def);
// }


// function callProviderLifecycles(view: ViewData, index: number, lifecycles: NodeFlags) {
//   const provider = asProviderData(view, index).instance;
//   if (provider === NOT_CREATED) {
//     return;
//   }
//   if (lifecycles & NodeFlags.OnDestroy) {
//     provider.onDestroy();
//   }
// }

export function componentDef(
    flags: NodeFlags, childCount: number, ctor: any, factory: (...deps: any[]) => any,
    deps: ([DepFlags, any] | any)[], props?: {[name: string]: [number, string]},
    outputs?: {[name: string]: string}): NodeDef {
  const bindings: BindingDef[] = [];
  if (props) {
    for (let prop in props) {
      const [bindingIndex, nonMinifiedName] = props[prop];
      bindings[bindingIndex] = {
        flags: BindingFlags.TypeProperty,
        name: prop, nonMinifiedName,
        ns: null,
        suffix: null
      };
    }
  }
  const outputDefs: OutputDef[] = [];
  if (outputs) {
    for (let propName in outputs) {
      outputDefs.push(
          {type: OutputType.DirectiveOutput, propName, target: null, eventName: outputs[propName]});
    }
  }
  flags |= NodeFlags.TypeComponent;
  return _def(flags, childCount, ctor, ctor, deps, bindings, outputDefs);
}

export function providerDef(flags: NodeFlags, token: any, factory: (...deps: any[]) => any,
    deps: ([DepFlags, any] | any)[]): NodeDef {
  return _def(flags, 0, token, factory, deps);
}

export function _def(
    flags: NodeFlags, childCount: number, token: any, factory: (...deps: any[]) => any,
    deps: ([DepFlags, any] | any)[], bindings?: BindingDef[], outputs?: OutputDef[]): NodeDef {
  if (!outputs) {
    outputs = [];
  }
  if (!bindings) {
    bindings = [];
  }

  // tslint:disable:no-shadowed-variable
  const depDefs: DepDef[] = deps.map(value => {
    let token: any;
    let flags: DepFlags;
    if (Array.isArray(value)) {
      [flags, token] = value;
    } else {
      flags = DepFlags.None;
      token = value;
    }
    return {flags, token, tokenKey: tokenKey(token)};
  });
  // tslint:enable:no-shadowed-variable

  return {
    // will bet set by the view definition
    index: -1,
    parent: null,
    bindingIndex: -1,
    outputIndex: -1,
    // regular values
    flags,
    childFlags: 0,
    directChildFlags: 0,
    childCount,
    bindings,
    bindingFlags: calcBindingFlags(bindings), outputs,
    element: null,
    provider: {token, tokenKey: tokenKey(token), factory, deps: depDefs},
  };
}
