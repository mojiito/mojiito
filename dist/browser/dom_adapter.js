"use strict";
var di_1 = require('../core/di/di');
var dom_traverser_1 = require('./dom_traverser');
exports.DOCUMENT = new di_1.OpaqueToken('DocumentToken');
exports.WINDOW = new di_1.OpaqueToken('WindowToken');
exports.DOM_PROVIDERS = [
    di_1.provide(exports.WINDOW, { useValue: window }),
    di_1.provide(exports.DOCUMENT, { useValue: window.document }),
    dom_traverser_1.DOMTraverser
];
//# sourceMappingURL=dom_adapter.js.map