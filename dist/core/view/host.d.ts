import { View } from './view';
import { ElementRef } from './element';
import { Injector } from '../di/di';
import { ChangeDetectorStatus } from '../change_detection/change_detection';
export declare class HostElement {
    private _hostView;
    private _nestedViews;
    private _injector;
    hostView: View;
    elementRef: ElementRef;
    parent: any;
    injector: Injector;
    constructor(hostView: View, injector: Injector, cdStatus?: ChangeDetectorStatus);
    attachView(view: View, viewIndex: number): void;
    detachView(viewIndex: number): void;
}
