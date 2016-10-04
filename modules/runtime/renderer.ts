import { Injectable, Inject } from '../core/di/di';
import { DOMTraverser } from './dom_traverser';

@Injectable()
export class RuntimeRenderer {
    constructor(
        @Inject(DOMTraverser) private _traverser: DOMTraverser
    ) {}

    parseDOM(root: Element, context?: any) {
        this._traverser.traverse(root, context);
    }
}