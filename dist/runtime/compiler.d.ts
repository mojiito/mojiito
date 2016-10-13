import { ClassType } from '../utils/utils';
import { DirectiveResolver } from '../core/directive/resolver';
import { ChangeDetectionStrategy } from '../core/change_detection/change_detection';
import { NodeVisitor } from './node_visitor';
export declare class RuntimeCompiler {
    private _resolver;
    private _directiveCache;
    private _visitorCache;
    constructor(_resolver: DirectiveResolver);
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
    compileDirectiveAndChilds(directive: ClassType<any>): CompileDirective<any>;
    /**
     * Resolves and returns a CompileDirective for a directive type
     * Throws an error if it is not already compiled.
     *
     * @param {ClassType<any>} directive
     * @returns
     *
     * @memberOf RuntimeCompiler
     */
    resolve(directive: ClassType<any>): CompileDirective<any>;
    /**
     * Resolves and returns a NodeVisitor for a directive type.
     * Throws an error if it is not already compiled.
     *
     * @param {ClassType<any>} directive
     * @returns
     *
     * @memberOf RuntimeCompiler
     */
    resolveVisitor(directive: ClassType<any>): NodeVisitor;
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
    private _compileDirective(directive);
    /**
     * Compiles a NodeVisitor for a CompileDirective
     * with all child directives as selectables.
     *
     * @param {CompileDirective<any>} directive
     * @returns
     *
     * @memberOf RuntimeCompiler
     */
    _compileVisitor(directive: CompileDirective<any>): NodeVisitor;
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
export declare class CompileDirective<T> {
    isComponent: boolean;
    type: ClassType<T>;
    changeDetection: ChangeDetectionStrategy;
    selector: string;
    inputs: {
        [key: string]: string;
    };
    outputs: {
        [key: string]: string;
    };
    host: {
        [key: string]: string;
    };
    providers: any[];
    directives: ClassType<any>[];
    templateUrl: string;
    template: string;
    styleUrls: string[];
    styles: string[];
    constructor({isComponent, type, changeDetection, selector, inputs, outputs, host, providers, directives, templateUrl, template, styleUrls, styles}: {
        isComponent: boolean;
        type: ClassType<T>;
        changeDetection?: ChangeDetectionStrategy;
        selector: string;
        inputs?: {
            [key: string]: string;
        };
        outputs?: {
            [key: string]: string;
        };
        host?: {
            [key: string]: string;
        };
        providers?: any[];
        directives?: ClassType<any>[];
        templateUrl?: string;
        template?: string;
        styleUrls?: string[];
        styles?: string[];
    });
}
