import { assert } from '../../debug/debug';
import { DOMParser, IDOMParserElementHook } from '../dom_parser/dom_parser';
import { DirectiveMetadataReference, IDirectiveMetadata, ComponentMetadataReference, IComponentMetadata } from '../../runtime/directives/directives';
import { ClassFactory, getClassName } from '../../utils/class/class';
import { doesSelectorMatchElement } from '../utils/dom_utils/';
import { Inject } from '../../runtime/injectable/inject';
import { Injectable } from '../../runtime/injectable/injectable';
import { DirectiveFactory, ComponentFactory } from '../../runtime/factory/factory';

export interface IResolver {
    resolve<C>(klass: ClassFactory<C>, metadata: Object): DirectiveFactory<C>;
}

@Injectable()
export class DirectiveResolver implements IResolver {

    @Inject(DOMParser)
    private parser: DOMParser;

    resolve<C>(directiveClass: ClassFactory<C>, metaRef: DirectiveMetadataReference): DirectiveFactory<C> {

        let factory = new metaRef.factory(directiveClass, metaRef);

        this.parser.registerElementHook({
            predicate: (element: Element) => {
                return doesSelectorMatchElement(metaRef.selector, element);
            },
            onBeforeParse: (element, context) => {
                return factory.create(element);
            },
            onAfterParse: (element, context) => {
                if (!context.length) {
                    return;
                }
                let instance = <ClassFactory<C>>context[0];
                console.log(factory);
            },
        });
        return factory;
    }
}

@Injectable()
export class ComponentResolver extends DirectiveResolver {
    resolve<C>(klass: ClassFactory<C>, metaRef: ComponentMetadataReference): ComponentFactory<C> {
        return super.resolve(klass, metaRef);
    }
}