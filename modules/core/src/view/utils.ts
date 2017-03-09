import { ViewDefinition, ViewDefinitionFactory } from './types';

const VIEW_DEFINITION_CACHE = new WeakMap<any, ViewDefinition>();

export function resolveViewDefinition(factory: ViewDefinitionFactory): ViewDefinition {
  let value: ViewDefinition = VIEW_DEFINITION_CACHE.get(factory);
  if (!value) {
    value = factory();
    VIEW_DEFINITION_CACHE.set(factory, value);
  }
  return value;
}
