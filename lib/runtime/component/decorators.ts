import { assert } from '../../debug/debug';
import { ClassType } from '../../utils/class/class';
import { createClassDecorator } from '../../utils/decorators/decorators';
import { ComponentMetadata } from './metadata';
import { Injectable } from '../di/di';
import { ComponentRegistry } from './registry';


export interface ComponentMetadataFactory {
    (metadata: {
        selector?: string,
        inputs?: string[],
        outputs?: string[],
        events?: string[],
        host?: {[key: string]: string},
        providers?: any[],
        templateUrl?: string,
        template?: string,
        styleUrls?: string[],
        styles?: string[]
    }): ClassDecorator;
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
 * @param {ComponentMetadata} metadata Component metadata
 * @returns {ClassDecorator}
 */
// export function Component(metadata: ComponentMetadata): ClassDecorator {
//     return function (componentClass: ClassType<any>) {
//         Injectable()(componentClass);
//         let metaRef = new ComponentMetadataReference(metadata);
//         Annotations.peek(componentClass).add(metaRef);
//         ComponentRegistry.register(componentClass, metaRef.selector);
//     }
// }

export function Input(): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        
    }
}

export function Output(bindingPropertyName?: string): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        
    }
}

export var Component: ComponentMetadataFactory = <ComponentMetadataFactory>createClassDecorator(ComponentMetadata);