import { assert } from '../../debug/debug';
import { isPresent } from '../../utils/utils';
import { View } from './view';
import { ElementRef } from './element';
import { Injector } from '../di/di';
import { ChangeDetector, ChangeDetectorStatus, IterableDifferFactory, IterableDiffer, KeyValueDifferFactory, KeyValueDiffer, KeyValueChangeRecord, CollectionChangeRecord } from '../change_detection/change_detection';

export class HostElement implements ChangeDetector {

    private _componentView: View = null;
    private _nestedViews: View[] = []; // TODO: Implement embedded views
    private _nativeElement: Element;
    private _component: any;
    private _injector: Injector;
    private _parent: HostElement = null;
    private _children: HostElement[] = [];
    private _cdStatus: ChangeDetectorStatus = ChangeDetectorStatus.CheckAlways;
    private _cdDefaultStatus: ChangeDetectorStatus = ChangeDetectorStatus.CheckAlways;
    private _iterableDiffer: IterableDiffer;
    private _keyValueDiffer: KeyValueDiffer;

    get component(): any { return this._component; }  
    get componentView(): View { return this.getView(-1); }
    get elementRef(): ElementRef { return new ElementRef(this._nativeElement); }
    get injector(): Injector { return this._injector; };
    get parent(): HostElement { return this._parent; }
    get cdStatus(): ChangeDetectorStatus { return this._cdStatus; }


    constructor(nativeElement: Element, parent?: HostElement, cdStatus?: ChangeDetectorStatus) {
        this._nativeElement = nativeElement;
        this._parent = parent || null;
        if(typeof cdStatus === 'number') {
            this._cdStatus = cdStatus;
            this._cdDefaultStatus = cdStatus;
        }

        let iterableDifferFactory = new IterableDifferFactory();
        let keyValueDifferFactory = new KeyValueDifferFactory();

        if (iterableDifferFactory.supports(this)) {
            this._iterableDiffer = iterableDifferFactory.create(this);
        }

        if (keyValueDifferFactory.supports(this)) {
            this._keyValueDiffer = keyValueDifferFactory.create(this);
        }
    }

    initComponent(component: any, injector: Injector) {
        this._component = component;
        this._injector = injector;
        
        let componentView = new View(this._nativeElement);
        this.attachView(componentView, -1);
    }

    registerChild(childHost: HostElement) {
        this._children.push(childHost);
    }

    attachView(view: View, viewIndex: number) {
        assert(viewIndex >= -1, `Only views with index >= 0 can be attached!`);
        if (viewIndex === -1) {
            assert(!(this._componentView instanceof View), `There is already a component view attached!`);
            this._componentView = view;
        } else {
            let view = this._nestedViews[viewIndex];
            assert(!(view instanceof View), `There is already a view attached on this view-index!`);
            this._nestedViews[viewIndex] === view;
        }
        view.attach(this);
    }

    detachView(viewIndex: number): View {
        assert(viewIndex >= 0, `You cannot detach the component view!`);
        let view = this._nestedViews[viewIndex];
        if (view instanceof View) {
            view.detach();
            this._nestedViews.splice(viewIndex, 1);
            return view;
        }
        return null;
    }

    getView(viewIndex: number = -1) {
        return viewIndex === -1 ? this._componentView : this._nestedViews[viewIndex];
    }

    destroyView(viewIndex: number) {
        let view = this.detachView(viewIndex);
        if (view instanceof View) {
            view.destroy();
        }
    }

    parseView(viewIndex = -1) {
        let view = this.getView(viewIndex);
        assert(view instanceof View, `No view with index "${viewIndex}"" found!`)
        view.parse();
    }

    parse() {
        this.parseView(-1);
    }

    markForCheck() {}
    
    detach() {
        this._cdStatus = ChangeDetectorStatus.Detached;
    }
    
    detectChanges() {
        if (this._cdStatus === ChangeDetectorStatus.Checked || this._cdStatus === ChangeDetectorStatus.Errored) {
            return;
        }
        if (this._cdStatus === ChangeDetectorStatus.Destroyed) {
            return;
        }
        // TODO: Implement Iterable differ
        // if (isPresent(this._iterableDiffer)) {
        //     let changes = this._iterableDiffer.diff(this.component);
        //     if (isPresent(changes)) {
        //         // TODO
        //     }
        // }
        if (isPresent(this._keyValueDiffer)) {
            let changes = this._keyValueDiffer.diff(this.component);
            if (isPresent(changes)) {
                changes.forEachItem(record => this.emitBinding(record));
            }
        }

        this.detectChildChanges();
        if (this._cdStatus === ChangeDetectorStatus.CheckOnce) this._cdStatus = ChangeDetectorStatus.Checked;
    }

    detectChildChanges() {
        for (let i = 0, max = this._children.length; i < max; i++) {
            let childHost = this._children[i];
            if (childHost.cdStatus === ChangeDetectorStatus.Detached) {
                continue;
            }
            childHost.detectChanges();
        }
    }
    
    checkNoChanges() { }
    
    reattach() {
        this._cdStatus = this._cdDefaultStatus;
        this.markForCheck();
    }

    emitBinding(record: KeyValueChangeRecord) {
        for (let i = 0, max = this._nestedViews.length; i < max; i++) {
            let view = this._nestedViews[i];
            if (view.isAttached) {
                view.getBindingsForKey(record.key).emit(record);
            }
        }
        this.componentView.getBindingsForKey(record.key).emit(record);
    }

}