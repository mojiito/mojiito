export class EventEmitter<T> {

    private _subscriptions: EventSubscription<T>[] = [];

    subscribe(generatorOrNext?: any, error?: any, complete?: any): EventSubscription<T>;
    subscribe(subscription: EventSubscription<T>): EventSubscription<T>;
    subscribe(generatorOrNext?: any, error?: any, complete?: any): EventSubscription<T> {
        if (generatorOrNext instanceof EventSubscription) {
            this._subscriptions.push(generatorOrNext);
        } else {
            let subscription = new EventSubscription(this, generatorOrNext, error, complete);
            this._subscriptions.push(subscription);
            return subscription;
        }
    }

    emit(value?: T) {
        this._call('subscriber', value);
    }

    error(error: any) {
        this._call('error');
    }

    complete() {
        this._call('complete');
    }

    unsubscribe(subscription: EventSubscription<T>) {
        let index = this._subscriptions.indexOf(subscription);
        if (index !== -1) {
            this._subscriptions.splice(index, 1);
            subscription.emitter = null;
        }
    }

    private _call(fnName: 'subscriber' | 'complete' | 'error', ...args: any[]) {
        for (let i = 0, max = this._subscriptions.length; i < max; i++) {
            let subscription = this._subscriptions[i];
            (<any>subscription)[fnName].call(subscription, args);
        }
    }
}

export class EventSubscription<T> {

    private _subscriber: (value?: T) => void;
    private _complete: () => void;
    private _error: (error: any) => void;

    get subscriber() {
        return this._subscriber;
    }

    get complete() {
        return this._complete;
    }

    get error() {
        return this._error;
    }

    get isSubscribed() {
        return !!this.emitter;
    }

    constructor(public emitter: EventEmitter<T>, generatorOrNext?: (value?: T) => void, error?: () => void, complete?: (error: any) => void) {
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

    unsubscribe() {
        this.emitter.unsubscribe(this);
    }
}