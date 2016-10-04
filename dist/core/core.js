"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var application_1 = require('./application/application');
exports.bootstrap = application_1.bootstrap;
exports.Application = application_1.Application;
__export(require('./lifecycle/lifecycle_hooks'));
var decorators_1 = require('./directive/decorators');
exports.Input = decorators_1.Input;
exports.Output = decorators_1.Output;
exports.Component = decorators_1.Component;
var element_ref_1 = require('./view/element-ref');
exports.ElementRef = element_ref_1.ElementRef;
__export(require('./di/di'));
var events_1 = require('./async/events');
exports.EventEmitter = events_1.EventEmitter;
//# sourceMappingURL=core.js.map