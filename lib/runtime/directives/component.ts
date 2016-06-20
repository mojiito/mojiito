import { Directive, DirectiveMetadata } from './directive';

export interface ComponentMetadata extends DirectiveMetadata {
    /**
     * Specifes the actions (events) related to the element.
     *
     * ```typescript
     * @Component({
     *   selector: 'button',
     *   actions: {
     *     '(click)': 'onClick(event)'
     *   }
     * })
     * class ButtonComponent {
     *     onClick(event: MouseEvent) {
     *       // your code
     *     }
     * }
     * ```
     *
     * @type {{[key: string]: string}}
     */
    actions?: {[key: string]: string};

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

/**
 * Class Decorator for the Component {@link Directive} 
 * 
 * @export
 * @param {IComponentMetadata} meta Component directive metadata
 * @returns {ClassDecorator} Component class decorator
 */
export function Component(meta: ComponentMetadata): ClassDecorator {
    return Directive(meta);
}