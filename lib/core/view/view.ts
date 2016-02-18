import { CoreClass } from './../class/class';
import { Meta } from './../meta/meta';
import { assert } from './../../debug/debug';

export abstract class CoreView extends CoreClass {
    
    get $(): Function {
        return function(selector: string): Element | NodeListOf<Element>{
            assert(typeof selector === 'string' || typeof selector === 'undefined', 'The CoreView has to be created with an Element', TypeError);
            const element: Element = Meta.peek(this).getProperty('values', 'element');

            if (typeof selector === 'string') {
                assert(!!element.querySelectorAll, 'The element does not support querySelectorAll', TypeError);
                const elements = element.querySelectorAll(selector);
                return elements.length === 1 ? elements.item(0) : elements;
            }
            
            return element;
        }
    }

    set $(value) {
        throw new Error('Setting $ on a view is not allowed');
    }
    
    constructor(element: Element) {
        assert(element instanceof Element, 'The CoreView can only be created with an Element (HTMLElement)', TypeError);
        
        super();
        
        // set the element
        Meta.peek(this).setProperty('values', 'element', element, {
            writable: false,
            configurable: false,
            enumerable: false
        });
    }
}