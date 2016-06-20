import { DirectiveMetadata } from '../../runtime/directives/directives';
import { DOMParser } from '../dom_parser/dom_parser';
import { ClassFactory } from '../../utils/utils';
import { doesSelectorMatchElement } from '../utils/dom_utils';
import { Resolver } from './resolver';

export class DirectiveResolver extends Resolver {
    
    private _class: ClassFactory<Object>;
    private _metadata: DirectiveMetadata;
    
    constructor(klass: ClassFactory<Object>, metadata: DirectiveMetadata) {
        super();
        this._class = klass;
        this._metadata = metadata;
    }

    validate(element: Element): boolean {
        if (this._metadata.selector) {
            return doesSelectorMatchElement(this._metadata.selector, element);
        }
        if (this._metadata.name) {
            
        } 
    }

    resolve(element: Element) {

    }    

}