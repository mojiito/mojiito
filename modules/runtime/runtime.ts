import { RuntimeRenderer } from './renderer';
import { RuntimeCompiler } from './compiler';
import { DOMTraverser } from './dom_traverser';
import { NodeVisitor } from './node_visitor';


export {
    RuntimeRenderer,
    RuntimeCompiler,
    DOMTraverser,
    NodeVisitor
};
export const RUNTIME_PROVIDERS = [
    RuntimeRenderer,
    RuntimeCompiler,
    DOMTraverser
]