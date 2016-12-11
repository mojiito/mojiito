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
var di_1 = require('../core/di/di');
var dom_traverser_1 = require('../browser/dom_traverser');
var node_visitor_1 = require('./node_visitor');
var RuntimeRenderer = (function () {
    function RuntimeRenderer(_traverser) {
        this._traverser = _traverser;
    }
    RuntimeRenderer.prototype.parse = function (root, context) {
        this._traverser.traverse(root, node_visitor_1.getVisitorForContext(context), context);
    };
    RuntimeRenderer = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(dom_traverser_1.DOMTraverser)), 
        __metadata('design:paramtypes', [dom_traverser_1.DOMTraverser])
    ], RuntimeRenderer);
    return RuntimeRenderer;
}());
exports.RuntimeRenderer = RuntimeRenderer;
//# sourceMappingURL=renderer.js.map