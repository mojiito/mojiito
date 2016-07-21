import { ClassType } from '../../utils/class/class';

export class ComponentRegistry {

    private static _componentTypes: ClassType<any>[] = [];
    private static _selectors: string[] = [];

    static get selectors() { return this._selectors; }
    static get componentTypes() { return this._componentTypes; }

    static register(componentType: ClassType<any>, selector: string) {
        if (this._componentTypes.indexOf(componentType) === -1 && this._selectors.indexOf(selector) === -1) {
            this._componentTypes.push(componentType);
            this._selectors.push(selector);
        }
    }

    static bySelector(selector: string): ClassType<any> {
        let index = this._selectors.indexOf(selector);
        return index !== -1 ? this._componentTypes[index] : null;
    }
}