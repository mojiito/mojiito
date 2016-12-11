import { RuntimeRenderer } from './renderer';
import { RuntimeCompiler } from './compiler';
import { NodeVisitor, getVisitorForContext, ContextRef } from './node_visitor';
export { RuntimeRenderer, RuntimeCompiler, NodeVisitor, getVisitorForContext, ContextRef };
export declare const RUNTIME_PROVIDERS: typeof RuntimeCompiler[];
