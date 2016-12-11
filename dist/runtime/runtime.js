"use strict";
var renderer_1 = require('./renderer');
exports.RuntimeRenderer = renderer_1.RuntimeRenderer;
var compiler_1 = require('./compiler');
exports.RuntimeCompiler = compiler_1.RuntimeCompiler;
var node_visitor_1 = require('./node_visitor');
exports.NodeVisitor = node_visitor_1.NodeVisitor;
exports.getVisitorForContext = node_visitor_1.getVisitorForContext;
exports.ContextRef = node_visitor_1.ContextRef;
exports.RUNTIME_PROVIDERS = [
    compiler_1.RuntimeCompiler
];
//# sourceMappingURL=runtime.js.map