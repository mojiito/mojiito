import { ClassType, isArray, isPresent, splitAtColon, stringify } from '../utils/utils';
import { DirectiveResolver } from '../core/directive/resolver';
import { ComponentMetadata } from '../core/directive/metadata';
import { Inject, Injectable } from '../core/di/di';
import { ChangeDetectionStrategy } from '../core/change_detection/change_detection';
import { assert } from "../debug/assert/assert";
import { NodeVisitor } from './node_visitor';

@Injectable()
export class RuntimeCompiler {

    private _directiveCache = new Map<ClassType<any>, CompileDirective<any>>();
    private _visitorCache = new Map<ClassType<any>, NodeVisitor>();

    constructor(
        @Inject(DirectiveResolver) private _resolver: DirectiveResolver
    ) { }

    /**
     * Compiles a directive with all its metadata,
     * as well as all sub directives into a compiled version.
     * It also creates a NodeVisitor for every directive found
     * which has child directives itself.
     * All CompileDirectives and NodeVisitor are stored in a cache
     * so we only have to do that once.
     * 
     * @param {ClassType<any>} directive
     * @returns
     * 
     * @memberOf RuntimeCompiler
     */
    compileDirectiveAndChilds(directive: ClassType<any>) {
        const compiled = this._compileDirective(directive);
        this._compileVisitor(compiled);
        return compiled;
    }

    /**
     * Resolves and returns a CompileDirective for a directive type
     * Throws an error if it is not already compiled.
     * 
     * @param {ClassType<any>} directive
     * @returns
     * 
     * @memberOf RuntimeCompiler
     */
    resolve(directive: ClassType<any>) {
        const resolved = this._directiveCache.get(directive);
        assert(resolved instanceof CompileDirective, `Can not resolve ${stringify(directive)}. It is not compiled yet.`);
        return resolved;
    }

    /**
     * Resolves and returns a NodeVisitor for a directive type.
     * Throws an error if it is not already compiled.
     * 
     * @param {ClassType<any>} directive
     * @returns
     * 
     * @memberOf RuntimeCompiler
     */
    resolveVisitor(directive: ClassType<any>) {
        const childDirectives = this.resolve(directive).directives;
        if (isArray(childDirectives) && childDirectives.length) {
            const resolved = this._visitorCache.get(directive);
            assert(resolved instanceof NodeVisitor, `Can not resolve visitor for ${stringify(directive)}. It is not compiled yet.`);
            return resolved;
        }
        return undefined;
    }

    /**
     * Compiles the directive and all its metadata and stores it into a cache
     * We also compile a NodeVisitor for this directive
     * 
     * @private
     * @param {ClassType<any>} directive
     * @returns
     * 
     * @memberOf RuntimeCompiler
     */
    private _compileDirective(directive: ClassType<any>) {
        let compiled = this._directiveCache.get(directive);
        if (compiled instanceof CompileDirective) {
            return compiled;
        }
        const metadata = this._resolver.resolve(directive);
        let selector = metadata.selector;

        // Check if a selector is specified in the metadata.
        // Every directive must have a selector
        assert(typeof selector === 'string',
            `The directive metadata object on your class must specify a selector!`,
            TypeError);

        selector = selector.trim();

        // Check if selector contains only one level of dom nodes
        // Ok: .my-selector
        // Not allowed: .parent .my-selector
        assert(selector.indexOf(' ') === -1,
            `The selector "${selector}" contains more than one levels of nodes. Only one is allowed!`,
            SyntaxError);

        // Check if selector is valid
        assert(!!selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/),
            `The directive selector "${selector}" is not valid`,
            SyntaxError);

        // Parsing the selector string to an array
        // 'my-element.class1#id[attribute1].class2[attribute2="value"]'
        // to
        // ["my-element", ".class1", "#id", "[attribute1]", ".class2", "[attribute2="value"]"]   
        let selectorList: string[] = selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');

        for (let i = 0, max = selectorList.length; i < max; i++) {
            let selectorPart = selectorList[i];
            if (!selectorPart.length) {
                continue;
            }
            
            if (!/^\w+(-\w+)*$/.test(selectorPart)) {
                continue;
            }

            // Check if the selector contains element names whicht are not allowed
            // eg. custom elements without a "-" in it
            assert(!(document.createElement(selectorPart) instanceof HTMLUnknownElement) || /^\w+(-\w+)+$/.test(selectorPart),
                `The selector "${selector}" contains an element name "${selectorPart}" which is not allowed. 
                If you are using a custom element, there has to be a "-" char in it. E.g.: my-component`,
                SyntaxError);
        }

        // resolve basic metadata which has to be set on every directive and component        
        const resolvedMetadata: any = {
            isComponent: metadata instanceof ComponentMetadata,
            type: directive,
            selector: selector,
        }

        // resolve inputs        
        if (isArray(metadata.inputs)) {
            let mergedInputs: { [key: string]: string } = {};
            metadata.inputs.forEach(i => {
                const parts = splitAtColon(i, [i, i]);
                assert(!isPresent(mergedInputs[parts[1]]), `The input parameter ${parts[1]} is already defined on ${stringify(directive)}`);
                mergedInputs[parts[1]] = parts[0];
            });
            resolvedMetadata.inputs = mergedInputs;
        }

        // resolve outputs        
        if (isArray(metadata.outputs)) {
            let mergedOutputs: { [key: string]: string } = {};
            metadata.outputs.forEach(i => {
                const parts = splitAtColon(i, [i, i]);
                assert(!isPresent(mergedOutputs[parts[1]]), `The output parameter ${parts[1]} is already defined on ${stringify(directive)}`);
                mergedOutputs[parts[1]] = parts[0];
            });
            resolvedMetadata.outputs = mergedOutputs;
        }

        // resolve child directives and providers
        resolvedMetadata.directives = metadata.directives;
        resolvedMetadata.providers = metadata.providers; 

        // setup the metadata only a component has        
        if (metadata instanceof ComponentMetadata) {
            resolvedMetadata.changeDetection = metadata.changeDetection || ChangeDetectionStrategy.Default;
            resolvedMetadata.host = metadata.host;
            resolvedMetadata.templateUrl = metadata.templateUrl;
            resolvedMetadata.template = metadata.template;
            resolvedMetadata.styleUrls = metadata.styleUrls;
            resolvedMetadata.styles = metadata.styles;
        }

        // create a new CompileDirective based on the resolved metadata
        // set the CompileDirective in the cache so next time we don't
        // have to do this again and can just get the already compiled one
        compiled = new CompileDirective(resolvedMetadata);        
        this._directiveCache.set(compiled.type, compiled);

        // compile child directives        
        compiled.directives.forEach(d => this._compileDirective(d));
        
        return compiled;
    }

    /**
     * Compiles a NodeVisitor for a CompileDirective
     * with all child directives as selectables.
     * 
     * @param {CompileDirective<any>} directive
     * @returns
     * 
     * @memberOf RuntimeCompiler
     */
    _compileVisitor(directive: CompileDirective<any>) {
        let compiled = this._visitorCache.get(directive.type);
        if (!(compiled instanceof NodeVisitor)) {
            let childDirectives = directive.directives.map(d => this.resolve(d));
            if (isArray(childDirectives) && childDirectives.length) {
                childDirectives.forEach(d => this._compileVisitor(d));
            } else {
                const i = this._directiveCache.values();
                let d: CompileDirective<any>;
                childDirectives = [];
                do {
                    d = i.next().value;
                    if (d && d !== directive) {
                        childDirectives.push(d);
                    }
                } while (d);
            }
            compiled = new NodeVisitor(childDirectives);
            this._visitorCache.set(directive.type, compiled);
        }
        return compiled;
    }

}


/**
 * Representation of a compiled directive.
 * It includes all metadata a directive or component can have.
 * It also has stored the class (type) itself as well as the
 * inforation if it is a directive or component.
 * 
 * @export
 * @class CompileDirective
 * @template T
 */
export class CompileDirective<T> {

    isComponent: boolean;
    type: ClassType<T>;
    changeDetection: ChangeDetectionStrategy;
    selector: string;
    inputs: {[key: string]: string};
    outputs: {[key: string]: string};
    host: {[key: string]: string};
    providers: any[];
    directives: ClassType<any>[];
    templateUrl: string;
    template: string;
    styleUrls: string[];
    styles: string[];

    constructor({
            isComponent,
            type,
            changeDetection,
            selector,
            inputs,
            outputs,
            host,
            providers,
            directives,
            templateUrl,
            template,
            styleUrls,
            styles
        }: {
            isComponent: boolean;
            type: ClassType<T>;
            changeDetection?: ChangeDetectionStrategy;
            selector: string;
            inputs?: {[key: string]: string};
            outputs?: {[key: string]: string};
            host?: {[key: string]: string};
            providers?: any[];
            directives?: ClassType<any>[];
            templateUrl?: string;
            template?: string;
            styleUrls?: string[];
            styles?: string[];
            }
    ) {
        this.isComponent = isComponent;
        this.type = type;
        this.selector = selector;
        this.inputs = inputs;
        this.outputs = outputs;
        this.directives = directives;
        this.providers = providers;
        
        if (isComponent) {
            this.changeDetection = changeDetection || ChangeDetectionStrategy.Default;
            this.host = host;
            this.templateUrl = templateUrl;
            this.template = template;
            this.styleUrls = styleUrls;
            this.styles = styles;
        }
    }
}