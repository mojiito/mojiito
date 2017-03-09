import { stringify } from '../facade/lang';
import { resolveReflectiveProviders, ReflectiveDependency } from '../di/reflective_provider';
import { ReflectiveKey } from '../di/reflective_key';
import {  } from '../di/reflective_injector';
import { Provider } from '../di/provider';
import { Injector } from '../di/injector';
import { ViewDefinition, ViewDefinitionFactory, ViewData } from './types';
import { createInjector } from './refs';

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

export function asProvider(provider: Provider, view: ViewData, notFoundValue: any) {
  return resolveProvider([provider], view, notFoundValue)[0];
}

export function resolveProvider(provider: Provider[], view: ViewData, notFoundValue: any) {
  let resolved = resolveReflectiveProviders(provider);
  return resolved.map(r => {
    if (!r.resolvedFactories || !r.resolvedFactories.length) {
      throw new Error(`Could not create "${stringify(r)}". No factory found.`);
    }
    const resolvedFactory = r.resolvedFactories[0];
    const viewInjector = resolveInjector(view);
    const deps = resolveDeps(resolvedFactory.dependencies, viewInjector);

    resolvedFactory.dependencies.map(d => viewInjector.get(d.key.token, notFoundValue));
    return resolvedFactory.factory(...deps);
  });
}

function resolveDeps(tokens: any[], injector: Injector) {
  return tokens.map(t => injector.get(resolveToken(t)));
}

function resolveToken(token: any): any {
  if (token instanceof ReflectiveDependency) {
    return token.key.token;
  }
  if (token instanceof ReflectiveKey) {
    return token.token;
  }
  return token;
}
