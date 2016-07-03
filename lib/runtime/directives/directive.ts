import { assert } from '../../debug/debug';
import { CoreMap } from '../../core/map/map';
import { ClassFactory, getClassName } from '../../utils/class/class';
import { Injector } from '../../runtime/injectable/injector';
import { DirectiveResolver, IResolver } from '../compiler/resolver/resolver';
import { DirectiveFactory } from '../factory/factory';

/**
 * Describes the metadata object for directives.
 * See {@link Directive} decorator for more information
 * 
 * @export
 * @interface DirectiveMetadata
 */
export interface IDirectiveMetadata {
    selector: string;
}

export class DirectiveMetadataReference {
    
    protected _factory = DirectiveFactory;
    private _selector: string;

    constructor(metadata: IDirectiveMetadata) {
        this._selector = metadata.selector;
    }

    get selector(): string {
        return this._selector;
    }

    get factory(): ClassFactory<DirectiveFactory<any>>{
        return this._factory;
    }
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
export function Directive(metadata: IDirectiveMetadata): ClassDecorator {
    return function (klass: ClassFactory<any>) {
        registerDirective(klass, metadata);
    }
}

/**
 * Function for registering the directive class and metadata.
 * Normally you would not call this function directly.
 * Use the {@link Directive} class decorator.
 * 
 * @export
 * @param {IClassDefinition} klass The directive klass which will be attached
 * @param {DirectiveMetadata} metadata The directive metadata
 */
export function registerDirective<C>(directiveClass: ClassFactory<C>, metadata: IDirectiveMetadata): DirectiveFactory<C> {
    let metaRef = new DirectiveMetadataReference(metadata);
    let resolver = Injector.get(DirectiveResolver);
    let factory = resolver.resolve(directiveClass, metaRef);
    return factory;
}