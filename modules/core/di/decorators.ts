import { assert } from './../../debug/debug';
import { createClassDecorator, createParameterDecorator } from '../decorators/decorators';
import { ClassType, getClassName } from '../../utils/class/class';
import { InjectableMetadata, InjectMetadata } from './metadata';

export interface InjectableMetadataFactory {
    (): ClassDecorator;
}
export var Injectable: InjectableMetadataFactory = <InjectableMetadataFactory>createClassDecorator(InjectableMetadata);

export interface InjectMetadataFactory {
    (token: any): ParameterDecorator;
}
export var Inject: InjectMetadataFactory = <InjectMetadataFactory>createParameterDecorator(InjectMetadata)