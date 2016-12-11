import { ClassType } from '../utils/utils';
import { DirectiveResolver } from '../core/directive/resolver';
import { Injector } from '../core/di/di';
import { ChangeDetectionStrategy } from '../core/change_detection/change_detection';
import { NodeVisitor } from './node_visitor';
import { ComponentFactory, ComponentFactoryResolver } from '../core/directive/factory';
import { AppView } from '../core/view/view';
import { AppElement } from '../core/view/element';
export declare class RuntimeCompiler {
    private _resolver;
    private _directiveCache;
    private _visitorCache;
    private _componentFactoryCache;
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
    compileDirectiveAndChilds(directive: ClassType<any>): CompiledDirectiveResult<any>;
    compileComponent<C>(componentType: ClassType<C>): ComponentFactory<C>;
    _compileComponent<C>(compileDirective: CompiledDirectiveResult<C>): ComponentFactory<C>;
    /**
     * Compiles the directive and all its metadata and stores it into a cache
     *
     * @private
     * @param {ClassType<any>} directive
     * @returns
     *
     * @memberOf RuntimeCompiler
     */
    private compileDirective(directive);
    /**
     * Compiles a NodeVisitor for a CompileDirective
     * with all child directives as selectables.
     *
     * @private
     * @param {CompileDirective<any>} directive
     * @returns
     *
     * @memberOf RuntimeCompiler
     */
    compileVisitor(type: ClassType<any>): NodeVisitor;
    createVisitor(directives: ClassType<any>[]): NodeVisitor;
    createVisitor(directives: CompiledDirectiveResult<any>[]): NodeVisitor;
    private _compileVisitor(directive);
    createComponentFactoryResolver(factories: ComponentFactory<any>[], parent?: ComponentFactoryResolver): ComponentFactoryResolver;
    compileViewFactory<T>(directive: CompiledDirectiveResult<T>): (parentInjector: Injector, declarationAppElement?: AppElement) => AppView<T>;
}
/**
 * Representation of a compiled directive.
 * It includes all metadata a directive or component can have.
 * It also has stored the class (type) itself as well as the
 * inforation if it is a directive or component.
 *
 * @export
 * @class CompiledDirectiveResult
 * @template T
 */
export declare class CompiledDirectiveResult<T> {
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
