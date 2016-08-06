import { notifyObservers } from '../observable/observer';

export function propertyWillChange(obj: Object, key: string, newValue: any, oldValue?: any): void;
export function propertyWillChange(array: Array<any>, key: string, newValue: any, oldValue?: any): void;
export function propertyWillChange(obj: any, key: string, newValue: any, oldValue?: any): void {
    if (typeof obj.propertyWillChange === 'function') {
        obj.propertyWillChange.call(obj, key);
    }
}

export function propertyDidChange(obj: Object, key: string, newValue: any, oldValue?: any): void;
export function propertyDidChange(obj: Array<any>, key: string, newValue: any, oldValue?: any): void;
export function propertyDidChange(obj: any, key: string, newValue: any, oldValue?: any): void {
    if (typeof obj.propertyDidChange === 'function') {
        obj.propertyDidChange.call(obj, key);
    }
    notifyObservers(obj, key);
}