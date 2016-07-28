import { ClassType } from '../../utils/class/class';

export class DirectiveRegistry {

    private static _directiveTypes: ClassType<any>[] = [];
    private static _selectors: string[] = [];

    static get selectors() { return this._selectors; }
    static get directiveTypes() { return this._directiveTypes; }

    static register(directiveType: ClassType<any>, selector: string) {
        if (this._directiveTypes.indexOf(directiveType) === -1 && this._selectors.indexOf(selector) === -1) {
            this._directiveTypes.push(directiveType);
            this._selectors.push(selector);
        }
    }

    static bySelector(selector: string): ClassType<any> {
        let index = this._selectors.indexOf(selector);
        return index !== -1 ? this._directiveTypes[index] : null;
    }
}