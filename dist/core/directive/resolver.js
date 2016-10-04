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
var debug_1 = require('../../debug/debug');
var stringify_1 = require('../../utils/string/stringify');
var lang_1 = require('../../utils/lang/lang');
var di_1 = require('../di/di');
var metadata_1 = require('./metadata');
var reflection_1 = require('../reflect/reflection');
var DirectiveResolver = (function () {
    function DirectiveResolver() {
        this._directiveCache = new Map();
    }
    DirectiveResolver.prototype.resolve = function (type) {
        var metadata = this._directiveCache.get(type);
        if (!this._directiveCache.get(type)) {
            metadata = reflection_1.ClassReflection.peek(type).annotations.get(metadata_1.ComponentMetadata);
            if (!metadata) {
                metadata = reflection_1.ClassReflection.peek(type).annotations.get(metadata_1.DirectiveMetadata);
            }
            debug_1.assert(lang_1.isPresent(metadata), "Annotated metadata found on " + stringify_1.stringify(type) + " is not a DirectiveMetadata", TypeError);
            debug_1.assert(metadata instanceof metadata_1.DirectiveMetadata, "No annotated metadata found on " + stringify_1.stringify(type), TypeError);
            metadata = this._mergeWithPropertyMetadata(metadata, reflection_1.ClassReflection.peek(type).properties, type);
            this._directiveCache.set(type, metadata);
        }
        return metadata;
    };
    DirectiveResolver.prototype._mergeWithPropertyMetadata = function (dm, properties, type) {
        var _this = this;
        var inputs = [];
        var outputs = [];
        var directives = [];
        properties.forEach(function (value, index) {
            if (value instanceof metadata_1.InputMetadata) {
                if (lang_1.isPresent(value.bindingPropertyName)) {
                    inputs.push(index + ": " + value.bindingPropertyName);
                }
                else {
                    inputs.push(index);
                }
            }
            else if (value instanceof metadata_1.OutputMetadata) {
                if (lang_1.isPresent(value.bindingPropertyName)) {
                    outputs.push(index + ": " + value.bindingPropertyName);
                }
                else {
                    outputs.push(index);
                }
            }
        });
        var mergedInputs;
        if (lang_1.isPresent(dm.inputs)) {
            var dmInputs_1 = dm.inputs.map(function (def) { return _this._extractPublicName(def); });
            inputs.forEach(function (def) {
                var name = _this._extractPublicName(def);
                debug_1.assert(dmInputs_1.indexOf(name) === -1, "Input '" + name + "' defined multiple times in '" + stringify_1.stringify(type) + "'");
            });
            mergedInputs = dm.inputs.concat(inputs);
        }
        else {
            mergedInputs = inputs;
        }
        var mergedOutputs;
        if (lang_1.isPresent(dm.outputs)) {
            var dmOutputs_1 = dm.outputs.map(function (def) { return _this._extractPublicName(def); });
            outputs.forEach(function (def) {
                var name = _this._extractPublicName(def);
                debug_1.assert(dmOutputs_1.indexOf(name) === -1, "Output '" + name + "' defined multiple times in '" + stringify_1.stringify(type) + "'");
            });
            mergedOutputs = dm.outputs.concat(outputs);
        }
        else {
            mergedOutputs = outputs;
        }
        var mergedDirectives = [];
        if (lang_1.isPresent(dm.directives)) {
            dm.directives.forEach(function (d) {
                if (lang_1.isArray(d)) {
                    mergedDirectives = mergedDirectives.concat(d);
                }
                else {
                    mergedDirectives.push(d);
                }
            });
        }
        if (dm instanceof metadata_1.ComponentMetadata) {
            return new metadata_1.ComponentMetadata({
                selector: dm.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: dm.host,
                changeDetection: dm.changeDetection,
                providers: dm.providers,
                directives: mergedDirectives,
                template: dm.template,
                templateUrl: dm.templateUrl,
                styles: dm.styles,
                styleUrls: dm.styleUrls,
            });
        }
        else {
            return new metadata_1.DirectiveMetadata({
                selector: dm.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                providers: dm.providers,
                directives: dm.directives
            });
        }
    };
    DirectiveResolver.prototype._extractPublicName = function (def) {
        var parts = def.split(':');
        if (parts.length !== 2)
            return def.trim();
        return parts[1].trim();
    };
    DirectiveResolver = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveResolver);
    return DirectiveResolver;
}());
exports.DirectiveResolver = DirectiveResolver;
//# sourceMappingURL=resolver.js.map