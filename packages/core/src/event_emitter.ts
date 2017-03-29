import { BaseError } from './facade/error';

/**
 * Basically the same as the Angular EventEmitter but without the dependency of RxJS.
 * Used by components to emit custom Events.
 */
export class EventEmitter<T> implements ISubscription {

  closed = false;
  isStopped = false;
  hasError = false;
  thrownError: any = null;
  observers: EventObserver<T>[] = [];

  constructor(private isAsync = false) { }

  /**
   * Emits the custom event with an aditional event payload.
   * @param value An optional event payload
   */
  emit(value?: T) { this.next(value); }

  /**
   * Subscribes to the custom event and sets up the handler for the underlying data stream.
   * @param {PartialObserver|Function} generatorOrNext (optional) either an observer defining all
   *  functions to be called, or the first of three possible handlers, which is the handler for
   *  each value emitted from the observable.
   * @param {Function} error (optional) a handler for a terminal event resulting from an error.
   *  If no error handler is provided, the error will be thrown as unhandled
   * @param {Function} complete (optional) a handler for a terminal event resulting from successful
   *  completion.
   * @return {ISubscription} a subscription reference to the registered handlers
   */
  subscribe(generatorOrNext?: any, error?: any, complete?: any): ISubscription {
    let schedulerFn: (t: any) => any;
    let errorFn = (err: any): any => null;
    let completeFn = (): any => null;

    if (generatorOrNext && typeof generatorOrNext === 'object') {
      schedulerFn = this.isAsync ? (value: any) => {
        setTimeout(() => generatorOrNext.next(value));
      } : (value: any) => { generatorOrNext.next(value); };

      if (generatorOrNext.error) {
        errorFn = this.isAsync ? (err) => { setTimeout(() => generatorOrNext.error(err)); } :
          (err) => { generatorOrNext.error(err); };
      }

      if (generatorOrNext.complete) {
        completeFn = this.isAsync ? () => { setTimeout(() => generatorOrNext.complete()); } :
          () => { generatorOrNext.complete(); };
      }
    } else {
      schedulerFn = this.isAsync ? (value: any) => { setTimeout(() => generatorOrNext(value)); } :
        (value: any) => { generatorOrNext(value); };

      if (error) {
        errorFn =
          this.isAsync ? (err) => { setTimeout(() => error(err)); } : (err) => { error(err); };
      }

      if (complete) {
        completeFn =
          this.isAsync ? () => { setTimeout(() => complete()); } : () => { complete(); };
      }
    }
    return this._subscribe(schedulerFn, errorFn, completeFn);
  }

  next(value?: T) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    if (!this.isStopped) {
      const { observers } = this;
      const len = observers.length;
      const copy = observers.slice();
      for (let i = 0; i < len; i++) {
        copy[i].next(value);
      }
    }
  }

  error(err: any) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    this.hasError = true;
    this.thrownError = err;
    this.isStopped = true;
    const { observers } = this;
    const len = observers.length;
    const copy = observers.slice();
    for (let i = 0; i < len; i++) {
      copy[i].error(err);
    }
    this.observers.length = 0;
  }

  complete() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    this.isStopped = true;
    const { observers } = this;
    const len = observers.length;
    const copy = observers.slice();
    for (let i = 0; i < len; i++) {
      copy[i].complete();
    }
    this.observers.length = 0;
  }

  unsubscribe() {
    this.isStopped = true;
    this.closed = true;
    this.observers = null;
  }

  private _subscribe(schedulerFn: (t: any) => any, errorFn: (err: any) => any,
    completeFn: () => any): ISubscription {

    var observer: EventObserver<T> = empty;
    observer.closed = false;
    if (schedulerFn) {
      observer.next = schedulerFn;
    }
    if (errorFn) {
      observer.error = errorFn;
    }
    if (completeFn) {
      observer.complete = completeFn;
    }
    this.observers.push(observer);

    if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else if (this.hasError) {
      observer.error(this.thrownError);
      return EventSubscription.EMPTY;
    } else if (this.isStopped) {
      observer.complete();
      return EventSubscription.EMPTY;
    } else {
      this.observers.push(observer);
      return new EventSubscription(this, observer);
    }

  }
}

export interface ISubscription {
  unsubscribe(): void;
  readonly closed: boolean;
}

export class EventSubscription<T> implements ISubscription {

  public static EMPTY: EventSubscription<null> = (function(empty: any){
    empty.closed = true;
    return empty;
  }(new EventSubscription(null, null)));

  public closed = false;

  constructor(public subject: EventEmitter<T>, public subscriber: EventObserver<T>) {}

  unsubscribe() {
    if (this.closed) {
      return;
    }

    this.closed = true;

    const subject = this.subject;
    const observers = subject.observers;

    this.subject = null;

    if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
      return;
    }

    const subscriberIndex = observers.indexOf(this.subscriber);

    if (subscriberIndex !== -1) {
      observers.splice(subscriberIndex, 1);
    }
  }
}

export interface EventObserver<T> {
  closed?: boolean;
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

const empty: EventObserver<any> = {
  closed: true,
  next(value: any): void { /* noop */ },
  error(err: any): void { throw err; },
  complete(): void { /*noop*/ }
};

export class ObjectUnsubscribedError extends BaseError {
  constructor() {
    const err: any = super('object unsubscribed');
    (<any>this).name = err.name = 'ObjectUnsubscribedError';
    (<any>this).stack = err.stack;
    (<any>this).message = err.message;
  }
}
