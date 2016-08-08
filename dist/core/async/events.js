"use strict";
var EventEmitter = (function () {
    function EventEmitter() {
        this._subscriptions = [];
    }
    EventEmitter.prototype.subscribe = function (generatorOrNext, error, complete) {
        if (generatorOrNext instanceof EventSubscription) {
            this._subscriptions.push(generatorOrNext);
        }
        else {
            var subscription = new EventSubscription(this, generatorOrNext, error, complete);
            this._subscriptions.push(subscription);
            return subscription;
        }
    };
    EventEmitter.prototype.emit = function (value) {
        this._call('subscriber', value);
    };
    EventEmitter.prototype.error = function (error) {
        this._call('error');
    };
    EventEmitter.prototype.complete = function () {
        this._call('complete');
    };
    EventEmitter.prototype.unsubscribe = function (subscription) {
        var index = this._subscriptions.indexOf(subscription);
        if (index !== -1) {
            this._subscriptions.splice(index, 1);
            subscription.emitter = null;
        }
    };
    EventEmitter.prototype._call = function (fnName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var i = 0, max = this._subscriptions.length; i < max; i++) {
            var subscription = this._subscriptions[i];
            subscription[fnName].call(subscription, args);
        }
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
var EventSubscription = (function () {
    function EventSubscription(emitter, generatorOrNext, error, complete) {
        this.emitter = emitter;
        if (typeof generatorOrNext === 'function') {
            this._subscriber = generatorOrNext;
        }
        if (typeof error === 'function') {
            this._complete = error;
        }
        if (typeof error === 'function') {
            this._error = complete;
        }
    }
    Object.defineProperty(EventSubscription.prototype, "subscriber", {
        get: function () {
            return this._subscriber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventSubscription.prototype, "complete", {
        get: function () {
            return this._complete;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventSubscription.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventSubscription.prototype, "isSubscribed", {
        get: function () {
            return !!this.emitter;
        },
        enumerable: true,
        configurable: true
    });
    EventSubscription.prototype.unsubscribe = function () {
        this.emitter.unsubscribe(this);
    };
    return EventSubscription;
}());
exports.EventSubscription = EventSubscription;
//# sourceMappingURL=events.js.map