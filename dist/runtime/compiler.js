"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var utils_1 = require('../utils/utils');
var resolver_1 = require('../core/directive/resolver');
var metadata_1 = require('../core/directive/metadata');
var di_1 = require('../core/di/di');
var change_detection_1 = require('../core/change_detection/change_detection');
var assert_1 = require("../debug/assert/assert");
var node_visitor_1 = require('./node_visitor');
var factory_1 = require('../core/directive/factory');
var view_1 = require('../core/view/view');
var element_1 = require('../core/view/element');
var RuntimeCompiler = (function () {
    function RuntimeCompiler(_resolver) {
        this._resolver = _resolver;
        this._directiveCache = new Map();
        this._visitorCache = new Map();
        this._componentFactoryCache = new Map();
    }
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
    RuntimeCompiler.prototype.compileDirectiveAndChilds = function (directive) {
        var compiled = this.compileDirective(directive);
        this._compileVisitor(compiled);
        return compiled;
    };
    RuntimeCompiler.prototype.compileComponent = function (componentType) {
        var factory = this._componentFactoryCache.get(componentType);
        if (!factory) {
            var compiled = this.compileDirective(componentType);
            factory = new factory_1.ComponentFactory(compiled.type, this.compileViewFactory(compiled));
        }
        return factory;
    };
    RuntimeCompiler.prototype._compileComponent = function (compileDirective) {
        assert_1.assert(compileDirective.isComponent, "Can not compile " + utils_1.stringify(compileDirective.type) + " because it is not a component!");
        return new factory_1.ComponentFactory(compileDirective.type, function () { });
    };
    /**
     * Compiles the directive and all its metadata and stores it into a cache
     *
     * @private
     * @param {ClassType<any>} directive
     * @returns
     *
     * @memberOf RuntimeCompiler
     */
    RuntimeCompiler.prototype.compileDirective = function (directive) {
        var _this = this;
        var compiled = this._directiveCache.get(directive);
        if (compiled instanceof CompiledDirectiveResult) {
            return compiled;
        }
        var metadata = this._resolver.resolve(directive);
        var selector = metadata.selector;
        // Check if a selector is specified in the metadata.
        // Every directive must have a selector
        assert_1.assert(typeof selector === 'string', "The directive metadata object on your class must specify a selector!", TypeError);
        selector = selector.trim();
        // Check if selector contains only one level of dom nodes
        // Ok: .my-selector
        // Not allowed: .parent .my-selector
        assert_1.assert(selector.indexOf(' ') === -1, "The selector \"" + selector + "\" contains more than one levels of nodes. Only one is allowed!", SyntaxError);
        // Check if selector is valid
        assert_1.assert(!!selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/), "The directive selector \"" + selector + "\" is not valid", SyntaxError);
        // Parsing the selector string to an array
        // 'my-element.class1#id[attribute1].class2[attribute2="value"]'
        // to
        // ["my-element", ".class1", "#id", "[attribute1]", ".class2", "[attribute2="value"]"]   
        var selectorList = selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');
        for (var i = 0, max = selectorList.length; i < max; i++) {
            var selectorPart = selectorList[i];
            if (!selectorPart.length) {
                continue;
            }
            if (!/^\w+(-\w+)*$/.test(selectorPart)) {
                continue;
            }
            // Check if the selector contains element names whicht are not allowed
            // eg. custom elements without a "-" in it
            assert_1.assert(!(document.createElement(selectorPart) instanceof HTMLUnknownElement) || /^\w+(-\w+)+$/.test(selectorPart), "The selector \"" + selector + "\" contains an element name \"" + selectorPart + "\" which is not allowed. \n                If you are using a custom element, there has to be a \"-\" char in it. E.g.: my-component", SyntaxError);
        }
        // resolve basic metadata which has to be set on every directive and component        
        var resolvedMetadata = {
            isComponent: metadata instanceof metadata_1.ComponentMetadata,
            type: directive,
            selector: selector,
        };
        // resolve inputs        
        if (utils_1.isArray(metadata.inputs)) {
            var mergedInputs_1 = {};
            metadata.inputs.forEach(function (i) {
                var parts = utils_1.splitAtColon(i, [i, i]);
                assert_1.assert(!utils_1.isPresent(mergedInputs_1[parts[1]]), "The input parameter " + parts[1] + " is already defined on " + utils_1.stringify(directive));
                mergedInputs_1[parts[1]] = parts[0];
            });
            resolvedMetadata.inputs = mergedInputs_1;
        }
        // resolve outputs        
        if (utils_1.isArray(metadata.outputs)) {
            var mergedOutputs_1 = {};
            metadata.outputs.forEach(function (i) {
                var parts = utils_1.splitAtColon(i, [i, i]);
                assert_1.assert(!utils_1.isPresent(mergedOutputs_1[parts[1]]), "The output parameter " + parts[1] + " is already defined on " + utils_1.stringify(directive));
                mergedOutputs_1[parts[1]] = parts[0];
            });
            resolvedMetadata.outputs = mergedOutputs_1;
        }
        // resolve child directives and providers
        resolvedMetadata.directives = metadata.directives;
        resolvedMetadata.providers = metadata.providers;
        // setup the metadata only a component has        
        if (metadata instanceof metadata_1.ComponentMetadata) {
            resolvedMetadata.changeDetection = metadata.changeDetection || change_detection_1.ChangeDetectionStrategy.Default;
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
        compiled.directives.forEach(function (d) { return _this.compileDirective(d); });
        if (compiled.isComponent) {
            this._compileComponent(compiled);
        }
        return compiled;
    };
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
    RuntimeCompiler.prototype.compileVisitor = function (type) {
        var compiled = this.compileDirective(type);
        return this._compileVisitor(compiled);
    };
    RuntimeCompiler.prototype.createVisitor = function (directives) {
        var _this = this;
        directives = directives.map(function (d) { return d instanceof CompiledDirectiveResult ? d : _this.compileDirective(d); });
        var compiled = new node_visitor_1.NodeVisitor(directives);
        return compiled;
    };
    RuntimeCompiler.prototype._compileVisitor = function (directive) {
        var _this = this;
        var visitor = this._visitorCache.get(directive.type);
        if (!visitor) {
            var childDirectives = directive.directives.map(function (d) { return _this.compileDirective(d); });
            if (utils_1.isArray(childDirectives) && childDirectives.length) {
                childDirectives.forEach(function (d) { return _this._compileVisitor(d); });
            }
            else {
                var i = this._directiveCache.values();
                var d = void 0;
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
    };
    RuntimeCompiler.prototype.createComponentFactoryResolver = function (factories, parent) {
        return new factory_1.ComponentFactoryResolver(factories, parent);
    };
    RuntimeCompiler.prototype.compileViewFactory = function (directive) {
        return function (parentInjector, declarationAppElement) {
            if (declarationAppElement === void 0) { declarationAppElement = null; }
            var compViewType = directive.isComponent ? (function (_super) {
                __extends(class_1, _super);
                function class_1(parentInjector, declarationAppElement) {
                    _super.call(this, compViewType, view_1.ViewType.COMPONENT, parentInjector, declarationAppElement);
                }
                /* @override */
                class_1.prototype.createInternal = function (rootSelectorOrNode) {
                    var self = this;
                    return null;
                };
                return class_1;
            }(view_1.AppView)) : null;
            var hostView = (function (_super) {
                __extends(class_2, _super);
                function class_2(parentInjector) {
                    _super.call(this, hostView, view_1.ViewType.HOST, parentInjector, null);
                }
                /* @override */
                class_2.prototype.createInternal = function (rootSelectorOrNode) {
                    var self = this;
                    self._el = this.selectOrCreateHostElement(directive.selector, rootSelectorOrNode);
                    self._appEl = new element_1.AppElement(this, self._el);
                    var compView = compViewType ? new compViewType(null, self._el) : null;
                    return null;
                };
                return class_2;
            }(view_1.AppView));
            // const view = new View(ViewType.HOST, parentInjector, declarationAppElement);
            // view.createInternal = viewCreateInternal(view);
            return new hostView(parentInjector);
        };
    };
    RuntimeCompiler = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(resolver_1.DirectiveResolver)), 
        __metadata('design:paramtypes', [resolver_1.DirectiveResolver])
    ], RuntimeCompiler);
    return RuntimeCompiler;
}());
exports.RuntimeCompiler = RuntimeCompiler;
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
var CompiledDirectiveResult = (function () {
    function CompiledDirectiveResult(_a) {
        var isComponent = _a.isComponent, type = _a.type, changeDetection = _a.changeDetection, selector = _a.selector, inputs = _a.inputs, outputs = _a.outputs, host = _a.host, providers = _a.providers, directives = _a.directives, templateUrl = _a.templateUrl, template = _a.template, styleUrls = _a.styleUrls, styles = _a.styles;
        this.isComponent = isComponent;
        this.type = type;
        this.selector = selector;
        this.inputs = inputs;
        this.outputs = outputs;
        this.directives = directives;
        this.providers = providers;
        if (isComponent) {
            this.changeDetection = changeDetection || change_detection_1.ChangeDetectionStrategy.Default;
            this.host = host;
            this.templateUrl = templateUrl;
            this.template = template;
            this.styleUrls = styleUrls;
            this.styles = styles;
        }
    }
    return CompiledDirectiveResult;
}());
exports.CompiledDirectiveResult = CompiledDirectiveResult;
//# sourceMappingURL=compiler.js.map