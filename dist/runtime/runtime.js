"use strict";
var renderer_1 = require('./renderer');
exports.RuntimeRenderer = renderer_1.RuntimeRenderer;
var compiler_1 = require('./compiler');
exports.RuntimeCompiler = compiler_1.RuntimeCompiler;
var dom_traverser_1 = require('./dom_traverser');
exports.DOMTraverser = dom_traverser_1.DOMTraverser;
var node_visitor_1 = require('./node_visitor');
exports.NodeVisitor = node_visitor_1.NodeVisitor;
exports.RUNTIME_PROVIDERS = [
    renderer_1.RuntimeRenderer,
    compiler_1.RuntimeCompiler,
    dom_traverser_1.DOMTraverser,
    node_visitor_1.NodeVisitor
];
//# sourceMappingURL=runtime.js.map