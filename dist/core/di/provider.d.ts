import { ClassType } from '../../utils/class/class';
/**
 * Describes how the {@link Injector} should instantiate a given token.
 *
 * @export
 * @class Provider
 */
export declare class Provider {
    constructor(token: any, {useClass, useValue, useFactory, dependencies}: {
        useClass?: ClassType<any>;
        useValue?: any;
        useFactory?: Function;
        dependencies?: Object[];
    });
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
export declare function provide(token: any, {useClass, useValue, useFactory, dependencies}: {
    useClass?: ClassType<any>;
    useValue?: any;
    useFactory?: Function;
    dependencies?: Object[];
}): Provider;
/**
 * An internal resolved representation of a {@link Provider} used by the {@link Injector}.
 *
 * @export
 * @class ResolvedProvider
 */
export declare class ResolvedProvider {
    private _token;
    private _resolvedFactory;
    constructor(token: any, resolvedFactory: ResolvedFactory);
    token: any;
    resolvedFactory: ResolvedFactory;
}
/**
 * Resolves an array of Providers or stuff that can be converted to a Provider
 *
 * @internal
 * @export
 * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
 * @returns {ResolvedProvider[]}
 */
export declare function resolveProviders(providers: Array<ClassType<any> | Provider | {
    [key: string]: any;
}>): ResolvedProvider[];
/**
 * Resolves a single Provider and returns an ResolvedProvider
 *
 * @internal
 * @export
 * @param {Provider} provider
 * @returns {ResolvedProvider}
 */
export declare function resolveProvider(provider: Provider): ResolvedProvider;
/**
 * An internal resolved representation of a factory function created by resolving {@link Provider}.
 *
 * A ResolvedFactory is basically a function which creates
 * and returns the item (class, value,.. ) provided.
 *
 * @export
 * @class ResolvedFactory
 */
export declare class ResolvedFactory {
    private _factoryFn;
    private _dependencies;
    constructor(factory: Function, dependencies: any[]);
    factory: Function;
    dependencies: any[];
}
export declare function resolveFactory(provider: Provider): ResolvedFactory;
/**
 * Looks up and returns the dependecies as an array for an annotated class.
 *
 * @export
 * @param {ClassType<any>} annotatedClass
 * @returns {any[]}
 */
export declare function dependenciesForClass(annotatedClass: ClassType<any>): any[];
