import { RuntimeRenderer } from './renderer';
import { RuntimeCompiler } from './compiler';
import { DOMTraverser } from './dom_traverser';
import { NodeVisitor } from './node_visitor';
export { RuntimeRenderer, RuntimeCompiler, DOMTraverser, NodeVisitor };
export declare const RUNTIME_PROVIDERS: (typeof RuntimeRenderer | typeof RuntimeCompiler)[];
