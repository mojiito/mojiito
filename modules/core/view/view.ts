import { assert } from '../../debug/assert/assert';
import { isPresent } from '../../utils/utils';
// import { Parser } from '../../render/parser/parser';
import { Injector } from '../di/di';
import { ChangeDetectorStatus, ChangeDetector } from '../change_detection/change_detection';
import { AppElement } from './element';

export enum ViewType {
    COMPONENT,
    EMBEDDED,
    HOST
}

export class View<C> {

    ref: ViewRef<C>;
    context: any;
    disposables: Function[];
    viewChildren: View<any>[] = [];
    viewContainerElement: AppElement = null;
    numberOfChecks: number = 0;

    constructor(
        // public clazz: any,
        // public componentType: any,
        public type: ViewType,
        public parentInjector: Injector,
        public declarationAppElement: AppElement,
        public cdMode: ChangeDetectorStatus)
    {
        this.ref = new ViewRef(this);
    }

    get destroyed(): boolean { return this.cdMode === ChangeDetectorStatus.Destroyed; }

    create(context: C, givenProjectableNodes: Array<any | any[]>, rootSelectorOrNode: string | any): AppElement {
        this.context = context;
        return null;
    }

    destroy() { }

    detectChanges(throwOnChange: boolean): void {
        if (this.cdMode === ChangeDetectorStatus.Checked ||
            this.cdMode === ChangeDetectorStatus.Errored)
            return;
        if (this.cdMode === ChangeDetectorStatus.Destroyed) {
            // this.throwDestroyedError('detectChanges');
        }
        this.detectChangesInternal(throwOnChange);
        if (this.cdMode === ChangeDetectorStatus.CheckOnce) this.cdMode = ChangeDetectorStatus.Checked;

        this.numberOfChecks++;
    }

    detectChangesInternal(throwOnChange: boolean): void { }


    markPathToRootAsCheckOnce(): void {
        let c: View<any> = this;
        while (isPresent(c) && c.cdMode !== ChangeDetectorStatus.Detached) {
            if (c.cdMode === ChangeDetectorStatus.Checked) {
                c.cdMode = ChangeDetectorStatus.CheckOnce;
            }
            let parentEl =
                c.type === ViewType.COMPONENT ? c.declarationAppElement : c.viewContainerElement;
            c = isPresent(parentEl) ? parentEl.parentView : null;
        }
    }
}

export class ViewRef<C> implements ChangeDetector {
    _originalMode: ChangeDetectorStatus;

    constructor(private _view: View<C>) {
        this._view = _view;
        this._originalMode = this._view.cdMode;
    }

    get internalView(): View<C> { return this._view; }
    get rootNodes(): any[] { return null; /* this._view.flatRootNodes;*/ }
    get context() { return this._view.context; }
    get destroyed(): boolean { return this._view.destroyed; }

    markForCheck(): void {
        this._view.markPathToRootAsCheckOnce();
    }

    detach(): void {
        this._view.cdMode = ChangeDetectorStatus.Detached;
    }

    detectChanges(): void {
        this._view.detectChanges(false);
        // triggerQueuedAnimations();
    }
    checkNoChanges(): void {
        this._view.detectChanges(true);
    }
    reattach(): void {
        this._view.cdMode = this._originalMode;
        this.markForCheck();
    }

    onDestroy(callback: Function) {
        this._view.disposables.push(callback);
    }

    destroy() {
        // this._view.destroy();
    }
}