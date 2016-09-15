import { assert } from '../../debug/debug';
import { Injectable, Inject, forwardRef } from '../../core/di/di';
import { DOMParser } from './dom_parser';
import { ComponentFactoryResolver } from '../../core/component/factory';
import { ComponentReference } from '../../core/component/reference';
import { ComponentParserHook } from './hooks/component';
import { EventParserHook } from './hooks/event';
import { BindingParserHook } from './hooks/binding';
import { TemplateVariableParserHook } from './hooks/template_variable';

@Injectable()
export class Parser {

    private _domParser = new DOMParser();

    constructor(
        @Inject(forwardRef(() => ComponentFactoryResolver)) resolver: ComponentFactoryResolver
    ) {
        this._domParser.registerElementHook(new ComponentParserHook(resolver));
        this._domParser.registerAttributeHook(new TemplateVariableParserHook());
        this._domParser.registerAttributeHook(new EventParserHook());
        this._domParser.registerAttributeHook(new BindingParserHook());
    }

    parse(root: Element, context?: any, skipRootElement?: boolean) {
        this._domParser.parseTree(<HTMLElement>root, context, skipRootElement);
    }
}