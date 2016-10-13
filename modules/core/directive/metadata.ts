import { assert } from '../../debug/debug';
import { stringify } from '../../utils/string/stringify';
import { InjectableMetadata } from '../di/metadata';
import { ChangeDetectionStrategy } from '../change_detection/change_detection';

export class DirectiveMetadata extends InjectableMetadata {
    selector: string;
    inputs: string[];
    outputs: string[];
    providers: any[];
    directives: any[];

    constructor(
        {
            selector, 
            inputs, 
            outputs, 
            providers,
            directives
        }: {
            selector?: string,
            inputs?: string[],
            outputs?: string[],
            providers?: any[],
            directives?: any[]
        } = {}
    ) {
        super();
        this.selector = selector;
        this.inputs = inputs;
        this.outputs = outputs;
        this.providers = providers;
        this.directives = directives;
    }

    toString(): string { return `@DirectiveMetadata()`; }
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
export class ComponentMetadata extends DirectiveMetadata {
    changeDetection: ChangeDetectionStrategy;
    host: {[key: string]: string};
    templateUrl: string;
    template: string;
    styleUrls: string[];
    styles: string[];

    constructor(
        {
            changeDetection,
            selector, 
            inputs, 
            outputs, 
            host, 
            providers, 
            directives,
            templateUrl, 
            template, 
            styleUrls, 
            styles
        }: {
            changeDetection?: ChangeDetectionStrategy,
            selector?: string,
            inputs?: string[],
            outputs?: string[],
            host?: {[key: string]: string},
            providers?: any[],
            directives?: any[],
            templateUrl?: string,
            template?: string,
            styleUrls?: string[],
            styles?: string[],
        } = {}
    ) {
        super({ selector, inputs, outputs, providers, directives });
        this.changeDetection = changeDetection;
        this.host = host;
        this.templateUrl = templateUrl;
        this.template = template;
        this.styles = styles;
        this.styleUrls = styleUrls;
    }

    toString(): string { return `@ComponentMetadata()`; }
}


export class InputMetadata {
    constructor(public bindingPropertyName?: string) { }
    toString(): string { return `@InputMetadata(${stringify(this.bindingPropertyName)})`; }
}

export class OutputMetadata {
    constructor(public bindingPropertyName?: string) { }
    toString(): string { return `@OutputMetadata(${stringify(this.bindingPropertyName)})`; }
}