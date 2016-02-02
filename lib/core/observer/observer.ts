export interface IObservable {
    _subscribe(key: string, callback: Function): Observer;
    _dispose(observer: Observer): boolean;
}

export class Observable implements IObservable {
    _subscribe(key: string, callback: Function) {
        return new Observer(this, key, callback);
    }

    _dispose(observer: Observer) {
        return false;
    }
}

export class Observer {

    constructor(private subject: Object, private key: string, private callback: Function) {

    }

    notify(newValue: any, oldValue: any) {
        this.callback.call(this.subject, newValue, oldValue);
    }
}