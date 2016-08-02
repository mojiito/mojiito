import { defineProperty, isDefinedProperty } from '../properties/properties';

export function watchKey(obj: Object, key: string): void;
export function watchKey(obj: Array<any>, key: string): void;
export function watchKey(obj: Object | Array<any>, key: string): void {
    if (!isDefinedProperty(obj, key)) {
        defineProperty(obj, key);
    }
}

export function watchPath(obj: Object, path: string): void;
export function watchPath(obj: Array<any>, path: string): void;
export function watchPath(obj: Object | Array<any>, path: string): void {
    let parts = path.split('.');
    let source = obj;
    for (let i = 0, max = parts.length; i < max; i++) {
        let part = parts[i];
        
        if (i >= parts.length - 1) {
            watchKey(obj, part);
        } else if(typeof source === 'function' || typeof source === 'object') {
            source = (<any>source)[part];
        }
    }
}