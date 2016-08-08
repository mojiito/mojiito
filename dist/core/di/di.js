/**
 * Mojito's dependency injection basically a simpler version of Angular's DI.
 * All the credits and respect to the Angular team.
 *
 * TODO: Insert stuff...
 */
"use strict";
var decorators_1 = require('./decorators');
exports.Injectable = decorators_1.Injectable;
exports.Inject = decorators_1.Inject;
var injector_1 = require('./injector');
exports.Injector = injector_1.Injector;
var provider_1 = require('./provider');
exports.Provider = provider_1.Provider;
exports.ResolvedProvider = provider_1.ResolvedProvider;
exports.provide = provider_1.provide;
var forward_ref_1 = require('./forward_ref');
exports.forwardRef = forward_ref_1.forwardRef;
//# sourceMappingURL=di.js.map