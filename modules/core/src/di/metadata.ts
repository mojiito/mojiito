// tslint:disable:variable-name
import { createParameterDecorator, createClassDecorator } from '../utils/decorator';
import { stringify } from '../facade';

export class InjectMetadata {
    constructor(public token: any) { }
    get name() { return `@Inject`; };
    toString(): string { return `@Inject(${stringify(this.token)})`; }
}
export interface InjectMetadataFactory {
    (token: any): ParameterDecorator;
}
export var Inject = createParameterDecorator(InjectMetadata) as InjectMetadataFactory;

export class InjectableMetadata {
    constructor() { }
    get name() { return `@Injectable`; };
    toString(): string { return `@Injectable()`; }
}
export interface InjectableMetadataFactory {
    (): ParameterDecorator;
}
export var Injectable = createClassDecorator(InjectableMetadata) as InjectableMetadataFactory;

