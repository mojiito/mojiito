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
var RuntimeCompiler = (function () {
    function RuntimeCompiler(_resolver) {
        this._resolver = _resolver;
    }
    RuntimeCompiler.prototype.compileDirectiveAndAllChilds = function (directive) {
        var _this = this;
        var result = [this._compileDirective(directive)];
        var metadata = this._resolver.resolve(directive);
        if (utils_1.isArray(metadata.directives)) {
            metadata.directives
                .filter(function (d) { return utils_1.isPresent(d); })
                .map(function (d) { return result = result.concat(_this.compileDirectiveAndAllChilds(d)); });
        }
        return result;
    };
    RuntimeCompiler.prototype._compileDirective = function (directive) {
        var metadata = this._resolver.resolve(directive);
        return CompileDirective.create(directive, metadata);
    };
    RuntimeCompiler = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(resolver_1.DirectiveResolver)), 
        __metadata('design:paramtypes', [resolver_1.DirectiveResolver])
    ], RuntimeCompiler);
    return RuntimeCompiler;
}());
exports.RuntimeCompiler = RuntimeCompiler;
var CompileDirective = (function () {
    function CompileDirective(type, metadata) {
        this.type = type;
        this.isComponent = metadata instanceof metadata_1.ComponentMetadata;
        var mergedInputs = {};
        metadata.inputs.forEach(function (i) {
            var parts = utils_1.splitAtColon(i, [i, i]);
            assert_1.assert(!utils_1.isPresent(mergedInputs[parts[1]]), "The input parameter " + parts[1] + " is already defined on " + utils_1.stringify(type));
            mergedInputs[parts[1]] = parts[0];
        });
        this.inputs = mergedInputs;
        var mergedOutputs = {};
        metadata.outputs.forEach(function (i) {
            var parts = utils_1.splitAtColon(i, [i, i]);
            assert_1.assert(!utils_1.isPresent(mergedOutputs[parts[1]]), "The output parameter " + parts[1] + " is already defined on " + utils_1.stringify(type));
            mergedOutputs[parts[1]] = parts[0];
        });
        this.outputs = mergedOutputs;
        this.directives = metadata.directives;
        this.providers = metadata.providers;
        this.selector = metadata.selector;
        if (metadata instanceof metadata_1.ComponentMetadata) {
            this.changeDetection = metadata.changeDetection || change_detection_1.ChangeDetectionStrategy.Default;
            this.host = metadata.host;
            this.templateUrl = metadata.templateUrl;
            this.template = metadata.template;
            this.styleUrls = metadata.styleUrls;
            this.styles = metadata.styles;
        }
    }
    CompileDirective.create = function (type, metadata) {
        return new CompileDirective(type, metadata);
    };
    return CompileDirective;
}());
exports.CompileDirective = CompileDirective;
//# sourceMappingURL=compiler.js.map