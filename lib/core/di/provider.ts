import { ClassType } from '../../utils/class/class';
import { ClassReflection } from '../reflect/reflection';
import { InjectMetadata, InjectableMetadata } from './metadata';
import { Injector } from './injector';
import { resolveForwardRef } from './forward_ref';
import { assert } from '../../debug/debug';
import { stringify } from '../../utils/string/stringify';

/**
 * Describes how the {@link Injector} should instantiate a given token.
 * 
 * @export
 * @class Provider
 */
export class Provider {
    constructor(token: any,
        {useClass, useValue, useFactory, dependencies}: {
            useClass?: ClassType<any>,
            useValue?: any,
            useFactory?: Function,
            dependencies?: Object[]
        }) {
        this.token = token;
        this.useClass = useClass;
        this.useValue = useValue;
        this.useFactory = useFactory;
        this.dependencies = dependencies;

    }
    token: any;
    useClass: ClassType<any>;
    useValue: any;
    useFactory: Function;
    dependencies: Object[];

}

/**
 * Creates a {@link Provider}.
 * 
 * @export
 * @param {*} token
 * @param {{
 *     useClass?: ClassType<any>,
 *     useValue?: any,
 *     useFactory?: Function,
 *     dependencies?: Object[],
 * }} {useClass, useValue, useFactory, dependencies}
 * @returns {Provider}
 */
export function provide(token: any, {useClass, useValue, useFactory, dependencies}: {
    useClass?: ClassType<any>,
    useValue?: any,
    useFactory?: Function,
    dependencies?: Object[],
}): Provider {
    return new Provider(token, {
        useClass: useClass,
        useValue: useValue,
        useFactory: useFactory,
        dependencies: dependencies,
    });
}

/**
 * An internal resolved representation of a {@link Provider} used by the {@link Injector}.
 * 
 * @export
 * @class ResolvedProvider
 */
export class ResolvedProvider {

    private _token: any;
    private _resolvedFactory: ResolvedFactory;

    constructor(token: any, resolvedFactory: ResolvedFactory) {
        this._token = token;
        this._resolvedFactory = resolvedFactory;
    }

    get token(): any {
        return this._token;
    }

    get resolvedFactory(): ResolvedFactory {
        return this._resolvedFactory;
    }
}

/**
 * Resolves an array of Providers or stuff that can be converted to a Provider
 *
 * @internal
 * @export
 * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
 * @returns {ResolvedProvider[]}
 */
export function resolveProviders(providers: Array<ClassType<any> | Provider | { [key: string]: any }>): ResolvedProvider[] {
    let resolved: ResolvedProvider[] = [];
    for (let i = 0, max = providers.length; i < max; i++) {
        let p = providers[i];
        if (p instanceof Provider) {
            resolved.push(resolveProvider(p));
        } else if (p instanceof Function) {
            resolved.push(resolveProvider(provide(p, { useClass: <ClassType<any>>p })));
        } else if (Array.isArray(p)) {
            resolveProviders(p).map(resolvedP => resolved.push(resolvedP));
        } else {
            throw new TypeError(`${p} is not a valid provider!`);
        }
    }

    return resolved;
}

/**
 * Resolves a single Provider and returns an ResolvedProvider
 *
 * @internal
 * @export
 * @param {Provider} provider
 * @returns {ResolvedProvider}
 */
export function resolveProvider(provider: Provider): ResolvedProvider {
    return new ResolvedProvider(provider.token, resolveFactory(provider));
}

/**
 * An internal resolved representation of a factory function created by resolving {@link Provider}.
 *
 * A ResolvedFactory is basically a function which creates
 * and returns the item (class, value,.. ) provided.
 * 
 * @export
 * @class ResolvedFactory
 */
export class ResolvedFactory {

    private _factoryFn: Function;
    private _dependencies: any[] = [];

    constructor(factory: Function, dependencies: any[]) {
        this._factoryFn = factory;
        this._dependencies = dependencies;
    }

    get factory(): Function {
        return this._factoryFn;        
    }

    get dependencies(): any[] {
        return this._dependencies || [];
    }
}

export function resolveFactory(provider: Provider): ResolvedFactory {
    let factoryFn: Function;
    let dependencies: any[] = [];
    if (provider.useClass) {
        let useClass = resolveForwardRef(provider.useClass);
        dependencies = dependenciesForClass(useClass);
        factoryFn = (dependecies: any[] = []) => {
            return new (Function.prototype.bind.apply(useClass, [null].concat(dependecies)))
        };
    } else if (provider.useFactory) {
        factoryFn = provider.useFactory;
    } else {
        factoryFn = () => provider.useValue;
    }

    return new ResolvedFactory(factoryFn, dependencies);
}

/**
 * Looks up and returns the dependecies as an array for an annotated class.
 * 
 * @export
 * @param {ClassType<any>} annotatedClass
 * @returns {any[]}
 */
export function dependenciesForClass(annotatedClass: ClassType<any>): any[] {
    let dependecies: any[] = []
    let dependencyTokens = ClassReflection.peek(annotatedClass).parameters.filter(value => value instanceof InjectMetadata);
    if (Array.isArray(dependencyTokens) && dependencyTokens.length) {
        let isInjectable = false;
        ClassReflection.peek(annotatedClass).annotations.forEach(value => {
            if (value instanceof InjectableMetadata) {
                isInjectable = true;
            }
        });
        assert(!!isInjectable, `Cannot resolve all parameters for ${stringify(annotatedClass)}! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject`);
        for (let i = 0, max = dependencyTokens.length; i < max; i++) {
            let dep = dependencyTokens[i];
            if (dep instanceof InjectMetadata) {
                dependecies.push(dep.token);
            }
        }
    }
    return dependecies;
}