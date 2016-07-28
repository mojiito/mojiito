import { assert } from '../../../debug/debug';
import { stringify } from '../../../utils/string/stringify';
import { Injectable, Inject, forwardRef } from '../../../runtime/di/di';
import { ContextTree } from '../context';
import { ParserElementHook, ParserAttributeHook } from './hooks';
import { View } from '../../../runtime/view/view';

export class BindingParserHook extends ParserAttributeHook {

    removeAttributeNode = true;

    constructor() {
        super();
    }

    predicate(attribute: Attr): boolean {
        return !!attribute.name.match(/^\[\w+\]|bind-\w+|data-bind-\w+$/);
    }

    onParse(element: Element, attribute: Attr, context: ContextTree) {
        console.log(element, attribute);
    }
}
