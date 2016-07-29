import { assert } from '../../../debug/debug';
import { stringify } from '../../../utils/string/stringify';
import { Injectable, Inject, forwardRef } from '../../../runtime/di/di';
import { ContextTree } from '../context';
import { ParserElementHook, ParserAttributeHook } from './hooks';
import { View } from '../../../runtime/view/view';
import { ClassReflection } from '../../../runtime/reflect/reflection';
import { OutputMetadata } from '../../../runtime/component/metadata';
import { EventEmitter } from '../../../runtime/async/events';

export class EventParserHook extends ParserAttributeHook {

    removeAttributeNode = true;

    constructor() {
        super();
    }

    predicate(attribute: Attr): boolean {
        return !!attribute.name.match(/^\(\w+(-\w+)*\)|on-\w+(-\w+)*|data-on-\w+(-\w+)*$/);
    }

    onParse(element: Element, attribute: Attr, context: ContextTree) {
        let view: View = context.getNearestContextOfType(View);
        let host = view.hostElement;
        
        let attrName = attribute.name;
        let eventType: string;
        let eventExpression = attribute.value;
        if (attrName.indexOf('on-') !== -1) {
            eventType = attrName.split('on-')[1];
        } else {
            eventType = attrName.match(/\w+(-\w+)*/)[0];
        }
    

        assert(view instanceof View, ``); // TODO: Insert Error message
        if (
            context.getUnfiltered()[0].filter(value => value.context === view).length
            && view.hostElement.getView(-1) === view
        ) {
            let parent = host.parent && host.parent.component;
            assert(!!parent, ``);
            // event is attached on a component
            ClassReflection.peek(view.hostElement.component.constructor).properties.forEach((value, key) => {
                if (value instanceof OutputMetadata && (<OutputMetadata>value).bindingPropertyName === eventType) {
                    let emitter: EventEmitter<any> = (<any>host.component)[key];
                    if (emitter instanceof EventEmitter) {
                        emitter.subscribe((...args: any[]) => {
                        });
                    }
                }
            })
        } else {
            // normal event
            let emitter = new EventEmitter();


            // view.hostElement.component            

            element.addEventListener(eventType, event => {
                emitter.emit();
            });
        }
    }
}
