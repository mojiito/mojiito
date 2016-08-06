import { assert } from '../../debug/debug';
import { ClassType } from '../../utils/class/class';
import { createClassDecorator, createPropertyDecoratory } from '../decorators/decorators';
import { ComponentMetadata, InputMetadata, OutputMetadata } from './metadata';
import { Injectable } from '../di/di';
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