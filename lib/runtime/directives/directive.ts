import { assert } from '../../debug/debug';
import { CoreMap } from '../../core/map/map';
import { ClassFactory, getClassName } from '../../utils/class/class';
import { Injector } from '../../runtime/injectable/injector';
import { DirectiveResolver } from '../compiler/resolver/resolver';

/**
 * Describes the metadata object for directives.
 * See {@link Directive} decorator for more information
 * 
 * @export
 * @interface DirectiveMetadata
 */
export interface DirectiveMetadata {
    selector: string;
}

/**
 * Directives allow you to attach behavior (a class) to elements in the DOM
 * using a class decorator or the {@link registerDirective} function.
 *
 * A directive contains metadata (including the elements selector)
 * and a class which will be attached to the elements.
 *
 * Assume this HTML Template or DOM
 * ```html
 * <form class="form">
 *   <div>
 *     <div my-directive>
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
 * @Directive({ selector: '[my-directive]'})
 * class MyDirective {
 *  // Your Code
 * }
 * 
 * @export
 * @param {DirectiveMetadata} metadata Directive metadata
 * @returns {ClassDecorator}
 */
export function Directive(metadata: DirectiveMetadata): ClassDecorator {
    return function (klass: ClassFactory<any>) {
        registerDirective(klass, metadata);
    }
}

/**
 * Function for registering the class and directive metadata.
 * Normally you would not call this function directly.
 * Use the {@link Directive} class decorator.
 * 
 * @export
 * @param {IClassDefinition} klass The directive klass which will be attached
 * @param {DirectiveMetadata} metadata The directive metadata
 */
export function registerDirective(klass: ClassFactory<any>, metadata: DirectiveMetadata): void {
    
    // Check if metadata is an object
    assert(
        typeof metadata === 'object' && !Array.isArray(metadata),
        `The metadata property for the directive on your class "${getClassName(klass)}" must be an object and implement the IControllerMetadata interface!`,
        TypeError
    );

    // Check if a selector is specified in the metadata.
    // Every directive must have a selector
    assert(typeof metadata.selector === 'string',
        `The directive metadata object on your class "${getClassName(klass)}" must specify a selector!`,
        TypeError);

    metadata.selector = metadata.selector.trim();

    // Check if selector contains only one level of dom nodes
    // Ok: .my-selector
    // Not allowed: .parent .my-selector
    assert(metadata.selector.indexOf(' ') === -1,
        `The directive selector "${metadata.selector}" on your class "${getClassName(klass)}" contains more than one levels of nodes. Only one is allowed!`,
        SyntaxError);
    
    // Check if selector is valid
    assert(!!metadata.selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/),
        `The directive selector "${metadata.selector}" on your class "${getClassName(klass)}" is not valid`,
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
            `The selector "${metadata.selector}" on your class "${getClassName(klass)}" contains an element name "${selector}" which is not allowed. 
            If you are using a custom element, there has to be a "-" char in it!)`,
            SyntaxError);
        
        
    }

    let directiveResolver = Injector.resolve(DirectiveResolver);
    directiveResolver.resolve(klass, metadata);

}