import { DOMParser, IDOMParserElementHook } from '../dom_parser/dom_parser';
import { DirectiveMetadata } from '../../runtime/directives/directive'
import { ClassFactory, getClassName } from '../../utils/class/class';
import { doesSelectorMatchElement } from '../utils/dom_utils/';
import { Inject } from '../../runtime/injectable/inject';
import { Injectable } from '../../runtime/injectable/injectable';

export interface Resolver {
    resolve(klass: ClassFactory<any>, metadata: Object): void;
}

@Injectable
export class DirectiveResolver implements Resolver {

    @Inject(DOMParser)
    private parser: DOMParser;

    resolve<C>(klass: ClassFactory<C>, metadata: DirectiveMetadata): void {
        this.parser.registerElementHook({
            predicate: (element: Element) => {
                return doesSelectorMatchElement(metadata.selector, element);
            },
            onBeforeParse: (element: Element) => {
                console.log(element);
                return null;
            }
        });
        console.log(this.parser);
    }
}