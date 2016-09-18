import { ClassType } from '../../utils/class/class';

export class DirectiveRegistry {

    private static _directiveTypes: ClassType<any>[] = [];

    static get directiveTypes() { return this._directiveTypes; }

    static register(directiveType: ClassType<any>) {
        if (this._directiveTypes.indexOf(directiveType) === -1) {
            this._directiveTypes.push(directiveType);
        }
    }
}