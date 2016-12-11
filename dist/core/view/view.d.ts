import { Injector } from '../di/di';
import { ChangeDetectorStatus } from '../change_detection/change_detection';
import { AppElement } from './element';
import { ViewContainerRef } from './view-container';
export { ViewContainerRef };
export declare enum ViewType {
    COMPONENT = 0,
    EMBEDDED = 1,
    HOST = 2,
}
export declare class AppView<T> {
    clazz: any;
    type: ViewType;
    parentInjector: Injector;
    declarationAppElement: AppElement;
    ref: ViewRef<T>;
    context: any;
    disposables: Function[];
    viewChildren: AppView<any>[];
    viewContainerElement: AppElement;
    numberOfChecks: number;
    renderer: any;
    constructor(clazz: any, type: ViewType, parentInjector: Injector, declarationAppElement: AppElement);
    create(context: T, rootSelectorOrNode: string | any): AppElement;
    createInternal(rootSelectorOrNode: string | any): AppElement;
    selectOrCreateHostElement(elementName: string, rootSelectorOrNode: string | any): any;
    injectorGet(token: any, nodeIndex: number): any;
    injectorGetInternal(token: any, nodeIndex: number): any;
    injector(nodeIndex: number): Injector;
}
export declare class ViewRef<C> {
    private _view;
    _originalMode: ChangeDetectorStatus;
    constructor(_view: AppView<C>);
    internalView: AppView<C>;
    rootNodes: any[];
    context: any;
}
