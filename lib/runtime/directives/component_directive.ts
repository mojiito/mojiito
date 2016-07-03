import { ClassFactory } from '../../utils/class/class';
import { Directive, IDirectiveMetadata, DirectiveMetadataReference } from './directive';
import { Injector } from '../../runtime/injectable/injector';
import { DirectiveResolver, ComponentResolver } from '../../compiler/resolver/resolver';
import { DirectiveFactory, ComponentFactory } from '../factory/factory';

export interface IComponentMetadata extends IDirectiveMetadata {
    /**
     * Specifes the actions (events) related to the element.
     *
     * ```typescript
     * @Directive({
     *   selector: 'button',
     *   actions: {
     *     '(click)': 'onClick(event)'
     *   }
     * })
     * class MyButton {
     *     onClick(event: MouseEvent) {
     *       // your code
     *     }
     * }
     * ```
     *
     * @type {{[key: string]: string}}
     */
    actions?: { [key: string]: string };
    
    /**
     * Defines a template string which will be compiled an applied to the DOM.
     *
     * ```typescript
     * @Component({
     *   selector: 'custom-tooltip',
     *   template: `
     *      <div class="tooltip__body">
     *          Some text
     *      </div>
     *   `
     * })
     * class CustomTooltipComponent {
     *      // your code
     * }
     * ```
     *
     * @type {string}
     */
    template?: string;
    templateName?: string; // TODO: CLI Implementation
}

export class ComponentMetadataReference extends DirectiveMetadataReference {

    private _actions: { [key: string]: string };
    private _template: string;
    private _templateName: string;

    constructor(metadata: IComponentMetadata) {
        super(metadata);
        this._actions = metadata.actions;
        this._template = metadata.template;
        this._templateName = metadata.templateName;
        this._factory = ComponentFactory;
    }

    get actions() {
        return this._actions || null;
    }

    get template(): string {
        return this.template || null;
    }

    get templateName(): string {
        return this.templateName || null;
    }
}

export function Component(metadata: IComponentMetadata): ClassDecorator {
    return function (klass: ClassFactory<any>) {
        registerComponent(klass, metadata);
    }
}

export function registerComponent<C>(componentClass: ClassFactory<C>, metadata: IComponentMetadata): ComponentFactory<C> {
    let metaRef = new ComponentMetadataReference(metadata);
    let resolver = Injector.get(ComponentResolver);
    let factory = resolver.resolve(componentClass, metaRef);
    return factory;
}