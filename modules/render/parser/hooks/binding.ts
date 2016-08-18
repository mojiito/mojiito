import { assert } from '../../../debug/debug';
import { stringify, kebabToCamelCase, isDefined, isPrimitive, isObject, isFunction } from '../../../utils/utils';
import { Injectable, Inject, forwardRef } from '../../../core/di/di';
import { ContextTree } from '../context';
import { ParserAttributeHook } from './hooks';
import { View } from '../../../core/view/view';
import { ExpressionParser } from '../expression_parser/parser';


export class BindingParserHook extends ParserAttributeHook {

    removeAttributeNode = true;

    constructor() {
        super();
    }

    predicate(attribute: Attr): boolean {
        return /^(\[|(data-)?bind-)((class|attr|style)(\.|-))?(\w+(-\w+)*)\]?$/.test(attribute.name)
    }

    onParse(element: HTMLElement, attribute: Attr, context: ContextTree) {
        let view: View = context.getNearestContextOfType(View);
        let host = view.hostElement;

        let attrName = attribute.name;
        let bindingName = '';
        let bindingUnit = '';
        let bindingExpression = attribute.value;
        let parts: string[];

        let isComponentBinding = context.getUnfiltered()[0].filter(value => value.context === view).length
            && view.hostElement.componentView === view;

        let exprParser = new ExpressionParser(bindingExpression);
        let bindingKeys: string[] = [];
        let executable = exprParser.parse((token) => {
            if (isComponentBinding) {
                // Check for template var in parent component view
                if (host.parent.componentView.getTemplateVar(token, false)) {
                    return host.parent.componentView.templateVars;
                }
                return host.parent.component;
            } else {
                // Check for template var in view
                if (view !== host.componentView && view.getTemplateVar(token, false)) {
                    return view.templateVars;
                }

                // Check for template var in component view
                if (host.componentView.getTemplateVar(token, false)) {
                    return host.componentView.templateVars;
                }
                assert(token in host.component, `Binding "${attribute.name}" not valid!. The property or function "${token}" is not defined in the component "${stringify(host.component.constructor)}"!`);
                bindingKeys.push(token);
                return host.component;
            }
        });

        if (isComponentBinding) {
            // TODO
        } else {
            let bindingCallback: () => any;
            if (/^\[((class|attr|style)\.)?\w+(-\w+)*(\.(\w+|%))?\]$/.test(attrName)) {
                attrName = attrName.replace(/\[|\]/g, '');
                parts = attrName.split('.');
            } else if (/^((data-)?bind-)((class|attr|style)\.)?\w+(-\w+)*(\-(\w+|%))?$/.test(attrName)) {
                attrName = attrName.replace(/data-|bind-/g, '');
                parts = attrName.split('.');
            } else throw new SyntaxError(`Attribute "${attrName}" is not a valid binding syntax!`)

            if (parts.length === 1) {
                // [value]
                bindingName = parts[0];
                assert(bindingName in element, `Can not bind "${bindingName}" on an ${stringify(element)} because it is not a valid property!`);
                bindingCallback = () => {
                    let result = executable.execute();
                    assert(isPrimitive(result), `The expression ${bindingExpression} on binding ${attribute.name} results in an unvalid type. Only primitive value types are allowed for property bindings.`);
                    (<any>element)[bindingName] = result;
                };
            } else if (parts[0] === 'class' && parts.length == 2) {
                // [class.my-class]
                bindingName = parts[1];
                bindingCallback = () => {
                    if (!!executable.execute())
                        element.classList.add(bindingName);
                    else
                        element.classList.remove(bindingName);
                };
            } else if (parts[0] === 'attr' && parts.length == 2) {
                // [attr.aria-hidden]
                bindingName = parts[1];
                bindingCallback = () => {
                    let result = executable.execute();
                    assert(isPrimitive(result), `The expression ${bindingExpression} on binding ${attribute.name} results in an unvalid type. Only primitive value types are allowed for attribute bindings.`);
                    element.setAttribute(bindingName, '' + result);
                };
            } else if (parts[0] === 'style' && parts.length >= 2 && parts.length <= 3) {
                // [style.color] or [style.font-size.em]
                bindingName = kebabToCamelCase(parts[1]);
                bindingUnit = parts[2] || '';
                bindingCallback = () => {
                    let result = executable.execute();
                    assert(isPrimitive(result) || isObject(result), `The expression ${bindingExpression} on binding ${attribute.name} results in an unvalid type. Only primitive value types or objects are allowed for style bindings.`);
                    if (isObject(result)) {
                        
                    } else {
                        assert(bindingName in element.style, `Can not bind "${attribute.name}" on an ${stringify(element)} because ${parts[1]} it is not a valid style property!`);
                        (<any>element.style)[bindingName] = result + bindingUnit;
                    }
                };
            }

            bindingKeys.forEach(key => {
                if (isFunction(host.component[key])) {
                    
                } else {
                    view.addBinding(key, bindingCallback);
                }
            });
        }
    }
}
