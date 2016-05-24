import { get } from '../../core/get/get';
import { CoreObject } from '../../core/object/object';
import { CoreArray } from '../../core/array/array';

import { observe } from './observe';
import { IObservable } from './observable';
import { Observer } from './observer';

export class ObservableObject extends CoreObject implements IObservable {

    constructor(obj?: Object) {
        super(obj);
    }

    observe(key: string, callback?: Function): Observer;
    observe(path: string, callback?: Function): Observer;
    observe(keys: Array<string>, callback?: Function): Array<Observer>;
    observe(paths: Array<string>, callback?: Function): Array<Observer>;
    observe(keysOrPaths: any, callback?: Function): any {
        return observe(this, keysOrPaths, callback, this);
    }

    unobserve() {
    }

    static create(obj?: Object): any {
        return new ObservableObject(obj);
    }
}