import { assert } from '../../../debug/debug';
import { stringify } from '../../../utils/string/stringify';
import { DOMParser } from '../dom_parser/dom_parser';
import { doesSelectorMatchElement } from '../../../utils/dom/dom';
import { ComponentRegistry } from '../../../runtime/component/registry';
import { ComponentReference } from '../../../runtime/component/reference';
import { ComponentResolver } from '../../../runtime/component/resolver';

export function componentHookFactory(domParser: DOMParser, resolver: ComponentResolver) {
    let selectors = ComponentRegistry.selectors;
    let index = -1;
    domParser.registerElementHook({
        predicate: (element) => {
            for (let i = 0, max = selectors.length; i < max; i++) {
                if (doesSelectorMatchElement(selectors[i], element)) {
                    index = i;
                    return true;
                }
            }
            return false;
        },
        onBeforeParse: (element, context) => {
            let componentType = ComponentRegistry.componentTypes[index];
            let factory = resolver.resolveComponent(componentType);
            let parentRef = _findNextCompRefFromContext(context);
            assert(parentRef instanceof ComponentReference, `We found the component "${stringify(componentType)}" on the following element ${element} but there is no parent component for it.\nPlease use the bootstrap function for setting up your project!`);
            let componentRef = factory.create(parentRef.injector, element);
            console.log(componentRef.hostElement);
            index = -1;
            return true;
        }
    })
}


export function _findNextCompRefFromContext(context: any): ComponentReference<any> {
    if (context instanceof ComponentReference) {
        return context;
    }
    if (Array.isArray(context)) {
        for (let i = 0, max = context.length; i < max; i++) {
            let cntxt = context[i];
            if (cntxt instanceof ComponentReference) {
                return cntxt;
            } else if (Array.isArray(cntxt)) {
                let result = _findNextCompRefFromContext(cntxt);
                if (result instanceof ComponentReference) {
                    return result;
                }
            }
        }
    }
    return null;
}