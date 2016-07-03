import { Meta } from '../../core/meta/meta';
import { assert } from './../../debug/debug';
import { ObservableObject } from '../../core/observable/observableObject';


export abstract class View extends ObservableObject {

    constructor() {
        super();
    }

    $(): Element;    
    $(selector: string): NodeListOf<Element>;    
    $(selector?: string): Element | NodeListOf<Element> {
        let root = <Element>this.getMeta().getProperty('view', 'root');
        if (typeof selector === 'string') {
            return root.querySelectorAll(selector);
        }
        return root;
    }

    destroy() {}
    onDestroy() {};
}

