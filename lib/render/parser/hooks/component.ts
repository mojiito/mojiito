import { assert } from '../../../debug/debug';
import { stringify } from '../../../utils/string/stringify';
import { Injectable, Inject, forwardRef } from '../../../runtime/di/di';
import { ContextTree } from '../context';
import { ParserElementHook, ParserAttributeHook } from './hooks';
import { doesSelectorMatchElement } from '../../../utils/dom/dom';
import { ComponentRegistry } from '../../../runtime/component/registry';
import { ComponentResolver } from '../../../runtime/component/resolver';
import { HostElement } from '../../../runtime/view/host';

export class ComponentParserHook extends ParserElementHook {

    private selectors = ComponentRegistry.selectors;
    private lastFoundSelectorIndex = -1;

    constructor(private resolver: ComponentResolver) {
        super();
    }

    predicate(element: Element): boolean {
        for (let i = 0, max = this.selectors.length; i < max; i++) {
            if (doesSelectorMatchElement(this.selectors[i], element)) {
                this.lastFoundSelectorIndex = i;
                return true;
            }
        }
        this.lastFoundSelectorIndex = -1;
        return false;
    }

    onBeforeParse(element: Element, context: ContextTree): Object | Function {
        let componentType = ComponentRegistry.componentTypes[this.lastFoundSelectorIndex];
        let factory = this.resolver.resolveComponent(componentType);
        let parentHost = context.getNearestContextOfType(HostElement);
        assert(parentHost instanceof HostElement, `The found component "${stringify(componentType)}" on the element ${element} has no parent host element.\nAre you using the bootstrap function for setting up your project?`);
        let componentRef = factory.create(parentHost.injector, element);
        this.lastFoundSelectorIndex = -1;
        return componentRef.hostElement;
    }
}

export function _findNextHostFromContext(context: any): HostElement {
    if (context instanceof HostElement) {
        return context;
    }
    if (Array.isArray(context)) {
        for (let i = 0, max = context.length; i < max; i++) {
            let cntxt = context[i];
            if (cntxt instanceof HostElement) {
                return cntxt;
            } else if (Array.isArray(cntxt)) {
                let result = _findNextHostFromContext(cntxt);
                if (result instanceof HostElement) {
                    return result;
                }
            }
        }
    }
    return null;
}