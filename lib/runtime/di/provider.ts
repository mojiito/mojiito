import { ClassType } from '../../utils/class/class';

export class Provider {
    constructor(token: any,
        {useClass, useValue, useExisting, useFactory, dependencies}: {
            useClass?: ClassType<any>,
            useValue?: any,
            useExisting?: any,
            useFactory?: Function,
            dependencies: Object[]
        }) {
        this.token = token;
        this.useClass = useClass;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory;
        this.dependencies = dependencies;

    }
    token: any;
    useClass: ClassType<any>;
    useValue: any;
    useExisting: any;
    useFactory: Function;
    dependencies: Object[];

}

export function provide(token: any, {useClass, useValue, useExisting, useFactory, dependencies}: {
    useClass?: ClassType<any>,
    useValue?: any,
    useExisting?: any,
    useFactory?: Function,
    dependencies?: Object[],
}): Provider {
    return new Provider(token, {
        useClass: useClass,
        useValue: useValue,
        useExisting: useExisting,
        useFactory: useFactory,
        dependencies: dependencies,
    });
}

/**
 * 
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
    return new ResolvedProvider(provider.token, ResolvedFactory.resolve(provider));
}

/**
 * A ResolvedFactory is basically a function which creates
 * and returns the item (class, value,.. ) provided.
 * 
 * @export
 * @class ResolvedFactory
 */
export class ResolvedFactory {

    private _factoryFn: Function;
    private _dependencies: any[];

    constructor(provider: Provider) {
        let factoryFn: Function;
        if (provider.useClass) {
            factoryFn = () => new provider.useClass();
        } else if (provider.useExisting) {
            factoryFn = (instance: any) => instance;
        } else if (provider.useFactory) {
            factoryFn = provider.useFactory;
        } else {
            factoryFn = () => provider.useValue;
        }

        this._factoryFn = factoryFn;
    }

    get factory(): Function {
        return this._factoryFn;
    }

    // TODO: implement dependencies    
    // get dependencies(): any[] {
    //     return this._dependencies || [];
    // }

    static resolve(provider: Provider): ResolvedFactory {
        return new ResolvedFactory(provider);
    }
}