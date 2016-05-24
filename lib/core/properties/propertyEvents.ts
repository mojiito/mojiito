// import { notifyObservers } from '../../runtime/observer/observer';

export function propertyWillChange(obj: Object, key: string): void;
export function propertyWillChange(array: Array<any>, key: string): void;
export function propertyWillChange(obj: Object | Array<any>, key: string): void {
}

export function propertyDidChange(obj: Object, key: string): void;
export function propertyDidChange(obj: Array<any>, key: string): void;
export function propertyDidChange(obj: Object | Array<any>, key: string): void {
    // notifyObservers(obj, key);
}