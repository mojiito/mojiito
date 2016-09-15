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
var di_1 = require('../../core/di/di');
var dom_parser_1 = require('./dom_parser');
var factory_1 = require('../../core/component/factory');
var component_1 = require('./hooks/component');
var event_1 = require('./hooks/event');
var binding_1 = require('./hooks/binding');
var template_variable_1 = require('./hooks/template_variable');
var Parser = (function () {
    function Parser(resolver) {
        this._domParser = new dom_parser_1.DOMParser();
        this._domParser.registerElementHook(new component_1.ComponentParserHook(resolver));
        this._domParser.registerAttributeHook(new template_variable_1.TemplateVariableParserHook());
        this._domParser.registerAttributeHook(new event_1.EventParserHook());
        this._domParser.registerAttributeHook(new binding_1.BindingParserHook());
    }
    Parser.prototype.parse = function (root, context, skipRootElement) {
        this._domParser.parseTree(root, context, skipRootElement);
    };
    Parser = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(di_1.forwardRef(function () { return factory_1.ComponentFactoryResolver; }))), 
        __metadata('design:paramtypes', [factory_1.ComponentFactoryResolver])
    ], Parser);
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map