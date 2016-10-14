import { isPresent, splitAtColon, stringify } from '../utils/utils';
import { Logger, LogLevel, LogType, assert } from '../debug/debug';
import { Inject, Injectable, Injector } from '../core/di/di';
import { DirectiveResolver } from '../core/directive/resolver';
import { ClassType } from '../utils/class/class';
import { ComponentMetadata } from '../core/directive/metadata';
import { View } from '../core/view/view';
import { Selector } from './selector';
import { ExpressionParser } from './expression';
import { CompiledDirectiveMetadata } from './metadata';
import { RuntimeCompiler } from './compiler';
import { BoundElementPropertyAst, BoundEventAst, PropertyBindingType } from './ast';

// https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/template_parser/template_parser.ts#L35
// Group 1 = "bind-"
// Group 2 = "let-"
// Group 3 = "ref-/#"
// Group 4 = "on-"
// Group 5 = "bindon-"
// Group 6 = "@"
// Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
// Group 8 = identifier inside [()]
// Group 9 = identifier inside []
// Group 10 = identifier inside ()
const BIND_NAME_REGEXP =
    /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
enum BIND_NAME_POS {
    UNDEFINED,
    KW_BIND_IDX,
    KW_LET_IDX,
    KW_REF_IDX,
    KW_ON_IDX,
    KW_BINDON_IDX,
    KW_AT_IDX,
    IDENT_KW_IDX,
    IDENT_BANANA_BOX_IDX,
    IDENT_PROPERTY_IDX,
    IDENT_EVENT_IDX
}
const ATTRIBUTE_PREFIX = 'attr';
const CLASS_PREFIX = 'class';
const STYLE_PREFIX = 'style';

export class NodeVisitor {

    private _selectables: [Selector, any][] = [];
    private _expressionParser = new ExpressionParser();

    // get injector() { return this._injector; }

    constructor(selectables: any[]/*, private _injector: Injector*/) {
        this._selectables = <[Selector, any][]>selectables.map(s => [Selector.parse(s.selector), s]);
    }

    visitElement(element: Element, context: any): any {
        // Skip <script> and <style> tags
        if (element instanceof HTMLScriptElement || element instanceof HTMLStyleElement) {
            return;
        }

        // Skip <template> tags
        if (element.tagName.toLowerCase() === 'template') {
            return;
        }

        // find selectables that match the elements selector     
        const selectables = this._selectables
            .filter(s => s[0].match(Selector.parseElement(element)))
            .map(s => s[1]);
            // .forEach(factory => this._createDirective(factory, context));

        if (selectables && selectables.length) {
            const attrs = element.attributes;
            const targetProperties: BoundElementPropertyAst[] = [];
            const targetEvents: BoundEventAst[] = [];
            for (let i = 0, max = attrs.length; i < max; i++) {
                const attr = attrs[i];
                this._parseAttribute(attr, targetProperties, targetEvents);
            }

            // TODO: Rework for directives            
            // selectables.forEach((s: CompiledComponentFactory<any>) => {
            //     if (s instanceof CompiledComponentFactory) {
            //         s.create(context, element, targetProperties, targetEvents);
            //     }
            // })

        }
    }

    visitAttribute(attr: Attr, context: any) { }

    visitText(text: Text, context: any) {
        console.log('visit visitText', text);
    }

    private _parseAttribute(attr: Attr, targetProperties: BoundElementPropertyAst[], targetEvents: BoundEventAst[]): boolean {
        const name = this._normalizeAttributeName(attr.name);
        const value = attr.value;

        if (!isPresent(value))
            return;
        console.log(value);
        const bindParts = name.match(BIND_NAME_REGEXP);
        let hasBinding = false;
        if (isPresent(bindParts)) {
            hasBinding = true;
            if (isPresent(bindParts[BIND_NAME_POS.KW_BIND_IDX])) {
                // Group 1 = "bind-"
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_KW_IDX], value, targetProperties);
                hasBinding = true;
            } else if (bindParts[BIND_NAME_POS.KW_LET_IDX]) {
                // Group 2 = "let-"
                // TODO
                Logger.log(LogLevel.debug, `Let is currently not supportet: ${name}`, LogType.warn);
            } else if (bindParts[BIND_NAME_POS.KW_REF_IDX]) {
                // Group 3 = "ref-/#"
                // TODO
                Logger.log(LogLevel.debug, `Ref is currently not supportet: ${name}`, LogType.warn);
            } else if (bindParts[BIND_NAME_POS.KW_ON_IDX]) {
                // Group 4 = "on-"
                this._parseEvent(bindParts[BIND_NAME_POS.IDENT_KW_IDX], value, targetEvents);
            } else if (bindParts[BIND_NAME_POS.KW_BINDON_IDX]) {
                // Group 5 = "bindon-"
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_KW_IDX], value, targetProperties);
                this._parseEvent(`${bindParts[BIND_NAME_POS.IDENT_KW_IDX]}Change`, `${value}=$event`, targetEvents);
            } else if (bindParts[BIND_NAME_POS.KW_AT_IDX]) {
                // Group 6 = "@"
                // TODO
                Logger.log(LogLevel.debug, `Animations are currently not supportet: ${name}`, LogType.warn);
            } else if (bindParts[BIND_NAME_POS.IDENT_BANANA_BOX_IDX]) {
                // Group 8 = identifier inside [()]
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX], value, targetProperties);
                this._parseEvent(`${bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX]}Change`, `${value}=$event`, targetEvents);
            } else if (bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX]) {
                // Group 9 = identifier inside []
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX], value, targetProperties);
            } else if (bindParts[BIND_NAME_POS.IDENT_EVENT_IDX]) {
                // Group 10 = identifier inside ()
                this._parseEvent(bindParts[BIND_NAME_POS.IDENT_EVENT_IDX], value, targetEvents);
            }
        }
        return hasBinding;
    }

    private _parsePropertyOrAnimation(name: string, expression: string, targetProperties: BoundElementPropertyAst[]) {
        const animatePropPrefix = 'animate-';
        const animatePropLength = 'animate-'.length;
        let isAnimationProp = name[0] == '@';
        let animationPrefixLength = 1;
        if (name.substring(0, animatePropLength) === animatePropPrefix) {
            isAnimationProp = true;
            animationPrefixLength = animatePropLength;
        }

        if (isAnimationProp) {
            // TODO: Animation
            Logger.log(LogLevel.debug, `Animations are currently not supportet: ${name}`, LogType.warn);
        } else {
            this._parseProperty(name, expression, targetProperties);
        }
    }

    private _parseProperty(name: string, expression: string, targetProperties: BoundElementPropertyAst[]) {
        const parts = name.split('.');
        let bindingName: string;
        let bindingType: PropertyBindingType;
        if (parts.length === 1) {
            bindingType = PropertyBindingType.Property;
            bindingName = parts[0];
        } else {
            const prefix = parts[0];
            if (prefix === ATTRIBUTE_PREFIX) {
                bindingType = PropertyBindingType.Attribute;
            } else if (prefix === CLASS_PREFIX) {
                bindingType = PropertyBindingType.Class;
            } else if (prefix === STYLE_PREFIX) {
                bindingType = PropertyBindingType.Style;
            }
            if (bindingType && parts[1]) {
                bindingName = parts[1];
            }
        }
        if (bindingName) {
            targetProperties.push(new BoundElementPropertyAst(bindingName, expression, bindingType));
        } else {
            Logger.log(LogLevel.debug, `Invalid property name '${name}'`, LogType.warn);
        }
    }

    private _parseEvent(name: string, expression: string, targetEvents: BoundEventAst[]) {
        const parts = splitAtColon(name, [null, name]);
        const target = parts[0];
        const eventName = parts[1];
        targetEvents.push(new BoundEventAst(name, target, eventName));
    }

    // private _createDirective(factory: CompiledDirectiveFactory<any>, context: View<any>) {
        // if (factory.metadata instanceof ComponentMetadata) {
        //     factory.create()
        // }
    // }

    /**
     * Normalizes attribute name, removes "data-"
     * See: https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/template_parser/template_parser.ts#L583
     *
     * @private
     * @param {string} attrName
     * @returns {string}
     * 
     * @memberOf NodeVisitor
     */
    private _normalizeAttributeName(attrName: string): string {
        return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
    }
}

export function getVisitorForContext(context: any) {
    const injector: Injector = context.injector;
    assert(injector instanceof Injector, `The context "${stringify(context)}" does not implement a injector!`, TypeError);
    const visitor: NodeVisitor = injector.get(NodeVisitor);
    assert(visitor instanceof NodeVisitor, `Can not inject NodeVisitor into DOMTraverser`);
    return visitor;
}