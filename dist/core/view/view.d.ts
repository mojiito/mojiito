import { Injector } from '../di/di';
import { ChangeDetectorStatus, ChangeDetector } from '../change_detection/change_detection';
import { AppElement } from './element';
export declare enum ViewType {
    COMPONENT = 0,
    EMBEDDED = 1,
    HOST = 2,
}
export declare class View<C> {
    type: ViewType;
    parentInjector: Injector;
    declarationAppElement: AppElement;
    cdMode: ChangeDetectorStatus;
    ref: ViewRef<C>;
    context: any;
    disposables: Function[];
    viewChildren: View<any>[];
    viewContainerElement: AppElement;
    numberOfChecks: number;
    constructor(type: ViewType, parentInjector: Injector, declarationAppElement: AppElement, cdMode: ChangeDetectorStatus);
    destroyed: boolean;
    create(context: C, givenProjectableNodes: Array<any | any[]>, rootSelectorOrNode: string | any): AppElement;
    destroy(): void;
    detectChanges(throwOnChange: boolean): void;
    detectChangesInternal(throwOnChange: boolean): void;
    markPathToRootAsCheckOnce(): void;
}
export declare class ViewRef<C> implements ChangeDetector {
    private _view;
    _originalMode: ChangeDetectorStatus;
    constructor(_view: View<C>);
    internalView: View<C>;
    rootNodes: any[];
    context: any;
    destroyed: boolean;
    markForCheck(): void;
    detach(): void;
    detectChanges(): void;
    checkNoChanges(): void;
    reattach(): void;
    onDestroy(callback: Function): void;
    destroy(): void;
}
