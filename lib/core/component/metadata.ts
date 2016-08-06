import { assert } from '../../debug/debug';
import { stringify } from '../../utils/string/stringify';
import { InjectableMetadata } from '../di/metadata';
import { ChangeDetectionStrategy } from '../change_detection/change_detection';

export class DirectiveMetadata extends InjectableMetadata {
    selector: string;
    inputs: string[];
    outputs: string[];
    host: {[key: string]: string};
    providers: any[];

    constructor(
        {
            selector, 
            inputs, 
            outputs, 
            host, 
            providers
        }: {
            selector?: string,
            inputs?: string[],
            outputs?: string[],
            host?: {[key: string]: string},
            providers?: any[]
        } = {}
    ) {
        super();

        // Check if a selector is specified in the metadata.
        // Every directive must have a selector
        assert(typeof selector === 'string',
            `The directive metadata object on your class must specify a selector!`,
            TypeError);

        selector = selector.trim();

        // Check if selector contains only one level of dom nodes
        // Ok: .my-selector
        // Not allowed: .parent .my-selector
        assert(selector.indexOf(' ') === -1,
            `The selector "${selector}" contains more than one levels of nodes. Only one is allowed!`,
            SyntaxError);

        // Check if selector is valid
        assert(!!selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/),
            `The directive selector "${selector}" is not valid`,
            SyntaxError);

        // Parsing the selector string to an array
        // 'my-element.class1#id[attribute1].class2[attribute2="value"]'
        // to
        // ["my-element", ".class1", "#id", "[attribute1]", ".class2", "[attribute2="value"]"]   
        let selectorList: string[] = selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');

        for (let i = 0, max = selectorList.length; i < max; i++) {
            let selectorPart = selectorList[i];
            if (!selectorPart.length) {
                continue;
            }

            // Check if the selector contains element names whicht are not allowed
            // eg. custom elements without a "-" in it
            assert(
                !selectorPart.match(/^\w+(-\w+)*$/) || !(document.createElement(selectorPart) instanceof HTMLUnknownElement),
                `The selector "${selector}" contains an element name "${selectorPart}" which is not allowed. 
                If you are using a custom element, there has to be a "-" char in it. E.g.: my-component`,
                SyntaxError);
        }

        this.selector = selector;
        this.inputs = inputs;
        this.outputs = outputs;
        this.host = host;
        this.providers = providers;
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
            templateUrl?: string,
            template?: string,
            styleUrls?: string[],
            styles?: string[],
        } = {}
    ) {
        super({ selector, inputs, outputs, host, providers });
        this.changeDetection = changeDetection;
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