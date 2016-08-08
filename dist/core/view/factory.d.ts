import { ClassType } from '../../utils/class/class';
import { View } from './view';
export declare class ViewFactory<V extends View> {
    private _viewType;
    constructor(viewType: ClassType<V>);
    create(element: Element): V;
}
