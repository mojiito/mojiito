import { ClassType } from '../utils/utils';
import { DirectiveResolver } from '../core/directive/resolver';
import { DirectiveMetadata, ComponentMetadata } from '../core/directive/metadata';
import { ComponentFactoryResolver, ComponentFactory } from '../core/component/factory';
import { Injector } from '../core/di/di';
export declare class RuntimeCompiler {
    private _resolver;
    private _compResolver;
    private _compiledDirectiveCache;
    compiledDirectives: CompiledDirectiveFactory<any>[];
    constructor(_resolver: DirectiveResolver, _compResolver: ComponentFactoryResolver);
    getCompiledDirective<T>(type: ClassType<T>): CompiledDirectiveFactory<any>;
    compileDirectives(types: ClassType<any>[]): void;
    private _compileDirective<T>(type);
}
export declare class CompiledDirectiveFactory<T> {
    metadata: DirectiveMetadata;
    constructor(metadata: DirectiveMetadata);
    create(injector?: Injector, nativeElement?: Element): void;
}
export declare class CompiledComponentFactory<T> extends CompiledDirectiveFactory<T> {
    private _factory;
    metadata: ComponentMetadata;
    constructor(_factory: ComponentFactory<T>, metadata: ComponentMetadata);
    create(injector?: Injector, nativeElement?: Element): void;
}
