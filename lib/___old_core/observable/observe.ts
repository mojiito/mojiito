import { assert } from '../../debug/assert/assert';
import { Meta } from '../meta/meta';
import { watchKey } from '../watch/watch';
import { Observer } from './observer';

export function observe(obj: Object, key: string, callback?: Function, thisArg?: any): Observer;
export function observe(obj: Object, path: string, callback?: Function, thisArg?: any): Observer;
export function observe(array: Array<any>, key: string, callback?: Function, thisArg?: any): Observer;
export function observe(array: Array<any>, path: string, callback?: Function, thisArg?: any): Observer;
export function observe(fn: Function, key: string, callback?: Function, thisArg?: any): Observer;
export function observe(fn: Function, path: string, callback?: Function, thisArg?: any): Observer;
export function observe(obj: Function | Object | Array<any>, keyOrPath: string, callback?: Function, thisArg?: any): Observer {
    assert(arguments.length >= 2 && arguments.length <= 4 , 'Observe must be called with at least two and maxium four arguments; the object, array or function; the key of path which will be observed; optional a callback and a this arg');
    assert(typeof obj === 'object' || typeof obj === 'function', 'The first parameter provided to the observe function must be an object, array or function', TypeError);
    assert(typeof keyOrPath === 'string', 'The key or path provided to the observe function must be a string', TypeError);
    assert(typeof callback === 'undefined' || typeof callback === 'function', 'The callback provided to the observe function must be a function', TypeError);
    let parts = keyOrPath.split('.');
    let source = obj;
    for (let i = 0, max = parts.length; i < max; i++) {
        let part = parts[i];
        if (i >= parts.length - 1) {
            let observer = <Observer>Meta.peek(source).getProperty('observers', part);
            if (observer instanceof Observer) {
                if (typeof callback === 'function') {
                    observer.subscribe(callback, thisArg);
                }
            } else {
                observer = new Observer(callback, thisArg);
                Meta.peek(source).setProperty('observers', part, observer);
            }
            watchKey(source, part);
            return observer;
        } else if (typeof source === 'function' || typeof source === 'object') {
            debugger;
            source = (<any>source)[part];
        }
    }
}