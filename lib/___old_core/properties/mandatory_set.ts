import { Meta } from '../meta/meta';
import { propertyWillChange, propertyDidChange } from './propertyEvents';

export function mandatory_set(obj: Object, propertyName: string, value: any): void;
export function mandatory_set(obj: Array<any>, propertyName: string, value: any): void;
export function mandatory_set(obj: Object | Array<any>, propertyName: string, value: any): void {
    const meta: Meta = Meta.peek(obj);
    let oldValue = meta.getProperty('values', propertyName);

    // Check if new value is different from the old one
    // if not, we do not have to do anything
    if (value === oldValue) {
        return;
    } 
    
    propertyWillChange(obj, propertyName, value, oldValue);
    meta.setProperty('values', propertyName, value);
    propertyDidChange(obj, propertyName, value, oldValue);
}