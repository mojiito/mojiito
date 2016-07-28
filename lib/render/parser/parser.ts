import { assert } from '../../debug/debug';
import { Injectable, Inject, forwardRef } from '../../runtime/di/di';
import { DOMParser } from './dom_parser';
import { ComponentResolver } from '../../runtime/component/resolver';
import { ComponentReference } from '../../runtime/component/reference';
import { ComponentParserHook } from './hooks/component';
import { EventParserHook } from './hooks/event';
import { BindingParserHook } from './hooks/binding';

@Injectable()
export class Parser {

    private _domParser = new DOMParser();

    constructor(
        @Inject(forwardRef(() => ComponentResolver)) resolver: ComponentResolver
    ) {
        this._domParser.registerElementHook(new ComponentParserHook(resolver));
        this._domParser.registerAttributeHook(new EventParserHook());
        this._domParser.registerAttributeHook(new BindingParserHook());
    }

    parse(root: Element, context?: any, skipRootElement?: boolean) {
        this._domParser.parseTree(<HTMLElement>root, context, skipRootElement);
    }
}