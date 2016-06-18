import { assert } from '../../debug/debug';
import { ObservableObject } from './observableObject';
import { CoreArray } from '../../core/array/array';
import { Meta } from '../../core/meta/meta';
import { watchKey } from '../../core/watch/watch';

export interface IObserver {

    new(): IObserver;
    new(callback?: Function): IObserver;
    subscribe(callback: Function): void;
    unsubscribe(): void;
    notify(thisArg?: any): void;
}

export class Observer {

    private _callbacks: Array<{fn: Function, thisArg?: any}> = [];
    
    constructor(callback?: Function, thisArg? :any) {
        assert(arguments.length < 3, 'The observer must be created with none or one or two arguments; optional a callback function and a context');
        assert(typeof callback === 'undefined' || typeof callback === 'function', 'The callback provided to the observer must be a function', TypeError);
        
        if (callback) {
            this.subscribe(callback, thisArg);
        }
    }

    subscribe(callback: Function, thisArg? :any): void {
        assert(arguments.length === 2, 'The subscribe method must be called with one or two arguments; a callback function and optional a context');
        assert(typeof callback === 'function', 'The callback provided to the subscribe method must be a function', TypeError);
        
        this._callbacks.push({ fn: callback, thisArg });
    }
    
    unsubscribe(): void {
        
    }
    
    notify(thisArg?: any): void {
        let callbacks = this._callbacks;
        for (let i = 0, max = callbacks.length; i < max; i++) {
            let callback = callbacks[i];
            callback.fn.call(thisArg ? thisArg : callback.thisArg);
        }
    }
}

export function notifyObservers(obj: Object, key: string): void
export function notifyObservers(array: Array<any>, key: string): void
export function notifyObservers(obj: Object, key: string): void {
    let observer = <Observer>Meta.peek(obj).getProperty('observers', key);
    if (observer instanceof Observer) {
        observer.notify();
    }
}