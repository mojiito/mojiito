export interface InjectableMetadataFactory {
    (): ClassDecorator;
}
export declare var Injectable: InjectableMetadataFactory;
export interface InjectMetadataFactory {
    (token: any): ParameterDecorator;
}
export declare var Inject: InjectMetadataFactory;
