export declare class EventEmitter<T> {
    private _subscriptions;
    subscribe(generatorOrNext?: (value?: T) => void, error?: any, complete?: any): EventSubscription<T>;
    subscribe(subscription: EventSubscription<T>): EventSubscription<T>;
    emit(value?: T): void;
    error(error: any): void;
    complete(): void;
    unsubscribe(subscription: EventSubscription<T>): void;
    private _call(fnName, ...args);
}
export declare class EventSubscription<T> {
    emitter: EventEmitter<T>;
    private _subscriber;
    private _complete;
    private _error;
    subscriber: (value?: T) => void;
    complete: () => void;
    error: (error: any) => void;
    isSubscribed: boolean;
    constructor(emitter: EventEmitter<T>, generatorOrNext?: (value?: T) => void, error?: () => void, complete?: (error: any) => void);
    unsubscribe(): void;
}
