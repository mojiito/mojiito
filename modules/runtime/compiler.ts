import { ClassType, isArray, isPresent, splitAtColon, stringify } from '../utils/utils';
import { DirectiveResolver } from '../core/directive/resolver';
import { ComponentMetadata } from '../core/directive/metadata';
import { Inject, Injectable, Injector } from '../core/di/di';
import { ChangeDetectionStrategy } from '../core/change_detection/change_detection';
import { assert } from "../debug/assert/assert";
import { NodeVisitor } from './node_visitor';
import { ComponentFactory, ComponentFactoryResolver } from '../core/directive/factory';
import { AppView, ViewType, ViewContainerRef } from '../core/view/view';
import { AppElement } from '../core/view/element';

@Injectable()
export class RuntimeCompiler {

    private _directiveCache = new Map<ClassType<any>, CompiledDirectiveResult<any>>();
    private _visitorCache = new Map<ClassType<any>, NodeVisitor>();
    private _componentFactoryCache = new Map<ClassType<any>, ComponentFactory<any>>();

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
        const compiled = this.compileDirective(directive);
        this._compileVisitor(compiled);
        return compiled;
    }

    compileComponent<C>(componentType: ClassType<C>): ComponentFactory<C> {
        let factory: ComponentFactory<C> = this._componentFactoryCache.get(componentType);
        if (!factory) {
            const compiled = this.compileDirective(componentType);

            factory = new ComponentFactory(compiled.type, this.compileViewFactory(compiled));
        }
        return factory;
    }

    _compileComponent<C>(compileDirective: CompiledDirectiveResult<C>) {
        assert(compileDirective.isComponent, `Can not compile ${stringify(compileDirective.type)} because it is not a component!`);
        return new ComponentFactory(compileDirective.type, () => { });
    }


    /**
     * Compiles the directive and all its metadata and stores it into a cache
     * 
     * @private
     * @param {ClassType<any>} directive
     * @returns
     * 
     * @memberOf RuntimeCompiler
     */
    private compileDirective(directive: ClassType<any>) {
        let compiled = this._directiveCache.get(directive);
        if (compiled instanceof CompiledDirectiveResult) {
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
        compiled = new CompiledDirectiveResult(resolvedMetadata);
        this._directiveCache.set(compiled.type, compiled);

        // compile child directives        
        compiled.directives.forEach(d => this.compileDirective(d));

        if (compiled.isComponent) {
            this._compileComponent(compiled);
        }

        return compiled;
    }

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
    compileVisitor(type: ClassType<any>) {
        const compiled = this.compileDirective(type);
        return this._compileVisitor(compiled);
    }

    createVisitor(directives: ClassType<any>[]): NodeVisitor;
    createVisitor(directives: CompiledDirectiveResult<any>[]): NodeVisitor;
    createVisitor(directives: any[]): NodeVisitor {
        directives = directives.map(d => d instanceof CompiledDirectiveResult ? d : this.compileDirective(d));
        const compiled = new NodeVisitor(directives);
        return compiled;
    }

    private _compileVisitor(directive: CompiledDirectiveResult<any>) {
        let visitor = this._visitorCache.get(directive.type);
        if (!visitor) {
            let childDirectives = directive.directives.map(d => this.compileDirective(d));
            if (isArray(childDirectives) && childDirectives.length) {
                childDirectives.forEach(d => this._compileVisitor(d));
            } else {
                const i = this._directiveCache.values();
                let d: CompiledDirectiveResult<any>;
                childDirectives = [];
                do {
                    d = i.next().value;
                    if (d && d !== directive) {
                        childDirectives.push(d);
                    }
                } while (d);
            }
            visitor = this.createVisitor(childDirectives);
            this._visitorCache.set(directive.type, visitor);
        }

        return visitor;
    }

    createComponentFactoryResolver(factories: ComponentFactory<any>[], parent?: ComponentFactoryResolver) {
        return new ComponentFactoryResolver(factories, parent);
    }

    compileViewFactory<T>(directive: CompiledDirectiveResult<T>) {
        return function (parentInjector: Injector, declarationAppElement: AppElement = null): AppView<T> {

            const compViewType = directive.isComponent ? class extends AppView<T> {
                constructor(parentInjector: Injector, declarationAppElement: AppElement) {
                    super(compViewType, ViewType.COMPONENT, parentInjector, declarationAppElement);
                }
                /* @override */
                createInternal(rootSelectorOrNode: string | any): AppElement {
                    const self = <any>this;
                    return null;
                }
            } : null;




            const hostView = class extends AppView<T> {
                constructor(parentInjector: Injector) {
                    super(hostView, ViewType.HOST, parentInjector, null);
                }

                /* @override */
                createInternal(rootSelectorOrNode: string | any): AppElement {
                    const self = <any>this;
                    self._el = this.selectOrCreateHostElement(directive.selector, rootSelectorOrNode);
                    self._appEl = new AppElement(this, self._el);
                    const compView = compViewType ? new compViewType(null, self._el) : null;
                    return null;
                }
            }

            // const view = new View(ViewType.HOST, parentInjector, declarationAppElement);
            // view.createInternal = viewCreateInternal(view);
            return new hostView(parentInjector);
        }
    }
}

// HOST
// self._el_0 = self.selectOrCreateHostElement('app-root',rootSelector,self.debug(0,0,0));
// self._appEl_0 = new jit_AppElement5(0,null,self,self._el_0);
// var compView_0 = jit_viewFactory_AppComponent6(self.viewUtils,self.injector(0),self._appEl_0);
// self._AppComponent_0_5 = new jit_Wrapper_AppComponent7(self._appEl_0.vcRef);
// self._appEl_0.initComponent(self._AppComponent_0_5.context,[],compView_0);
// compView_0.create(self._AppComponent_0_5.context,self.projectableNodes,null);
// self.init([].concat([self._appEl_0]),[self._el_0],[],[]);
// return self._appEl_0;

// COMPONENT
// var parentRenderNode = self.renderer.createViewRoot(self.declarationAppElement.nativeElement);
// self._el_0 = self.renderer.createElement(parentRenderNode,'app-sub',self.debug(0,0,0));
// self._appEl_0 = new jit_AppElement5(0,null,self,self._el_0);
// var compView_0 = jit_viewFactory_SubComponent6(self.viewUtils,self.injector(0),self._appEl_0);
// self._SubComponent_0_5 = new jit_Wrapper_SubComponent7(self._appEl_0.vcRef);
// self._appEl_0.initComponent(self._SubComponent_0_5.context,[],compView_0);
// compView_0.create(self._SubComponent_0_5.context,[],null);
// self.init([],[self._el_0],[],[]);
// return null;


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
export class CompiledDirectiveResult<T> {

    isComponent: boolean;
    type: ClassType<T>;
    changeDetection: ChangeDetectionStrategy;
    selector: string;
    inputs: { [key: string]: string };
    outputs: { [key: string]: string };
    host: { [key: string]: string };
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
        styles,
    }: {
            isComponent: boolean;
            type: ClassType<T>;
            changeDetection?: ChangeDetectionStrategy;
            selector: string;
            inputs?: { [key: string]: string };
            outputs?: { [key: string]: string };
            host?: { [key: string]: string };
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