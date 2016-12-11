/**
 * Mojito's dependency injection basically a simpler version of Angular's DI.
 * All the credits and respect to the Angular team.
 *
 * TODO: Insert stuff...
 */
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
var decorators_1 = require('./decorators');
var decorators_2 = require('./decorators');
exports.Injectable = decorators_2.Injectable;
exports.Inject = decorators_2.Inject;
var injector_1 = require('./injector');
exports.Injector = injector_1.Injector;
var provider_1 = require('./provider');
exports.Provider = provider_1.Provider;
exports.ResolvedProvider = provider_1.ResolvedProvider;
exports.provide = provider_1.provide;
var forward_ref_1 = require('./forward_ref');
exports.forwardRef = forward_ref_1.forwardRef;
var OpaqueToken = (function () {
    function OpaqueToken(_desc) {
        this._desc = _desc;
    }
    OpaqueToken.prototype.toString = function () { return "Token " + this._desc; };
    OpaqueToken = __decorate([
        decorators_1.Injectable(), 
        __metadata('design:paramtypes', [String])
    ], OpaqueToken);
    return OpaqueToken;
}());
exports.OpaqueToken = OpaqueToken;
//# sourceMappingURL=di.js.map