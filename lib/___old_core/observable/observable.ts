import { Observer } from './observer';

export interface IObservable {
    observe(key: string, callback?: Function): Observer;
    observe(path: string, callback?: Function): Observer;
    observe(keys: Array<string>, callback?: Function): Array<Observer>;
    observe(paths: Array<string>, callback?: Function): Array<Observer>;
    unobserve(): void;
}