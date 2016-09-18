import { isPresent, splitAtColon } from '../utils/utils';
import { Logger, LogLevel, LogType } from '../debug/debug';
import { Inject, Injectable } from '../core/di/di';
import { DirectiveResolver } from '../core/directive/resolver';
import { ClassType } from '../utils/class/class';
import { ComponentMetadata } from '../core/directive/metadata';
import { Selector } from './selector';
import { ExpressionParser } from './expression';
import { CompiledDirectiveMetadata } from './metadata';
import { RuntimeCompiler } from './compiler';
import { CompiledDirectiveFactory, CompiledComponentFactory } from './compiler';

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

@Injectable()
export class NodeVisitor {

    private _selectables: [Selector, any][] = [];
    private _expressionParser = new ExpressionParser();

    constructor(@Inject(RuntimeCompiler) private _compiler: RuntimeCompiler) {
        if (Array.isArray(this._compiler.compiledDirectives))
            this._compiler.compiledDirectives.forEach(d => this._selectables.push([Selector.parse(d.metadata.selector), d]));
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

        const attrs = element.attributes;
        for (let i = 0, max = attrs.length; i < max; i++) {
            const attr = attrs[i];
            this._parseAttribute(attr);
        }

        // find selectables that match the elements selector     
        const selectables = this._selectables
            .filter(s => s[0].match(Selector.parseElement(element)))
            .map(s => s[1])
            .forEach(factory => this._createDirective(factory, context));
    }

    visitAttribute(attribute: Attr, context: any) {
        console.log('visit Attribute', attribute);
    }

    visitText(text: Text, context: any) {
        console.log('visit Attribute', text);
    }

    private _parseAttribute(attr: Attr) {
        const name = this._normalizeAttributeName(attr.name);
        const value = attr.value;

        if (!isPresent(value))
            return;

        const bindParts = name.match(BIND_NAME_REGEXP);
        if (isPresent(bindParts)) {
            if (isPresent(bindParts[BIND_NAME_POS.KW_BIND_IDX])) {
                // Group 1 = "bind-"
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_KW_IDX], value);
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
                this._parseEvent(bindParts[BIND_NAME_POS.IDENT_KW_IDX], value);
            } else if (bindParts[BIND_NAME_POS.KW_BINDON_IDX]) {
                // Group 5 = "bindon-"
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_KW_IDX], value);
                this._parseEvent(`${bindParts[BIND_NAME_POS.IDENT_KW_IDX]}Change`, `${value}=$event`);
            } else if (bindParts[BIND_NAME_POS.KW_AT_IDX]) {
                // Group 6 = "@"
                // TODO
                Logger.log(LogLevel.debug, `Animations are currently not supportet: ${name}`, LogType.warn);
            } else if (bindParts[BIND_NAME_POS.IDENT_BANANA_BOX_IDX]) {
                // Group 8 = identifier inside [()]
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX], value);
                this._parseEvent(`${bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX]}Change`, `${value}=$event`);
            } else if (bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX]) {
                // Group 9 = identifier inside []
                this._parsePropertyOrAnimation(bindParts[BIND_NAME_POS.IDENT_PROPERTY_IDX], value);
            } else if (bindParts[BIND_NAME_POS.IDENT_EVENT_IDX]) {
                // Group 10 = identifier inside ()
                this._parseEvent(bindParts[BIND_NAME_POS.IDENT_EVENT_IDX], value);
            }
        }
    }

    private _parsePropertyOrAnimation(name: string, expression: string) {
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
            this._parseProperty(name, expression);
        }
    }

    private _parseProperty(name: string, expression: string) {
        console.log('parse property: ' + name + ' ' + expression);
    }

    private _parseEvent(name: string, expression: string) {
        const parts = splitAtColon(name, [null, name]);
        const target = parts[0];
        const eventName = parts[1];
        this._expressionParser.parse(expression);
    }

    private _parseBinding(expression: string) {
        return expression;
    }

    private _createDirective(factory: CompiledDirectiveFactory<any>, context: any) {
        console.log(factory);
    }

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