import { ClassType } from '../utils/utils';
import { DirectiveResolver } from '../core/directive/resolver';
import { DirectiveMetadata, ComponentMetadata } from '../core/directive/metadata';
import { ComponentFactoryResolver, ComponentFactory } from '../core/component/factory';
import { Inject, Injectable, Injector } from '../core/di/di';

@Injectable()
export class RuntimeCompiler {

    private _compiledDirectiveCache = new Map<ClassType<any>, CompiledDirectiveFactory<any>>();

    get compiledDirectives() {
        let result: CompiledDirectiveFactory<any>[] = [];
        this._compiledDirectiveCache.forEach(d => result.push(d));
        return result;
    }

    constructor(
        @Inject(DirectiveResolver) private _resolver: DirectiveResolver,
        @Inject(ComponentFactoryResolver) private _compResolver: ComponentFactoryResolver
    ) { }

    getCompiledDirective<T>(type: ClassType<T>) {
        let directive = this._compiledDirectiveCache.get(type);
        return this._compiledDirectiveCache.get(type) || this._compileDirective(type);
    }

    compileDirectives(types: ClassType<any>[]) {
        types.forEach(type => {
            this._compileDirective(type);
        });
    }

    private _compileDirective<T>(type: ClassType<T>) {
        let result: CompiledDirectiveFactory<T>;
        const metadata = this._resolver.resolve(type);
        if (metadata instanceof ComponentMetadata) {
            let factory = this._compResolver.resolveComponent(type);
            result = new CompiledComponentFactory(factory, metadata);
        }
        this._compiledDirectiveCache.set(type, result);
        return result;
    }
}

export class CompiledDirectiveFactory<T> {
    constructor(public metadata: DirectiveMetadata) {}
    
    create(injector?: Injector, nativeElement?: Element) {
    }
}

export class CompiledComponentFactory<T> extends CompiledDirectiveFactory<T> {
    constructor(private _factory: ComponentFactory<T>, public metadata: ComponentMetadata) {
        super(metadata);
    }

    create(injector?: Injector, nativeElement?: Element) {
        super.create(injector, nativeElement);
    }
}