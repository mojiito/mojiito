import { createPropertyDecoratory, createClassDecorator } from '../decorators/decorators';
import { InputMetadata, OutputMetadata, ComponentMetadata } from './metadata';
import { ChangeDetectionStrategy } from '../change_detection/change_detection';

export interface ComponentMetadataFactory {
    (metadata: {
        changeDetection?: ChangeDetectionStrategy,
        selector?: string,
        inputs?: string[],
        outputs?: string[],
        events?: string[],
        host?: {[key: string]: string},
        providers?: any[],
        directives?: any[],
        templateUrl?: string,
        template?: string,
        styleUrls?: string[],
        styles?: string[]
    }): ClassDecorator;
}
export var Component: ComponentMetadataFactory = <ComponentMetadataFactory>createClassDecorator(ComponentMetadata);

export interface InputMetadataFactory {
    (bindingPropertyName?: string): PropertyDecorator;
}
export var Input: InputMetadataFactory = <InputMetadataFactory>createPropertyDecoratory(InputMetadata);


export interface OutputMetadataFactory {
    (bindingPropertyName?: string): PropertyDecorator;
}
export var Output: OutputMetadataFactory = <OutputMetadataFactory>createPropertyDecoratory(OutputMetadata);