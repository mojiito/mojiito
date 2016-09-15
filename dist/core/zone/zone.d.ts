import { EventEmitter } from '../async/events';
export declare class ZoneWrapper {
    private _innerZone;
    private _outerZone;
    private _onEnter;
    private _onLeave;
    private _onError;
    private _setMicrotask;
    private _setMacrotask;
    constructor({onEnter, onLeave, setMicrotask, setMacrotask, onError}: {
        onEnter: () => void;
        onLeave: () => void;
        setMicrotask: (hasMicrotasks: boolean) => void;
        setMacrotask: (hasMacrotasks: boolean) => void;
        onError: (error: Error) => void;
    });
    runInner(fn: () => any): any;
    runInnerGuarded(fn: () => any): any;
    runOuter(fn: () => any): any;
}
export declare class ZoneService {
    private _zoneWrapper;
    private _nestedLevel;
    private _hasPendingMicrotasks;
    private _hasPendingMacrotasks;
    private _isStable;
    private _onUnstable;
    private _onMicrotaskEmpty;
    private _onStable;
    private _onErrorEvents;
    constructor();
    private _checkStable();
    /**
     * Notifies when code enters Mojito Zone. This gets fired first on VM Turn.
     */
    onUnstable: EventEmitter<any>;
    /**
     * Notifies when there is no more microtasks enqueue in the current VM Turn.
     * This is a hint for Mojito to do change detection, which may enqueue more microtasks.
     * For this reason this event can fire multiple times per VM Turn.
     */
    onMicrotaskEmpty: EventEmitter<any>;
    /**
     * Notifies when the last `onMicrotaskEmpty` has run and there are no more microtasks, which
     * implies we are about to relinquish VM turn.
     * This event gets called just once.
     */
    onStable: EventEmitter<any>;
    /**
     * Notify that an error has been delivered.
     */
    onError: EventEmitter<any>;
    /**
     * Whether there are no outstanding microtasks or microtasks.
     */
    isStable: boolean;
    /**
     * Whether there are any outstanding microtasks.
     */
    hasPendingMicrotasks: boolean;
    /**
     * Whether there are any outstanding microtasks.
     */
    hasPendingMacrotasks: boolean;
    /**
     * Executes the `fn` function synchronously within the Mojito zone and returns value returned by
     * the function.
     *
     * Running functions via `run` allows you to reenter Mojito zone from a task that was executed
     * outside of the Mojito zone (typically started via {@link #runOutsideMojito}).
     *
     * Any future tasks or microtasks scheduled from within this function will continue executing from
     * within the Mojito zone.
     *
     * If a synchronous error happens it will be rethrown and not reported via `onError`.
     */
    run(fn: () => any): any;
    /**
     * Same as #run, except that synchronous errors are caught and forwarded
     * via `onError` and not rethrown.
     */
    runGuarded(fn: () => any): any;
    /**
     * Executes the `fn` function synchronously in Mojito's parent zone and returns value returned by
     * the function.
     *
     * Running functions via `runOutsideMojito` allows you to escape Mojito's zone and do work that
     * doesn't trigger Mojito change-detection or is subject to Mojito's error handling.
     *
     * Any future tasks or microtasks scheduled from within this function will continue executing from
     * outside of the Mojito zone.
     *
     * Use {@link #run} to reenter the Mojito zone and do work that updates the application model.
     */
    runOutsideMojito(fn: () => any): any;
}
