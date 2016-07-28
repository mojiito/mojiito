import { assert } from '../../../debug/debug';
import { stringify } from '../../../utils/string/stringify';
import { Injectable, Inject, forwardRef } from '../../../runtime/di/di';
import { ContextTree } from '../context';
import { ParserElementHook, ParserAttributeHook } from './hooks';
import { View } from '../../../runtime/view/view';

export class EventParserHook extends ParserAttributeHook {

    removeAttributeNode = true;

    constructor() {
        super();
    }

    predicate(attribute: Attr): boolean {
        return !!attribute.name.match(/^\(\w+\)|on-\w+|data-on-\w+$/);
    }

    onParse(element: Element, attribute: Attr, context: ContextTree) {
        let view:View = context.getNearestContextOfType(View);

        assert(view instanceof View, ``);
        if (context.getUnfiltered()[0].filter(value => value.context === view).length && view.hostElement.getView(-1) === view) {
            // event is attached on a component
            // TODOs:
            // - check if event is a @Output event on the component (if not, throw error)
            // - check if it is an expression or a method call
            // - bind onto event
            console.log("event on component detected", view.hostElement.component);
        } else {
            // normal event
            // TODOs:
            // - check if it is an expression or a method call
            // - bind onto event
            console.log("event detected");
        }

        console.log(view);
        console.log(element, attribute, context);
    }
}
