import { Renderer } from '../render';
import { Injector } from '../di/injector';
import { ElementRef } from './element_ref';
import { ViewContainerRef } from './view_container_ref';
import { createInjector } from './refs';
import {
  ViewData, NodeDef, NodeFlags, DepDef, DepFlags, asProviderData,
  BindingDef, OutputDef, BindingFlags, OutputType, asElementData,
} from './types';
import { calcBindingFlags, dispatchEvent, isComponentView, viewParentEl, tokenKey } from './util';

const NOT_CREATED = new Object();

// tslint:disable:variable-name
const RendererTokenKey = tokenKey(Renderer);
const ElementRefTokenKey = tokenKey(ElementRef);
const ViewContainerRefTokenKey = tokenKey(ViewContainerRef);
// const ChangeDetectorRefTokenKey = tokenKey(ChangeDetectorRef);
const InjectorRefTokenKey = tokenKey(Injector);
// tslint:enable:variable-name

export const NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = {};

export function resolveDep(view: ViewData, elDef: NodeDef, allowPrivateServices: boolean,
    depDef: DepDef, notFoundValue = Injector.THROW_IF_NOT_FOUND): any {
  if (depDef.flags & DepFlags.Value) {
    return depDef.token;
  }
  const startView = view;
  if (depDef.flags & DepFlags.Optional) {
    notFoundValue = null;
  }

  const tokenKey = depDef.tokenKey;

  if (elDef && (depDef.flags & DepFlags.SkipSelf)) {
    allowPrivateServices = false;
    elDef = elDef.parent !;
  }

  while (view) {
    if (elDef) {
      switch (tokenKey) {
        case RendererTokenKey: {
          const compView = findCompView(view, elDef, allowPrivateServices);
          return compView.renderer;
        }
        case ElementRefTokenKey:
          return new ElementRef(asElementData(view, elDef.index).renderElement);
        case ViewContainerRefTokenKey:
          return asElementData(view, elDef.index).viewContainer;
        // case TemplateRefTokenKey: {
        //   if (elDef.element !.template) {
        //     return asElementData(view, elDef.index).template;
        //   }
        //   break;
        // }
        // case ChangeDetectorRefTokenKey: {
        //   let cdView = findCompView(view, elDef, allowPrivateServices);
        //   return createChangeDetectorRef(cdView);
        // }
        case InjectorRefTokenKey:
          return createInjector(view, elDef);
        default:
          const providerDef =
              (allowPrivateServices ? elDef.element !.allProviders :
                                      elDef.element !.publicProviders) ![tokenKey];
          if (providerDef) {
            const providerData = asProviderData(view, providerDef.index);
            if (providerData.instance === NOT_CREATED) {
              providerData.instance = _createProviderInstance(view, providerDef);
            }
            return providerData.instance;
          }
      }
    }
    allowPrivateServices = isComponentView(view);
    elDef = viewParentEl(view) !;
    view = view.parent !;
  }

  const value = startView.root.injector.get(depDef.token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR);

  if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR ||
      notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
    // Return the value from the root element injector when
    // - it provides it
    //   (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
    // - the module injector should not be checked
    //   (notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
    return value;
  }
  return startView.root.injector.get(depDef.token, notFoundValue);
}


function _createProviderInstance(view: ViewData, def: NodeDef): any {
  // private services can see other private services
  const allowPrivateServices = (def.flags & NodeFlags.PrivateProvider) > 0;
  const providerDef = def.provider;
  let injectable: any;
  switch (def.flags & NodeFlags.Types) {
    case NodeFlags.TypeClassProvider:
      injectable = createClass(
          view, def.parent !, allowPrivateServices, providerDef !.value, providerDef !.deps);
      break;
    case NodeFlags.TypeFactoryProvider:
      injectable = callFactory(
          view, def.parent !, allowPrivateServices, providerDef !.value, providerDef !.deps);
      break;
    case NodeFlags.TypeUseExistingProvider:
      injectable = resolveDep(view, def.parent !, allowPrivateServices, providerDef !.deps[0]);
      break;
    case NodeFlags.TypeValueProvider:
      injectable = providerDef !.value;
      break;
  }
  return injectable;
}


export function createProviderInstance(view: ViewData, def: NodeDef): any {
  return def.flags & NodeFlags.LazyProvider ? NOT_CREATED : _createProviderInstance(view, def);
}

function createClass(view: ViewData, elDef: NodeDef, allowPrivateServices: boolean,
    ctor: any, deps: DepDef[]): any {
  const len = deps.length;
  let injectable: any;
  switch (len) {
    case 0:
      injectable = new ctor();
      break;
    case 1:
      injectable = new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]));
      break;
    case 2:
      injectable = new ctor(
          resolveDep(view, elDef, allowPrivateServices, deps[0]),
          resolveDep(view, elDef, allowPrivateServices, deps[1]));
      break;
    case 3:
      injectable = new ctor(
          resolveDep(view, elDef, allowPrivateServices, deps[0]),
          resolveDep(view, elDef, allowPrivateServices, deps[1]),
          resolveDep(view, elDef, allowPrivateServices, deps[2]));
      break;
    default:
      const depValues = new Array(len);
      for (let i = 0; i < len; i++) {
        depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
      }
      injectable = new ctor(...depValues);
  }
  return injectable;
}

function callFactory(view: ViewData, elDef: NodeDef, allowPrivateServices: boolean,
    factory: any, deps: DepDef[]): any {
  const len = deps.length;
  let injectable: any;
  switch (len) {
    case 0:
      injectable = factory();
      break;
    case 1:
      injectable = factory(resolveDep(view, elDef, allowPrivateServices, deps[0]));
      break;
    case 2:
      injectable = factory(
          resolveDep(view, elDef, allowPrivateServices, deps[0]),
          resolveDep(view, elDef, allowPrivateServices, deps[1]));
      break;
    case 3:
      injectable = factory(
          resolveDep(view, elDef, allowPrivateServices, deps[0]),
          resolveDep(view, elDef, allowPrivateServices, deps[1]),
          resolveDep(view, elDef, allowPrivateServices, deps[2]));
      break;
    default:
      const depValues = Array(len);
      for (let i = 0; i < len; i++) {
        depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
      }
      injectable = factory(...depValues);
  }
  return injectable;
}

export function callLifecycleHooksChildrenFirst(view: ViewData, lifecycles: NodeFlags) {
  if (!(view.def.nodeFlags & lifecycles)) {
    return;
  }
  const nodes = view.def.nodes;
  for (let i = 0; i < nodes.length; i++) {
    const nodeDef = nodes[i];
    let parent = nodeDef.parent;
    if (!parent && nodeDef.flags & lifecycles) {
      // matching root node (e.g. a pipe)
      callProviderLifecycles(view, i, nodeDef.flags & lifecycles);
    }
    if ((nodeDef.childFlags & lifecycles) === 0) {
      // no child matches one of the lifecycles
      i += nodeDef.childCount;
    }
    while (parent && (parent.flags & NodeFlags.TypeElement) &&
           i === parent.index + parent.childCount) {
      // last child of an element
      if (parent.directChildFlags & lifecycles) {
        callElementProvidersLifecycles(view, parent, lifecycles);
      }
      parent = parent.parent;
    }
  }
}

function callElementProvidersLifecycles(view: ViewData, elDef: NodeDef, lifecycles: NodeFlags) {
  for (let i = elDef.index + 1; i <= elDef.index + elDef.childCount; i++) {
    const nodeDef = view.def.nodes[i];
    if (nodeDef.flags & lifecycles) {
      callProviderLifecycles(view, i, nodeDef.flags & lifecycles);
    }
    // only visit direct children
    i += nodeDef.childCount;
  }
}

function callProviderLifecycles(view: ViewData, index: number, lifecycles: NodeFlags) {
  const provider = asProviderData(view, index).instance;
  if (provider === NOT_CREATED) {
    return;
  }
  if (lifecycles & NodeFlags.OnDestroy) {
    provider.mjOnDestroy();
  }
}

export function componentDef(
    flags: NodeFlags, childCount: number, ctor: any, deps: ([DepFlags, any] | any)[],
    props?: {[name: string]: [number, string]}, outputs?: {[name: string]: string}): NodeDef {
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

export function providerDef(flags: NodeFlags, token: any, ctor: any,
    deps: ([DepFlags, any] | any)[]): NodeDef {
  return _def(flags, 0, token, ctor, deps);
}

export function _def(
    flags: NodeFlags, childCount: number, token: any, ctor: any,
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
    renderParent: null,
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
    provider: {token, tokenKey: tokenKey(token), value: ctor, deps: depDefs},
  };
}

export function createComponentInstance(view: ViewData, def: NodeDef): any {
  // components can see other private services, other directives can't.
  const allowPrivateServices = true;
  const instance = createClass(
      view, def.parent !, allowPrivateServices, def.provider !.value, def.provider !.deps);
  if (def.outputs.length) {
    for (let i = 0; i < def.outputs.length; i++) {
      const output = def.outputs[i];
      const subscription = instance[output.propName !].subscribe(
          eventHandlerClosure(view, def.parent !.index, output.eventName));
      view.disposables ![def.outputIndex + i] = subscription.unsubscribe.bind(subscription);
    }
  }
  return instance;
}

function eventHandlerClosure(view: ViewData, index: number, eventName: string) {
  return (event: any) => dispatchEvent(view, index, eventName, event);
}

function findCompView(view: ViewData, elDef: NodeDef, allowPrivateServices: boolean) {
  let compView: ViewData;
  if (allowPrivateServices) {
    compView = asElementData(view, elDef.index).componentView;
  } else {
    compView = view;
    while (compView.parent && !isComponentView(compView)) {
      compView = compView.parent;
    }
  }
  return compView;
}
