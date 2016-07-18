import { ClassType } from '../../utils/class/class';
import { ViewRef } from './reference';
import { View } from './view';

export class ViewFactory<V extends View> {

    private _viewType: ClassType<V>;
    
    constructor(viewType: ClassType<V>) {
        this._viewType = viewType;
    }

    create(element: Element): V {
        let view = new this._viewType(element);
        return view;
    }
}