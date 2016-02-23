import { CoreView } from './../../core';
import { assert } from './../../debug/debug';

export abstract class Controller extends CoreView {
    
    constructor(element: Element) {
        assert(element instanceof Element, 'The Controller has to be created with an Element (HTMLElement)', TypeError);
        super(element);
    }
}
