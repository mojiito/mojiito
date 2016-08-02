import { assert } from '../../../debug/debug';
import { stringify } from '../../../utils/string/stringify';
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
        return !!attribute.name.match(/^\[\w+\]|bind-\w+|data-bind-\w+$/);
    }

    onParse(element: Element, attribute: Attr, context: ContextTree) {
        let view: View = context.getNearestContextOfType(View);
        let host = view.hostElement;

        let attrName = attribute.name;
        let bindingName = '';
        let bindingExpression = attribute.value;

        let isComponent = context.getUnfiltered()[0].filter(value => value.context === view).length
            && view.hostElement.componentView === view;

        if (attrName.indexOf('on-') !== -1) {
            bindingName = attrName.split('on-')[1];
        } else {
            bindingName = attrName.match(/\w+(-\w+)*/)[0];
        }

        let exprParser = new ExpressionParser(bindingExpression);
        let executable = exprParser.parse((token) => {

            // Check for template var in view
            if (!isComponent && view !== host.componentView && view.getTemplateVar(token, false)) {
                return view.templateVars;
            }

            // Check for template var in component view
            if (!isComponent && host.componentView.getTemplateVar(token, false)) {
                return host.componentView.templateVars;
            }

            // Check for template var in parent component view
            if (isComponent && host.parent.componentView.getTemplateVar(token, false)) {
                return host.parent.componentView.templateVars;
            }

            // Check for var or method in 
            return isComponent ? host.parent.component : host.component;

        });

        let bindingType = bindingName.split('.')[0];
        if (bindingType === 'attr') {

        } else if (bindingType === 'class') {

        } else {

        }

        console.log(bindingName);
    }
}
