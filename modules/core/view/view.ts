import { assert, Logger, LogLevel, LogType } from '../../debug/debug';
import { isPresent } from '../../utils/utils';
// import { Parser } from '../../render/parser/parser';
import { Injector } from '../di/di';
import { ChangeDetectorStatus, ChangeDetector } from '../change_detection/change_detection';
import { AppElement } from './element';
import { ViewContainerRef } from './view-container';
import { ElementInjector } from './element_injector'

export { ViewContainerRef };

export enum ViewType {
    COMPONENT,
    EMBEDDED,
    HOST
}

export class AppView<T> {

    ref: ViewRef<T>;
    context: any;
    disposables: Function[];
    viewChildren: AppView<any>[] = [];
    viewContainerElement: AppElement = null;
    numberOfChecks: number = 0;
    renderer: any;

    constructor(
        public clazz: any,
        // public componentType: any,
        public type: ViewType,
        public parentInjector: Injector,
        public declarationAppElement: AppElement
        // public cdMode: ChangeDetectorStatus
    ) {
        this.ref = new ViewRef(this);
        // if (type === ViewType.COMPONENT || type === ViewType.HOST) {
        //     this.renderer = viewUtils.renderComponent(componentType);
        // } else {
        //     this.renderer = declarationAppElement.parentView.renderer;
        // }
    }

    create(context: T, rootSelectorOrNode: string | any): AppElement {
        this.context = context;
        return this.createInternal(rootSelectorOrNode);
    }

    createInternal(rootSelectorOrNode: string | any): AppElement { return null; }

    selectOrCreateHostElement(elementName: string, rootSelectorOrNode: string | any): any {
        let hostElement: any;
        if (isPresent(rootSelectorOrNode)) {
            // hostElement = this.renderer.selectRootElement(rootSelectorOrNode, debugInfo);
            hostElement = rootSelectorOrNode;
        } else {
            Logger.log(LogLevel.debug, 'UNIMPLEMENTED FEATURE: Element creation will be supported in the future, when the template functionality is implemented');
            hostElement = null;
            //   hostElement = this.renderer.createElement(null, elementName, debugInfo);
        }
        return hostElement;
    }

    injectorGet(token: any, nodeIndex: number): any {
        return this.injectorGetInternal(token, nodeIndex);
    }

    injectorGetInternal(token: any, nodeIndex: number): any {
        return undefined;
    }

    injector(nodeIndex: number): Injector {
        if (isPresent(nodeIndex)) {
            return new ElementInjector(this, nodeIndex);
        } else {
            return this.parentInjector;
        }
    }

}

export class ViewRef<C> { //implements ChangeDetector {
    _originalMode: ChangeDetectorStatus;

    constructor(private _view: AppView<C>) {
        this._view = _view;
        // this._originalMode = this._view.cdMode;
    }

    get internalView(): AppView<C> { return this._view; }
    get rootNodes(): any[] { return null; /* this._view.flatRootNodes;*/ }
    get context() { return this._view.context; }
    // get destroyed(): boolean { return this._view.destroyed; }
}