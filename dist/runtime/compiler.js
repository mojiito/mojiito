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
var resolver_1 = require('../core/directive/resolver');
var metadata_1 = require('../core/directive/metadata');
var factory_1 = require('../core/component/factory');
var di_1 = require('../core/di/di');
var RuntimeCompiler = (function () {
    function RuntimeCompiler(_resolver, _compResolver) {
        this._resolver = _resolver;
        this._compResolver = _compResolver;
        this._compiledDirectiveCache = new Map();
    }
    Object.defineProperty(RuntimeCompiler.prototype, "compiledDirectives", {
        get: function () {
            var result = [];
            this._compiledDirectiveCache.forEach(function (d) { return result.push(d); });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    RuntimeCompiler.prototype.getCompiledDirective = function (type) {
        var directive = this._compiledDirectiveCache.get(type);
        return this._compiledDirectiveCache.get(type) || this._compileDirective(type);
    };
    RuntimeCompiler.prototype.compileDirectives = function (types) {
        var _this = this;
        types.forEach(function (type) {
            _this._compileDirective(type);
        });
    };
    RuntimeCompiler.prototype._compileDirective = function (type) {
        var result;
        var metadata = this._resolver.resolve(type);
        if (metadata instanceof metadata_1.ComponentMetadata) {
            var factory = this._compResolver.resolveComponent(type);
            result = new CompiledComponentFactory(factory, metadata);
        }
        this._compiledDirectiveCache.set(type, result);
        return result;
    };
    RuntimeCompiler = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(resolver_1.DirectiveResolver)),
        __param(1, di_1.Inject(factory_1.ComponentFactoryResolver)), 
        __metadata('design:paramtypes', [resolver_1.DirectiveResolver, factory_1.ComponentFactoryResolver])
    ], RuntimeCompiler);
    return RuntimeCompiler;
}());
exports.RuntimeCompiler = RuntimeCompiler;
var CompiledDirectiveFactory = (function () {
    function CompiledDirectiveFactory(metadata) {
        this.metadata = metadata;
    }
    CompiledDirectiveFactory.prototype.create = function (injector, nativeElement) {
    };
    return CompiledDirectiveFactory;
}());
exports.CompiledDirectiveFactory = CompiledDirectiveFactory;
var CompiledComponentFactory = (function (_super) {
    __extends(CompiledComponentFactory, _super);
    function CompiledComponentFactory(_factory, metadata) {
        _super.call(this, metadata);
        this._factory = _factory;
        this.metadata = metadata;
    }
    CompiledComponentFactory.prototype.create = function (injector, nativeElement) {
        _super.prototype.create.call(this, injector, nativeElement);
    };
    return CompiledComponentFactory;
}(CompiledDirectiveFactory));
exports.CompiledComponentFactory = CompiledComponentFactory;
//# sourceMappingURL=compiler.js.map