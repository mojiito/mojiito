import { assert } from '../../debug/debug';
import { ClassType } from '../../utils/class/class';
import { Provider } from '../di/di';

/**
 * Specifies the metadata to describe a component class using the {@Component} decorator.
 * 
 * @export
 * @abstract
 * @class ComponentMetadata
 */
export interface ComponentMetadata {

    /**
     * Specifies the CSS Selector where the class will be instanciated on. 
     *
     * ```typescript
     * @Component({
     *   selector: 'button'
     * })
     * class MyButton {
     * }
     * ```
     *
     * ```typescript
     * @Component({
     *   selector: 'my-button'
     * })
     * class MyButton {
     * }
     * ```
     *
     * ```typescript
     * @Component({
     *   selector: '[my-button]'
     * })
     * class MyButton {
     * }
     * ```
     *
     * ```typescript
     * @Component({
     *   selector: '.btn'
     * })
     * class MyButton {
     * }
     * ```
     *
     * ```typescript
     * @Component({
     *   selector: '#my-button'
     * })
     * class MyButton {
     * }
     * ```
     * 
     * @type {string}
     */
    selector: string;

    /**
     * Specifies the actions (events) related to the element.
     *
     * ```typescript
     * @Component({
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

    /**
     * TODO: CLI Implementation
     * 
     * @type {string}
     */
    templateName?: string;

    /**
     * List of provideable classes, providers or provider like objects
     * 
     * @type {(Array<ClassType<any> | Provider | { [key: string]: any }>)}
     */
    providers?: Array<ClassType<any> | Provider | { [key: string]: any }>;
}

/**
 * Reference Object containing the component metadata
 * 
 * @export
 * @class ComponentMetadataReference
 * @template C
 */
export class ComponentMetadataReference<C> {

    private _selector: string;    
    private _actions: { [key: string]: string };
    private _template: string;
    private _templateName: string;
    private _providers: Array<ClassType<any> | Provider | { [key: string]: any }>;

    constructor(metadata: ComponentMetadata) {

        // Check if metadata is an object
        assert(
            typeof metadata === 'object' && !Array.isArray(metadata),
            `The metadata object must be an object and implement the ComponentMetadata class!`,
            TypeError
        );

        // Check if a selector is specified in the metadata.
        // Every directive must have a selector
        assert(typeof metadata.selector === 'string',
            `The metadata object must specify a selector!`,
            TypeError);

        metadata.selector = metadata.selector.trim();

        // Check if selector contains only one level of dom nodes
        // Ok: .my-selector
        // Not allowed: .parent .my-selector
        assert(metadata.selector.indexOf(' ') === -1,
            `The selector "${metadata.selector}" specified in the component metadata contains more than one levels of nodes. Only one is allowed!`,
            SyntaxError);
        
        // Check if selector is valid
        assert(!!metadata.selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/),
            `The selector "${metadata.selector}" specified in the component metadata is not valid`,
            SyntaxError);

        // Parsing the selector string to an array
        // 'my-element.class1#id[attribute1].class2[attribute2="value"]'
        // to
        // ["my-element", ".class1", "#id", "[attribute1]", ".class2", "[attribute2="value"]"]   
        let selectorList: string[] = metadata.selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');

        for (let i = 0, max = selectorList.length; i < max; i++) {
            let selector = selectorList[i];
            if (!selector.length) {
                continue;
            }

            // Check if the selector contains element names whicht are not allowed
            // eg. custom elements without a "-" in it
            assert(
                !selector.match(/^\w+(-\w+)*$/) || !(document.createElement(selector) instanceof HTMLUnknownElement),
                `The selector "${metadata.selector}" specified in the component metadata contains an element name "${selector}" which is not allowed. 
                If you are using a custom element, there has to be a "-" char in it!)`,
                SyntaxError);            
        }
            
        this._selector = metadata.selector;
        this._actions = metadata.actions;
        this._template = metadata.template;
        this._templateName = metadata.templateName;
        this._providers = metadata.providers || [];
    }

    get selector(): string {
        return this._selector;
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

    get providers(): Array<ClassType<any> | Provider | { [key: string]: any }> {
        return this._providers;
    }
}