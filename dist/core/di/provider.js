"use strict";
var reflection_1 = require('../reflect/reflection');
var metadata_1 = require('./metadata');
var forward_ref_1 = require('./forward_ref');
var debug_1 = require('../../debug/debug');
var stringify_1 = require('../../utils/string/stringify');
/**
 * Describes how the {@link Injector} should instantiate a given token.
 *
 * @export
 * @class Provider
 */
var Provider = (function () {
    function Provider(token, _a) {
        var useClass = _a.useClass, useValue = _a.useValue, useFactory = _a.useFactory, dependencies = _a.dependencies;
        this.token = token;
        this.useClass = useClass;
        this.useValue = useValue;
        this.useFactory = useFactory;
        this.dependencies = dependencies;
    }
    return Provider;
}());
exports.Provider = Provider;
/**
 * Creates a {@link Provider}.
 *
 * @export
 * @param {*} token
 * @param {{
 *     useClass?: ClassType<any>,
 *     useValue?: any,
 *     useFactory?: Function,
 *     dependencies?: Object[],
 * }} {useClass, useValue, useFactory, dependencies}
 * @returns {Provider}
 */
function provide(token, _a) {
    var useClass = _a.useClass, useValue = _a.useValue, useFactory = _a.useFactory, dependencies = _a.dependencies;
    return new Provider(token, {
        useClass: useClass,
        useValue: useValue,
        useFactory: useFactory,
        dependencies: dependencies,
    });
}
exports.provide = provide;
/**
 * An internal resolved representation of a {@link Provider} used by the {@link Injector}.
 *
 * @export
 * @class ResolvedProvider
 */
var ResolvedProvider = (function () {
    function ResolvedProvider(token, resolvedFactory) {
        this._token = token;
        this._resolvedFactory = resolvedFactory;
    }
    Object.defineProperty(ResolvedProvider.prototype, "token", {
        get: function () {
            return this._token;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResolvedProvider.prototype, "resolvedFactory", {
        get: function () {
            return this._resolvedFactory;
        },
        enumerable: true,
        configurable: true
    });
    return ResolvedProvider;
}());
exports.ResolvedProvider = ResolvedProvider;
/**
 * Resolves an array of Providers or stuff that can be converted to a Provider
 *
 * @internal
 * @export
 * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
 * @returns {ResolvedProvider[]}
 */
function resolveProviders(providers) {
    var resolved = [];
    for (var i = 0, max = providers.length; i < max; i++) {
        var p = providers[i];
        if (p instanceof Provider) {
            resolved.push(resolveProvider(p));
        }
        else if (p instanceof Function) {
            resolved.push(resolveProvider(provide(p, { useClass: p })));
        }
        else if (Array.isArray(p)) {
            resolveProviders(p).map(function (resolvedP) { return resolved.push(resolvedP); });
        }
        else {
            throw new TypeError(p + " is not a valid provider!");
        }
    }
    return resolved;
}
exports.resolveProviders = resolveProviders;
/**
 * Resolves a single Provider and returns an ResolvedProvider
 *
 * @internal
 * @export
 * @param {Provider} provider
 * @returns {ResolvedProvider}
 */
function resolveProvider(provider) {
    return new ResolvedProvider(provider.token, resolveFactory(provider));
}
exports.resolveProvider = resolveProvider;
/**
 * An internal resolved representation of a factory function created by resolving {@link Provider}.
 *
 * A ResolvedFactory is basically a function which creates
 * and returns the item (class, value,.. ) provided.
 *
 * @export
 * @class ResolvedFactory
 */
var ResolvedFactory = (function () {
    function ResolvedFactory(factory, dependencies) {
        this._dependencies = [];
        this._factoryFn = factory;
        this._dependencies = dependencies;
    }
    Object.defineProperty(ResolvedFactory.prototype, "factory", {
        get: function () {
            return this._factoryFn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResolvedFactory.prototype, "dependencies", {
        get: function () {
            return this._dependencies || [];
        },
        enumerable: true,
        configurable: true
    });
    return ResolvedFactory;
}());
exports.ResolvedFactory = ResolvedFactory;
function resolveFactory(provider) {
    var factoryFn;
    var dependencies = [];
    if (provider.useClass) {
        var useClass_1 = forward_ref_1.resolveForwardRef(provider.useClass);
        dependencies = dependenciesForClass(useClass_1);
        factoryFn = function (dependecies) {
            if (dependecies === void 0) { dependecies = []; }
            return new (Function.prototype.bind.apply(useClass_1, [null].concat(dependecies)));
        };
    }
    else if (provider.useFactory) {
        factoryFn = provider.useFactory;
    }
    else {
        factoryFn = function () { return provider.useValue; };
    }
    return new ResolvedFactory(factoryFn, dependencies);
}
exports.resolveFactory = resolveFactory;
/**
 * Looks up and returns the dependecies as an array for an annotated class.
 *
 * @export
 * @param {ClassType<any>} annotatedClass
 * @returns {any[]}
 */
function dependenciesForClass(annotatedClass) {
    var dependecies = [];
    var dependencyTokens = reflection_1.ClassReflection.peek(annotatedClass).parameters.filter(function (value) { return value instanceof metadata_1.InjectMetadata; });
    if (Array.isArray(dependencyTokens) && dependencyTokens.length) {
        var isInjectable_1 = false;
        reflection_1.ClassReflection.peek(annotatedClass).annotations.forEach(function (value) {
            if (value instanceof metadata_1.InjectableMetadata) {
                isInjectable_1 = true;
            }
        });
        debug_1.assert(!!isInjectable_1, "Cannot resolve all parameters for " + stringify_1.stringify(annotatedClass) + "! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject");
        for (var i = 0, max = dependencyTokens.length; i < max; i++) {
            var dep = dependencyTokens[i];
            if (dep instanceof metadata_1.InjectMetadata) {
                dependecies.push(dep.token);
            }
        }
    }
    return dependecies;
}
exports.dependenciesForClass = dependenciesForClass;
//# sourceMappingURL=provider.js.map