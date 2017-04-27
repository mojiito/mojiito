import {
  NodeFlags, NodeDef, ViewDefinitionFactory, BindingFlags, BindingDef,
  OutputDef, OutputType, ViewData, ElementData
} from './types';
import {
  splitNamespace, calcBindingFlags, dispatchEvent, elementEventFullName, getParentRenderElement
} from './util';
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
    renderParent: null,
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
      attrs: null,
      template: null,
      componentProvider: null,
      componentView: componentView || null,
      componentRendererType: componentRendererType,
      publicProviders: null,
      allProviders: null,
      handleEvent: null
    },
    provider: null,
  };
}

export function listenToElementOutputs(view: ViewData, compView: ViewData, def: NodeDef, el: any) {
  for (let i = 0; i < def.outputs.length; i++) {
    const output = def.outputs[i];
    const handleEventClosure = renderEventHandlerClosure(
        view, def.index, elementEventFullName(output.target, output.eventName));
    let listenTarget: 'window'|'document'|'body'|'component'|null = output.target;
    let listenerView = view;
    if (output.target === 'component') {
      listenTarget = null;
      listenerView = compView;
    }
    const disposable =
      <any>listenerView.renderer.listen(listenTarget || el, output.eventName, handleEventClosure);
    view.disposables ![def.outputIndex + i] = disposable;
  }
}

function renderEventHandlerClosure(view: ViewData, index: number, eventName: string) {
  return (event: any) => dispatchEvent(view, index, eventName, event);
}

export function createElement(view: ViewData, renderHost: any, def: NodeDef): ElementData {
  const elDef = def.element !;
  const rootSelectorOrNode = view.root.selectorOrNode;
  const renderer = view.renderer;
  let el: any;
  if (view.parent || !rootSelectorOrNode) {
    if (elDef.name) {
      el = renderer.createElement(elDef.name, elDef.ns);
    } else {
      el = renderer.createComment('');
    }
    const parentEl = getParentRenderElement(view, renderHost, def);
    if (parentEl) {
      renderer.appendChild(parentEl, el);
    }
  } else {
    el = renderer.selectRootElement(rootSelectorOrNode);
  }
  if (elDef.attrs) {
    for (let i = 0; i < elDef.attrs.length; i++) {
      const [ns, name, value] = elDef.attrs[i];
      renderer.setAttribute(el, name, value, ns);
    }
  }
  return el;
}
