/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * Modified by Thomas Pink for the usage in Mojito
 */
"use strict";
var debug_1 = require('../../debug/debug');
var events_1 = require('../async/events');
var ZoneWrapper = (function () {
    function ZoneWrapper(_a) {
        var _this = this;
        var onEnter = _a.onEnter, onLeave = _a.onLeave, setMicrotask = _a.setMicrotask, setMacrotask = _a.setMacrotask, onError = _a.onError;
        this._onEnter = onEnter || function () { };
        this._onLeave = onLeave || function () { };
        this._setMicrotask = setMicrotask || function (hasMicrotasks) { };
        this._setMacrotask = setMacrotask || function (hasMacrotasks) { };
        debug_1.assert(!!Zone, "Mojito requires zone.js. Please install and provide it!");
        this._outerZone = Zone.current;
        this._innerZone = this._outerZone.fork({
            name: 'mojito',
            properties: { 'isMojitoZone': true },
            onInvokeTask: function (delegate, current, target, task, applyThis, applyArgs) {
                try {
                    _this._onEnter();
                    return delegate.invokeTask(target, task, applyThis, applyArgs);
                }
                finally {
                    _this._onLeave();
                }
            },
            onInvoke: function (delegate, current, target, callback, applyThis, applyArgs, source) {
                try {
                    _this._onEnter();
                    return delegate.invoke(target, callback, applyThis, applyArgs, source);
                }
                finally {
                    _this._onLeave();
                }
            },
            onHasTask: function (delegate, current, target, hasTaskState) {
                delegate.hasTask(target, hasTaskState);
                if (current == target) {
                    if (hasTaskState.change == 'microTask') {
                        _this._setMicrotask(hasTaskState.microTask);
                    }
                    else if (hasTaskState.change == 'macroTask') {
                        _this._setMacrotask(hasTaskState.macroTask);
                    }
                }
            },
            onHandleError: function (delegate, current, target, error) {
                delegate.handleError(target, error);
                _this._onError(error);
                return false;
            }
        });
    }
    ZoneWrapper.prototype.runInner = function (fn) { return this._innerZone.run(fn); };
    ;
    ZoneWrapper.prototype.runInnerGuarded = function (fn) { return this._innerZone.runGuarded(fn); };
    ;
    ZoneWrapper.prototype.runOuter = function (fn) { return this._outerZone.run(fn); };
    ;
    return ZoneWrapper;
}());
exports.ZoneWrapper = ZoneWrapper;
var ZoneService = (function () {
    function ZoneService() {
        var _this = this;
        this._nestedLevel = 0;
        this._hasPendingMicrotasks = false;
        this._hasPendingMacrotasks = false;
        this._isStable = true;
        this._onUnstable = new events_1.EventEmitter();
        this._onMicrotaskEmpty = new events_1.EventEmitter();
        this._onStable = new events_1.EventEmitter();
        this._onErrorEvents = new events_1.EventEmitter();
        this._zoneWrapper = new ZoneWrapper({
            onEnter: function () {
                _this._nestedLevel++;
                if (_this._isStable) {
                    _this._isStable = false;
                    _this._onUnstable.emit(null);
                }
            },
            onLeave: function () {
                _this._nestedLevel--;
                _this._checkStable();
            },
            setMicrotask: function (hasMicrotasks) {
                _this._hasPendingMicrotasks = hasMicrotasks;
                _this._checkStable();
            },
            setMacrotask: function (hasMacrotasks) { _this._hasPendingMacrotasks = hasMacrotasks; },
            onError: function (error) { return _this._onErrorEvents.emit(error); }
        });
    }
    ZoneService.prototype._checkStable = function () {
        var _this = this;
        if (this._nestedLevel == 0) {
            if (!this._hasPendingMicrotasks && !this._isStable) {
                try {
                    this._nestedLevel++;
                    this._onMicrotaskEmpty.emit(null);
                }
                finally {
                    this._nestedLevel--;
                    if (!this._hasPendingMicrotasks) {
                        try {
                            this.runOutsideMojito(function () { return _this._onStable.emit(null); });
                        }
                        finally {
                            this._isStable = true;
                        }
                    }
                }
            }
        }
    };
    Object.defineProperty(ZoneService.prototype, "onUnstable", {
        /**
         * Notifies when code enters Angular Zone. This gets fired first on VM Turn.
         */
        get: function () { return this._onUnstable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZoneService.prototype, "onMicrotaskEmpty", {
        /**
         * Notifies when there is no more microtasks enqueue in the current VM Turn.
         * This is a hint for Angular to do change detection, which may enqueue more microtasks.
         * For this reason this event can fire multiple times per VM Turn.
         */
        get: function () { return this._onMicrotaskEmpty; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZoneService.prototype, "onStable", {
        /**
         * Notifies when the last `onMicrotaskEmpty` has run and there are no more microtasks, which
         * implies we are about to relinquish VM turn.
         * This event gets called just once.
         */
        get: function () { return this._onStable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZoneService.prototype, "onError", {
        /**
         * Notify that an error has been delivered.
         */
        get: function () { return this._onErrorEvents; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZoneService.prototype, "isStable", {
        /**
         * Whether there are no outstanding microtasks or microtasks.
         */
        get: function () { return this._isStable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZoneService.prototype, "hasPendingMicrotasks", {
        /**
         * Whether there are any outstanding microtasks.
         */
        get: function () { return this._hasPendingMicrotasks; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZoneService.prototype, "hasPendingMacrotasks", {
        /**
         * Whether there are any outstanding microtasks.
         */
        get: function () { return this._hasPendingMacrotasks; },
        enumerable: true,
        configurable: true
    });
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
    ZoneService.prototype.run = function (fn) { return this._zoneWrapper.runInner(fn); };
    /**
     * Same as #run, except that synchronous errors are caught and forwarded
     * via `onError` and not rethrown.
     */
    ZoneService.prototype.runGuarded = function (fn) { return this._zoneWrapper.runInnerGuarded(fn); };
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
    ZoneService.prototype.runOutsideMojito = function (fn) { return this._zoneWrapper.runOuter(fn); };
    return ZoneService;
}());
exports.ZoneService = ZoneService;
//# sourceMappingURL=zone.js.map