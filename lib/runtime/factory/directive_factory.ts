import { ClassFactory } from '../../utils/class/class';
import { DirectiveMetadataReference } from '../directives/directive'

export interface IDirectiveReference<C> {
    element: HTMLElement;
    instance: C;
    componentClass: ClassFactory<C>;
    destroy(): void;
}

export class DirectiveReference<C> implements IDirectiveReference<C> {
    private _element: HTMLElement;
    private _instance: C;
    private _directiveClass: ClassFactory<C>;

    constructor(element: HTMLElement, directiveClass: ClassFactory<C>) {
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

    get componentClass(): ClassFactory<C> {
        return this._directiveClass;
    }

    destroy() { }
}

export class DirectiveFactory<C> {

    constructor(protected klass: ClassFactory<C>, protected metaRef: DirectiveMetadataReference) { }

    create(element: HTMLElement): DirectiveReference<C> {
        return new DirectiveReference(element, this.klass);
    }
}