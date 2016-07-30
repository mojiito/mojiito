import { assert } from '../../../debug/debug';
import { stringify } from '../../../utils/string/stringify';
import { ClassType } from '../../../utils/class/class';
import { Injectable, Inject, forwardRef } from '../../../runtime/di/di';
import { ContextTree } from '../context';
import { ParserAttributeHook } from './hooks';
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

        assert(/\w+\(\w*(,\w+)*\)/.test(eventExpression), `The source "${attribute.value}" of the event "${attribute.name}" is not a valid expression!`);
        assert(view instanceof View, `There is no view, directive or component found for this event ${attribute.name}="${attribute.value}"`);

        let methodName = eventExpression.match(/\w+/)[0];
        let handler: ClassType<any>
        if (
            context.getUnfiltered()[0].filter(value => value.context === view).length
            && view.hostElement.getView(-1) === view
        ) {
            handler = host.parent && host.parent.component;
            assert(!!handler, `There is no parent component to call when the event "${attribute.name}" fires!`);
            assert(typeof handler[methodName] === 'function', `The parent component has no method "${attribute.value} for the "${attribute.name}" event`);
            
            // event is attached on a component
            ClassReflection.peek(view.hostElement.component.constructor).properties.forEach((value, key) => {
                if (value instanceof OutputMetadata && (<OutputMetadata>value).bindingPropertyName === eventType) {
                    let emitter: EventEmitter<any> = (<any>host.component)[key];
                    if (emitter instanceof EventEmitter) {
                        emitter.subscribe((...args: any[]) => {
                            handler[methodName].apply(handler, args);
                        });
                    }
                }
            })
        } else {
            handler = host.component;
            assert(!!handler, `There is no component to call when the event "${attribute.name}" fires!`);
            assert(typeof handler[methodName] === 'function', `The parent component has no method "${attribute.value} for the "${attribute.name}" event`);
            // normal event
            let emitter = new EventEmitter();

            emitter.subscribe((...args: any[]) => {
                handler[methodName].apply(handler, args);
            })
            // view.hostElement.component            

            element.addEventListener(eventType, event => {
                emitter.emit();
            });
        }
    }
}
