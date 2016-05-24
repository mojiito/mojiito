import { Meta } from '../../core/meta/meta';
import { assert } from './../../debug/debug';
import { ObservableObject } from './../observable/observableObject';

export interface onDidAttachView {
    onDidAttachView(element: Element): void;
}

export interface onDidRenderView {
    onDidRenderView(element: Element): void;
}

export abstract class View extends ObservableObject {

    private _isAttached: boolean = false;
    private _isRendered: boolean = false;
    private _isDestroyed: boolean = false;

    get $(): Function {
        return function(selector: string): Element | NodeListOf<Element> {
            const element: Element = Meta.peek(this).getProperty('view', 'element');
            assert(this._isAttached, 'The views element is available after it got created. Use the `onDidCreateView` hook to detect when the view is ready.');
            assert(typeof selector === 'string' || typeof selector === 'undefined', 'The selector provided to $ has to be a string', TypeError);

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

    _attachView(element: Element): void {
        assert(!this._isAttached, 'The views is already attached. It`s not allowed to attach it again!');

        const self: any = this;
        const onDidAttachView = self['onDidAttachView'];
        
        Meta.peek(this).setProperty('view', 'element', element);
        this._isAttached = true;
        
        if (typeof onDidAttachView === 'function') {
            onDidAttachView(element);
        }
    }

    _renderView(): void { }
}