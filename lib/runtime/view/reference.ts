import { View } from './view';

export class ViewRef<V extends View> {
    constructor(private _view: V) { }
    
    get internalView(): V { return this._view; }

    destroy() { return this._view.destroy(); }
}
