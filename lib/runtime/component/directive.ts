import { assert } from '../../debug/debug';
import { ClassType } from '../../utils/class/class';
import { ComponentFactory } from './factory';
import { ComponentMetadata, ComponentMetadataReference } from './metadata';
import { Annotations } from '../annotations/annotations';
import { Injectable } from '../di/di';
import { ComponentRegistry } from './registry';

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
        Injectable()(componentClass);
        let metaRef = new ComponentMetadataReference(metadata);
        Annotations.peek(componentClass).add(metaRef);
        ComponentRegistry.register(componentClass, metaRef.selector);
    }
}