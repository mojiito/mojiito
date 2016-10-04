import { InjectableMetadata } from '../di/metadata';
import { ChangeDetectionStrategy } from '../change_detection/change_detection';
export declare class DirectiveMetadata extends InjectableMetadata {
    selector: string;
    inputs: string[];
    outputs: string[];
    providers: any[];
    directives: any[];
    constructor({selector, inputs, outputs, providers, directives}?: {
        selector?: string;
        inputs?: string[];
        outputs?: string[];
        providers?: any[];
        directives?: any[];
    });
    toString(): string;
}
/**
 * The component directive allows you to attach behavior (a class) to elements in the DOM
 * using a class decorator or the {@link registerDirective} function.
 *
 * A component directive contains metadata (including the elements selector)
 * and a class which will be attached to the elements.
 *
 * Assume this HTML Template or DOM
 * ```html
 * <form class="form">
 *   <div>
 *     <div my-component>
 *       <div>
 *         <div></div>
 *       </div>
 *       <div></div>
 *     </div>
 *   </div>
 * </form>
 * ```
 *
 * ```typescript
 * @Component({ selector: '[my-component]'})
 * class MyComponent {
 *  // Your Code
 * }
 * ```
 *
 * @export
 * @class ComponentMetadata
 * @extends {DirectiveMetadata}
 */
export declare class ComponentMetadata extends DirectiveMetadata {
    changeDetection: ChangeDetectionStrategy;
    host: {
        [key: string]: string;
    };
    templateUrl: string;
    template: string;
    styleUrls: string[];
    styles: string[];
    constructor({changeDetection, selector, inputs, outputs, host, providers, directives, templateUrl, template, styleUrls, styles}?: {
        changeDetection?: ChangeDetectionStrategy;
        selector?: string;
        inputs?: string[];
        outputs?: string[];
        host?: {
            [key: string]: string;
        };
        providers?: any[];
        directives?: any[];
        templateUrl?: string;
        template?: string;
        styleUrls?: string[];
        styles?: string[];
    });
    toString(): string;
}
export declare class InputMetadata {
    bindingPropertyName: string;
    constructor(bindingPropertyName?: string);
    toString(): string;
}
export declare class OutputMetadata {
    bindingPropertyName: string;
    constructor(bindingPropertyName?: string);
    toString(): string;
}
