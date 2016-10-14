import { Injectable, Inject } from '../core/di/di';
import { DOMTraverser } from './dom_traverser';
import { getVisitorForContext } from './node_visitor';

@Injectable()
export class RuntimeRenderer {
    constructor(
        @Inject(DOMTraverser) private _traverser: DOMTraverser
    ) {}

    parse(root: Element, context: any) {
        this._traverser.traverse(root, getVisitorForContext(context), context);
    }
}