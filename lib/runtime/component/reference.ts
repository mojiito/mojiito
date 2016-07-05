import { ClassType } from '../../utils/class/class';

export class ComponentReference<C> {
    private _element: HTMLElement;
    private _instance: C;
    private _directiveClass: ClassType<C>;

    constructor(element: HTMLElement, directiveClass: ClassType<C>) {
        this._directiveClass = directiveClass;
        this._element = element;
        this._instance = new directiveClass(element);
    }

    get element(): HTMLElement {
        return this._element;
    }

    get instance(): C {
        return this._instance;
    }

    get componentClass(): ClassType<C> {
        return this._directiveClass;
    }

    destroy() { }
}