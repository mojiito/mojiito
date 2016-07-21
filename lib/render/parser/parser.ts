import { assert } from '../../debug/debug';
import { Injectable, Inject } from '../../runtime/di/di';
import { DOMParser } from '../dom_parser/dom_parser';
import { doesSelectorMatchElement } from '../../utils/dom/dom';
import { ComponentRegistry } from '../../runtime/component/registry';
import { ComponentResolver } from '../../runtime/component/resolver';

@Injectable()
export class Parser {

    private _domParser = new DOMParser();

    constructor( @Inject(ComponentResolver) resolver: ComponentResolver) {
        // console.log(resolver);
        let selectors = ComponentRegistry.selectors;
        let index = -1;
        this._domParser.registerElementHook({
            predicate: (element) => {
                for (let i = 0, max = selectors.length; i < max; i++) {
                    if (doesSelectorMatchElement(selectors[i], element)) {
                        index = i;
                        return true;
                    }
                }
                return false;
            },
            onBeforeParse: (element) => {
                let componentType = ComponentRegistry.componentTypes[index];
                console.log(componentType);
                return true;
            }
        })
    }

    parse(root: Element) {
        this._domParser.parseTree(<HTMLElement>root);
    }
}