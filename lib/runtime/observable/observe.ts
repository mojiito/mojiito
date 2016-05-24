import { Meta } from '../../core/meta/meta';
import { watchKey } from '../../core/watch/watch';
import { Observer } from './observer';

export function observe(obj: Function | Object | Array<any>, keyOrPath: string, callback?: Function, thisArg?: any): Observer {
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
        } else if(typeof source === 'function' || typeof source === 'object') {
            source = (<any>source)[part];
        }
    }
}