import {
  NodeFlags, NodeDef, ViewDefinitionFactory, BindingFlags, BindingDef,
  OutputDef, OutputType
} from './types';
import { splitNamespace, calcBindingFlags } from './util';
import { RendererType } from '../render';

export function elementDef(flags: NodeFlags, childCount: number, namespaceAndName: string,
  bindings?: [BindingFlags, string, string][], outputs?: ([string, string])[],
  componentView?: ViewDefinitionFactory, componentRendererType?: RendererType | null): NodeDef {
  let ns: string = null!;
  let name: string = null!;
  if (namespaceAndName) {
    [ns, name] = splitNamespace(namespaceAndName);
  }
  bindings = bindings || [];
  const bindingDefs: BindingDef[] = new Array(bindings.length);
  for (let i = 0; i < bindings.length; i++) {
    // tslint:disable:no-shadowed-variable
    const [bindingFlags, namespaceAndName, suffix] = bindings[i];
    const [ns, name] = splitNamespace(namespaceAndName);
    bindingDefs[i] = { flags: bindingFlags, ns, name, nonMinifiedName: name, suffix };
    // tslint:enable:no-shadowed-variable
  }
  outputs = outputs || [];
  const outputDefs: OutputDef[] = new Array(outputs.length);
  for (let i = 0; i < outputs.length; i++) {
    const [target, eventName] = outputs[i];
    outputDefs[i] = {
      type: OutputType.ElementOutput,
      target: <any>target, eventName,
      propName: null
    };
  }
  if (componentView) {
    flags |= NodeFlags.ComponentView;
  }
  flags |= NodeFlags.TypeElement;
  return {
    index: -1,
    parent: null,
    bindingIndex: -1,
    outputIndex: -1,
    flags,
    childFlags: 0,
    directChildFlags: 0,
    childCount,
    bindings: bindingDefs,
    bindingFlags: calcBindingFlags(bindingDefs),
    outputs: outputDefs,
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
