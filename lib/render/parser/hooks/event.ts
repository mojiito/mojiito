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
        let view = context.getNearestContextOfType(View);

        console.log(context.getUnfiltered());
        // console.log(context.getFiltered());

        console.log(view);
        console.log(element, attribute, context);
    }
}
