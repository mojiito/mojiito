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
import { ExpressionTokenType } from '../expression_parser/tokenizer';

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

        assert(view instanceof View, `There is no view, directive or component found for this event ${attribute.name}="${attribute.value}"`);

        if (attrName.indexOf('on-') !== -1) {
            eventType = attrName.split('on-')[1];
        } else {
            eventType = attrName.match(/\w+(-\w+)*/)[0];
        }

        let isComponentEvent = context.getUnfiltered()[0].filter(value => value.context === view).length
            && view.hostElement.getView(-1) === view;

        let exprParser = new ExpressionParser(eventExpression);
        let executable = exprParser.parse((token) => {
            if (token.type === ExpressionTokenType.Function) {
                assert(typeof (isComponentEvent ? host.parent.component : host.component)[token.key] === 'function', `There is no method ${token.key} defined on your component or directive`);
                return isComponentEvent ? host.parent.component : host.component;
            } else if (token.type === ExpressionTokenType.Variable) {
                if (!isComponentEvent && view.getTemplateVar(token.key, false)) {
                    return view.templateVars;
                }
                if (!isComponentEvent && host.componentView.getTemplateVar(token.key, false)) {
                    return host.componentView.templateVars;
                }
                if (isComponentEvent && host.parent.componentView.getTemplateVar(token.key, false)) {
                    return host.parent.componentView.templateVars;
                }
                return isComponentEvent ? host.parent.component : host.component;
            }
            return null;
        });

        if (isComponentEvent) {
            ClassReflection.peek(view.hostElement.component.constructor).properties.forEach((value, key) => {
                if (value instanceof OutputMetadata && (<OutputMetadata>value).bindingPropertyName === eventType) {
                    let emitter: EventEmitter<any> = (<any>host.component)[key];
                    if (emitter instanceof EventEmitter) {
                        emitter.subscribe((args: any[]) => {
                            executable.execute();
                        });
                    }
                }
            })
        } else {      
            element.addEventListener(eventType, event => {
                executable.execute();
            });
        }
    }
}
