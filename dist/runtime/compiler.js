"use strict";
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
var RuntimeCompiler = (function () {
    function RuntimeCompiler(_resolver) {
        this._resolver = _resolver;
        this._directiveCache = new Map();
        this._visitorCache = new Map();
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
        return this._compileDirective(directive);
    };
    /**
     * Resolves and returns a CompileDirective for a directive type
     * Throws an error if it is not already compiled.
     *
     * @param {ClassType<any>} directive
     * @returns
     *
     * @memberOf RuntimeCompiler
     */
    RuntimeCompiler.prototype.resolve = function (directive) {
        var resolved = this._directiveCache.get(directive);
        assert_1.assert(resolved instanceof CompileDirective, "Can not resolve " + utils_1.stringify(directive) + ". It is not compiled yet.");
        return resolved;
    };
    /**
     * Resolves and returns a NodeVisitor for a directive type.
     * Throws an error if it is not already compiled.
     *
     * @param {ClassType<any>} directive
     * @returns
     *
     * @memberOf RuntimeCompiler
     */
    RuntimeCompiler.prototype.resolveVisitor = function (directive) {
        var childDirectives = this.resolve(directive).directives;
        if (utils_1.isArray(childDirectives) && childDirectives.length) {
            var resolved = this._visitorCache.get(directive);
            assert_1.assert(resolved instanceof node_visitor_1.NodeVisitor, "Can not resolve visitor for " + utils_1.stringify(directive) + ". It is not compiled yet.");
            return resolved;
        }
        return undefined;
    };
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
    RuntimeCompiler.prototype._compileDirective = function (directive) {
        var compiled = this._directiveCache.get(directive);
        if (compiled instanceof CompileDirective) {
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
        // resolve child directives
        if (metadata.directives) {
            resolvedMetadata.directives = metadata.directives.map(this._compileDirective.bind(this));
        }
        // resolve providers
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
        compiled = new CompileDirective(resolvedMetadata);
        this._directiveCache.set(compiled.type, compiled);
        // create a new Visitor for this directive 
        // with the child directives as selectables
        this._compileVisitor(compiled);
        return compiled;
    };
    /**
     * Compiles a NodeVisitor for a CompileDirective
     * with all child directives as selectables.
     *
     * @param {CompileDirective<any>} directive
     * @returns
     *
     * @memberOf RuntimeCompiler
     */
    RuntimeCompiler.prototype._compileVisitor = function (directive) {
        var childDirectives = directive.directives;
        if (utils_1.isArray(childDirectives) && childDirectives.length) {
            var compiled = this._visitorCache.get(directive.type);
            if (!(compiled instanceof node_visitor_1.NodeVisitor)) {
                compiled = new node_visitor_1.NodeVisitor(childDirectives);
                this._visitorCache.set(directive.type, compiled);
            }
            return compiled;
        }
        return undefined;
    };
    RuntimeCompiler = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(resolver_1.DirectiveResolver)), 
        __metadata('design:paramtypes', [resolver_1.DirectiveResolver])
    ], RuntimeCompiler);
    return RuntimeCompiler;
}());
exports.RuntimeCompiler = RuntimeCompiler;
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
var CompileDirective = (function () {
    function CompileDirective(_a) {
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
    return CompileDirective;
}());
exports.CompileDirective = CompileDirective;
//# sourceMappingURL=compiler.js.map