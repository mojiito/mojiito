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
import { ExpressionParser } from '../expression_parser/parser';

export class EventParserHook extends ParserAttributeHook {

    removeAttributeNode = true;

    constructor() {
        super();
    }

    predicate(attribute: Attr): boolean {
        return !!attribute.name.match(/^\(\w+(-\w+)*\)|on-\w+(-\w+)*|data-on-\w+(-\w+)*$/);
    }

    onAfterParse(element: Element, attribute: Attr, context: ContextTree) {
        let view: View = context.getNearestContextOfType(View);
        let host = view.hostElement;
        
        let attrName = attribute.name;
        let eventType: string;
        let eventExpression = attribute.value;

        assert(view instanceof View, `There is no view, directive or component found for this event ${attribute.name}="${attribute.value}"`);

        if (attrName.indexOf('on-') !== -1) {
            eventType = attrName.split('on-')[1];
        } else {
            eventType = attrName.match(/\w+(-\w+)*/)[0];
        }

        eventType = eventType.toLowerCase();

        let isComponentEvent = context.getUnfiltered()[0].filter(value => value.context === view).length
            && view.hostElement.getView(-1) === view;
        
        let eventContextObject: {$event: any} = {
            $event: {}
        }

        let exprParser = new ExpressionParser(eventExpression);
        let executable = exprParser.parse((token) => {

            if (token === '$event') {
                return eventContextObject;
            }

            // Check for template var in view
            if (!isComponentEvent && view !== host.componentView && view.getTemplateVar(token, false)) {
                return view.templateVars;
            }
            
            // Check for template var in component view
            if (!isComponentEvent && host.componentView.getTemplateVar(token, false)) {
                return host.componentView.templateVars;
            }
            
            // Check for template var in parent component view
            if (isComponentEvent && host.parent.componentView.getTemplateVar(token, false)) {
                return host.parent.componentView.templateVars;
            }

            // Check for var or method in 
            return isComponentEvent ? host.parent.component : host.component;

        });
        if (isComponentEvent) {
            ClassReflection.peek(view.hostElement.component.constructor).properties.forEach((value, key) => {
                if (value instanceof OutputMetadata && (<OutputMetadata>value).bindingPropertyName.toLowerCase() === eventType) {
                    let emitter: EventEmitter<any> = (<any>host.component)[key];
                    if (emitter instanceof EventEmitter) {
                        emitter.subscribe((event: any) => {
                            if (event) {
                                eventContextObject.$event = event;
                            }
                            executable.execute();
                        });
                    }
                }
            })
        } else {      
            element.addEventListener(eventType, event => {
                if (event) {
                    eventContextObject.$event = event;
                }
                executable.execute();
            });
        }
    }
}
