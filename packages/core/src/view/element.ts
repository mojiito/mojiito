import { NodeFlags, NodeDef, ViewDefinitionFactory, BindingFlags, BindingDef } from './types';
import { splitNamespace, calcBindingFlags } from './util';
import { RendererType } from '../render';

export function elementDef(flags: NodeFlags, childCount: number, namespaceAndName: string,
    bindings?: [BindingFlags, string, string][],
    componentView?: ViewDefinitionFactory, componentRendererType?: RendererType | null): NodeDef {
  let ns: string = null !;
  let name: string = null !;
  if (namespaceAndName) {
    [ns, name] = splitNamespace(namespaceAndName);
  }
  bindings = bindings || [];
  const bindingDefs: BindingDef[] = new Array(bindings.length);
  for (let i = 0; i < bindings.length; i++) {
    // tslint:disable:no-shadowed-variable
    const [bindingFlags, namespaceAndName, suffix] = bindings[i];
    const [nx, name] = splitNamespace(namespaceAndName);
    bindingDefs[i] = {flags: bindingFlags, ns, name, nonMinifiedName: name, suffix};
    // tslint:enable:no-shadowed-variable
  }
  if (componentView) {
    flags |= NodeFlags.ComponentView;
  }
  flags |= NodeFlags.TypeElement;
  return {
    index: -1,
    parent: null,
    bindingIndex: -1,
    flags,
    childFlags: 0,
    directChildFlags: 0,
    childCount,
    bindings: bindingDefs,
    bindingFlags: calcBindingFlags(bindingDefs),
    element: {
      ns,
      name,
      componentProvider: null,
      componentView: componentView || null,
      componentRendererType: componentRendererType,
      publicProviders: null,
      allProviders: null,
    },
    provider: null,
  };
}
