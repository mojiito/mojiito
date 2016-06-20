import { assert } from '../../debug/debug';
import { CoreMap } from '../../core/map/map';
import { ClassFactory } from '../../utils/class/class';

/**
 * Directives are stored here.
 */
let directives: { [name: string]: DirectiveFactory<any> } = {};

/**
 * Describes the pair of klass and metadata for directives used in the directives map.
 * 
 * @interface IDirectiveDefinition
 */
export class DirectiveFactory<T> {
    private _class: ClassFactory<T>;
    private _metadata: DirectiveMetadata;

    get klass(): ClassFactory<T> {
        return this._class;
    }

    get metadata(): DirectiveMetadata {
        return this._metadata;
    }

    constructor(klass: ClassFactory<T>, metadata: DirectiveMetadata) {
        this._class = klass;
        this._metadata = metadata;
    }
}

/**
 * Describes the metadata object for directives.
 * See {@link Directive} decorator for more information
 * 
 * @export
 * @interface DirectiveMetadata
 */
export interface DirectiveMetadata {
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
 * @param {DirectiveMetadata} metadata Directive metadata
 * @returns {ClassDecorator}
 */
export function Directive(metadata: DirectiveMetadata): ClassDecorator {
    return function(klass: ClassFactory<any>) {
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
    directives[name] = new DirectiveFactory(klass, metadata);
}

export function getRegisteredDirectives(): { [name: string]: DirectiveFactory<any> }  {
    return directives;
}