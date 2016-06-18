import { assert } from '../../debug/debug';
import { CoreMap } from '../../core/map/map';

/**
 * Directives are stored here.
 */
let directives: { [name: string]: IDirectiveDefinition } = {};

/**
 * Declares the interface to be used with class.
 * 
 * @export
 * @interface IClassDefinition
 */
export interface IClassDefinition {
    /**
     * Required constructor function for a class.
     * 
     * @type {Function}
     */
    constructor: Function;

    /**
     * Index signature for methods or properties on the class. 
     */
    [propertyName: string]: any;
}

/**
 * Describes the pair of klass and metadata for directives used in the directives map.
 * 
 * @interface IDirectiveDefinition
 */
interface IDirectiveDefinition {
    klass: IClassDefinition;
    metadata: IDirectiveMetadata;
}

/**
 * Describes the metadata object for directives.
 * See {@link Directive} decorator for more information
 * 
 * @export
 * @interface IDirectiveMetadata
 */
export interface IDirectiveMetadata {
    selector?: string;
    name?: string;
}

/**
 * Directives allow you to attach behavior (a class) to elements in the DOM
 * using a class decorator or the {@link registerDirective} function.
 *
 * A directive contains metadata (including the elements selector or name)
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
 * @param {IDirectiveMetadata} metadata Directive metadata
 * @returns {ClassDecorator}
 */
export function Directive(metadata: IDirectiveMetadata): ClassDecorator {
    return function (klass: IClassDefinition) {
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
 * @param {IDirectiveMetadata} metadata The directive metadata
 */
export function registerDirective(klass: IClassDefinition, metadata: IDirectiveMetadata): void {
    assert(
        typeof metadata === 'object' && !Array.isArray(metadata),
        'The metadata property for the directive must be an object and implement the IControllerMetadata interface!',
        TypeError
    );
    assert(
        typeof metadata.name === 'string' || typeof metadata.selector === 'string',
        'The directive metadata object must specify a name and/or a selector!'
    );
    let name = metadata.name;
    if (!name) {
        name = '' + Math.floor(Math.random() * 10 + 1) * Date.now();
    }

    // Check if directive with a specific name is already registerd
    assert(
        typeof directives[name] === 'undefined',
        `The directive with the name "${name}" has been already registerd!`,
        ReferenceError
    );

    // add to directives object
    directives[name] = {
        klass: klass,
        metadata: metadata
    }
}