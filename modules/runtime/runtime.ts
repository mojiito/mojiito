import { RuntimeRenderer } from './renderer';
import { RuntimeCompiler } from './compiler';
import { NodeVisitor, getVisitorForContext, ContextRef } from './node_visitor';

export {
    RuntimeRenderer,
    RuntimeCompiler,
    NodeVisitor, getVisitorForContext, ContextRef
};
export const RUNTIME_PROVIDERS = [
    RuntimeCompiler
]