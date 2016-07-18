import { assert } from '../../debug/debug';
import { Injectable } from '../../runtime/di/di';
import { DOMParser } from '../dom_parser/dom_parser';
import { doesSelectorMatchElement } from '../../utils/dom/dom';
import { TypedMap } from '../../core/map/map';

@Injectable()
export class Parser {

    private _domParser = new DOMParser();
    private _factories = new TypedMap<string, Function[]>();

    resolveComponent(selector: string, factory: Function) {
        let factories = this._factories.get(selector);
        if (Array.isArray(factories)) {
            assert(!factories.indexOf(factory), `There is already a factory with the selector "${selector}" registered`);
            factories.push(factory);
        } else {
            this._factories.set(selector, [factory]);
        }

        this._domParser.registerElementHook({
            predicate: (element) => {
                return doesSelectorMatchElement(selector, element);
            },
            onParse: (element) => {
                console.log(element);
            }
        })
    }
}