/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * Modified by Thomas Pink for the usage in Mojito
 */

import { assert } from '../../debug/debug';
import { EventEmitter } from '../async/events';

export class ZoneWrapper {

    private _innerZone: Zone;
    private _outerZone: Zone;
    private _onEnter: () => void;
    private _onLeave: () => void;
    private _onError: (error: any) => void;
    private _setMicrotask: (hasMicrotasks: boolean) => void;
    private _setMacrotask: (hasMacrotasks: boolean) => void;

    constructor(
        {onEnter, onLeave, setMicrotask, setMacrotask, onError}: {
            onEnter: () => void,
            onLeave: () => void,
            setMicrotask: (hasMicrotasks: boolean) => void,
            setMacrotask: (hasMacrotasks: boolean) => void,
            onError: (error: Error) => void
        }
    ) {
        this._onEnter = onEnter || function () { };
        this._onLeave = onLeave || function () { };
        this._setMicrotask = setMicrotask || function (hasMicrotasks: boolean) { };
        this._setMacrotask = setMacrotask || function (hasMacrotasks: boolean) { };


        assert(!!Zone, `Mojito requires zone.js. Please install and provide it!`);
        this._outerZone = Zone.current;
        this._innerZone = this._outerZone.fork({
            name: 'mojito',
            properties: <any>{ 'isMojitoZone': true },
            onInvokeTask: (delegate: ZoneDelegate, current: Zone, target: Zone, task: Task, applyThis: any, applyArgs: any): any => {
                try {
                    this._onEnter();
                    return delegate.invokeTask(target, task, applyThis, applyArgs);
                } finally {
                    this._onLeave();
                }
            },
            onInvoke: (delegate: ZoneDelegate, current: Zone, target: Zone, callback: Function, applyThis: any, applyArgs: any[], source: string): any => {
                try {
                    this._onEnter();
                    return delegate.invoke(target, callback, applyThis, applyArgs, source);
                } finally {
                    this._onLeave();
                }
            },

            onHasTask: (delegate: ZoneDelegate, current: Zone, target: Zone, hasTaskState: HasTaskState) => {
                delegate.hasTask(target, hasTaskState);
                if (current == target) {
                    if (hasTaskState.change == 'microTask') {
                        this._setMicrotask(hasTaskState.microTask);
                    } else if (hasTaskState.change == 'macroTask') {
                        this._setMacrotask(hasTaskState.macroTask);
                    }
                }
            },

            onHandleError: (delegate: ZoneDelegate, current: Zone, target: Zone, error: any): boolean => {
                delegate.handleError(target, error);
                this._onError(error);
                return false;
            }
        });
    }

    runInner(fn: () => any): any { return this._innerZone.run(fn); };
    runInnerGuarded(fn: () => any): any { return this._innerZone.runGuarded(fn); };
    runOuter(fn: () => any): any { return this._outerZone.run(fn); };
}

export class ZoneService {

    private _zoneWrapper: ZoneWrapper;
    private _nestedLevel: number = 0;
    private _hasPendingMicrotasks: boolean = false;
    private _hasPendingMacrotasks: boolean = false;
    private _isStable = true;
    private _onUnstable: EventEmitter<any> = new EventEmitter();
    private _onMicrotaskEmpty: EventEmitter<any> = new EventEmitter();
    private _onStable: EventEmitter<any> = new EventEmitter();
    private _onErrorEvents: EventEmitter<any> = new EventEmitter();

    constructor() {
        this._zoneWrapper = new ZoneWrapper({
            onEnter: () => {
                this._nestedLevel++;
                if (this._isStable) {
                    this._isStable = false;
                    this._onUnstable.emit(null);
                }
            },
            onLeave: () => {
                this._nestedLevel--;
                this._checkStable();
            },
            setMicrotask: (hasMicrotasks: boolean) => {
                this._hasPendingMicrotasks = hasMicrotasks;
                this._checkStable();
            },
            setMacrotask: (hasMacrotasks: boolean) => { this._hasPendingMacrotasks = hasMacrotasks; },
            onError: (error: Error) => this._onErrorEvents.emit(error)
        });
    }

    private _checkStable() {
        if (this._nestedLevel == 0) {
            if (!this._hasPendingMicrotasks && !this._isStable) {
                try {
                    this._nestedLevel++;
                    this._onMicrotaskEmpty.emit(null);
                } finally {
                    this._nestedLevel--;
                    if (!this._hasPendingMicrotasks) {
                        try {
                            this.runOutsideMojito(() => this._onStable.emit(null));
                        } finally {
                            this._isStable = true;
                        }
                    }
                }
            }
        }
    }
    /**
     * Notifies when code enters Angular Zone. This gets fired first on VM Turn.
     */
    get onUnstable(): EventEmitter<any> { return this._onUnstable; }

    /**
     * Notifies when there is no more microtasks enqueue in the current VM Turn.
     * This is a hint for Angular to do change detection, which may enqueue more microtasks.
     * For this reason this event can fire multiple times per VM Turn.
     */
    get onMicrotaskEmpty(): EventEmitter<any> { return this._onMicrotaskEmpty; }

    /**
     * Notifies when the last `onMicrotaskEmpty` has run and there are no more microtasks, which
     * implies we are about to relinquish VM turn.
     * This event gets called just once.
     */
    get onStable(): EventEmitter<any> { return this._onStable; }

    /**
     * Notify that an error has been delivered.
     */
    get onError(): EventEmitter<any> { return this._onErrorEvents; }

    /**
     * Whether there are no outstanding microtasks or microtasks.
     */
    get isStable(): boolean { return this._isStable; }

    /**
     * Whether there are any outstanding microtasks.
     */
    get hasPendingMicrotasks(): boolean { return this._hasPendingMicrotasks; }

    /**
     * Whether there are any outstanding microtasks.
     */
    get hasPendingMacrotasks(): boolean { return this._hasPendingMacrotasks; }

    /**
     * Executes the `fn` function synchronously within the Angular zone and returns value returned by
     * the function.
     *
     * Running functions via `run` allows you to reenter Angular zone from a task that was executed
     * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
     *
     * Any future tasks or microtasks scheduled from within this function will continue executing from
     * within the Angular zone.
     *
     * If a synchronous error happens it will be rethrown and not reported via `onError`.
     */
    run(fn: () => any): any { return this._zoneWrapper.runInner(fn); }

    /**
     * Same as #run, except that synchronous errors are caught and forwarded
     * via `onError` and not rethrown.
     */
    runGuarded(fn: () => any): any { return this._zoneWrapper.runInnerGuarded(fn); }

    /**
     * Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
     * the function.
     *
     * Running functions via `runOutsideAngular` allows you to escape Angular's zone and do work that
     * doesn't trigger Angular change-detection or is subject to Angular's error handling.
     *
     * Any future tasks or microtasks scheduled from within this function will continue executing from
     * outside of the Angular zone.
     *
     * Use {@link #run} to reenter the Angular zone and do work that updates the application model.
     */
    runOutsideMojito(fn: () => any): any { return this._zoneWrapper.runOuter(fn); }
}

export const ZONE_PROVIDERS = [
    ZoneService
];