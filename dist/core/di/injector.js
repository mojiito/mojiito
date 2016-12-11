"use strict";
var map_1 = require('../map/map');
var provider_1 = require('./provider');
var forward_ref_1 = require('./forward_ref');
var debug_1 = require('../../debug/debug');
var utils_1 = require('../../utils/utils');
/**
 * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
 * constructor dependencies.
 *
 * @export
 * @class Injector
 */
var Injector = (function () {
    /**
     * Creates an instance of Injector.
     *
     * @param {ResolvedProvider[]} providers
     * @param {Injector} [parent=null]
     */
    function Injector(providers, parent) {
        if (parent === void 0) { parent = null; }
        this._parent = null;
        this._providers = [];
        this._values = new map_1.CoreMap();
        this._parent = parent;
        this._providers = providers;
    }
    Object.defineProperty(Injector.prototype, "parent", {
        /**
         * The parent of this injector
         *
         * @readonly
         * @type {Injector}
         */
        get: function () {
            return this._parent || null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Turns an array of provider definitions into an array of resolved providers.
     *
     * @static
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @returns {ResolvedProvider[]}
     */
    Injector.resolve = function (providers) {
        return provider_1.resolveProviders(providers);
    };
    /**
     * Resolves an array of providers and creates an injector from those providers.
     *
     * @static
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @param {Injector} [parent=null]
     * @returns
     */
    Injector.resolveAndCreate = function (providers, parent) {
        if (parent === void 0) { parent = null; }
        var resolvedProviders = Injector.resolve(providers);
        return Injector.fromResolvedProviders(resolvedProviders, parent);
    };
    /**
     * Creates an injector from previously resolved providers.
     *
     * @static
     * @param {ResolvedProvider[]} providers
     * @param {Injector} [parent=null]
     * @returns
     */
    Injector.fromResolvedProviders = function (providers, parent) {
        if (parent === void 0) { parent = null; }
        return new Injector(providers, parent);
    };
    /**
     * Resolves an array of providers and creates a child injector from those providers.
     *
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @returns {Injector}
     */
    Injector.prototype.resolveAndCreateChild = function (providers) {
        var resolvedProviders = Injector.resolve(providers);
        return this.createChildFromResolved(resolvedProviders);
    };
    /**
     * Creates a child injector from previously resolved providers.
     *
     * @param {ResolvedProvider[]} providers
     * @returns {Injector}
     */
    Injector.prototype.createChildFromResolved = function (providers) {
        return Injector.fromResolvedProviders(providers, this);
    };
    /**
     * Gets the value of the resolved provider matching the token
     *
     * @param {*} token
     * @returns {*}
     */
    Injector.prototype.get = function (token) {
        if (token === Injector) {
            return this;
        }
        var value = this._values.get(token);
        if (value) {
            return value;
        }
        for (var i = 0, max = this._providers.length; i < max; i++) {
            var provider = this._providers[i];
            if (provider.token === token) {
                var resolvedFactory = provider.resolvedFactory;
                var resolvedDepts = [];
                for (var j = 0, max_1 = resolvedFactory.dependencies.length; j < max_1; j++) {
                    var deptToken = forward_ref_1.resolveForwardRef(resolvedFactory.dependencies[j]);
                    var dept = this.get(deptToken);
                    debug_1.assert(!!dept, "Could not resolve \"" + utils_1.stringify(deptToken) + "\" injected into \"" + utils_1.stringify(token) + "\"! \nPlease make shure \"" + utils_1.stringify(deptToken) + "\" is provided, the class \"" + utils_1.stringify(token) + "\" is marked as @Injectable() and the parameters are injected with @Inject");
                    resolvedDepts.push(dept);
                }
                value = resolvedFactory.factory(resolvedDepts);
                debug_1.assert(utils_1.isDefined(value), "Could not resolve " + utils_1.stringify(token) + "! Make shure it is provided in a Injector.");
                this._values.set(token, value);
                return value;
            }
        }
        return this._parent ? this._parent.get(token) : null;
    };
    return Injector;
}());
exports.Injector = Injector;
//# sourceMappingURL=injector.js.map