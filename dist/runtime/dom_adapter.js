"use strict";
var core_1 = require('../core/core');
exports.DOCUMENT = new core_1.OpaqueToken('DocumentToken');
exports.WINDOW = new core_1.OpaqueToken('WindowToken');
exports.DOM_PROVIDERS = [
    core_1.provide(exports.WINDOW, { useValue: window }),
    core_1.provide(exports.DOCUMENT, { useValue: window.document })
];
//# sourceMappingURL=dom_adapter.js.map