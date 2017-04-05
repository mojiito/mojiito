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

const NS_PREFIX_RE = /^:([^:]+):(.+)$/;
export function splitNamespace(name: string): string[] {
  if (name[0] === ':') {
    const match = name.match(NS_PREFIX_RE) !;
    return [match[1], match[2]];
  }
  return ['', name];
}
