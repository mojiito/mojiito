import { assert } from '../../debug/debug';
import { ClassType } from '../../utils/class/class';
import { ComponentFactory } from './factory';
import { ComponentMetadata, ComponentMetadataReference } from './metadata';

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
 * @param {ComponentMetadata} metadata Component metadata
 * @returns {ClassDecorator}
 */
export function Component(metadata: ComponentMetadata): ClassDecorator {
    return function (componentClass: ClassType<any>) {
        registerComponent(componentClass, metadata);
    }
}

/**
 * Function for registering a component class and metadata.
 * Normally you would not call this function directly.
 * Use the {@link Component} class decorator.
 * 
 * @export
 * @template C
 * @param {ClassFactory<C>} componentClass
 * @param {IComponentMetadata} metadata
 * @returns {ComponentFactory<C>}
 */
export function registerComponent<C>(componentClass: ClassType<C>, metadata: ComponentMetadata) {
    let metaRef = new ComponentMetadataReference(metadata);
    assert(!!(Reflect && Reflect.defineMetadata), 'reflect-metadata shim is required when using class decorators');
    Reflect.defineMetadata('meta', metaRef, componentClass);
}