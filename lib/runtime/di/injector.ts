// {provide: Number,  useFactory: () => { return 1+2; }}
// new Provider(String, { useFactory: (value) => { return "Value: " + value; })
import { CoreMap } from '../../core/core';
import { ClassType } from '../../utils/class/class';
import { Provider, ResolvedProvider, resolveProviders } from './provider';

export class Injector {
    private _parent: Injector = null;
    private _providers: ResolvedProvider[] = [];
    private _values: CoreMap = new CoreMap();

    constructor(providers: ResolvedProvider[], parent: Injector = null) {
        this._parent = parent;
        this._providers = providers;
    }

    get parent(): Injector {
        return this._parent || null;
    }

    get providers(): ResolvedProvider[] {
        return this._providers || [];
    }

    static resolve(providers: Array<ClassType<any> | Provider | { [key: string]: any }>): ResolvedProvider[] {
        return resolveProviders(providers);
    }

    static resolveAndCreate(
        providers: Array<ClassType<any> | Provider | { [key: string]: any }>,
        parent: Injector = null
    ) {
        let resolvedProviders = Injector.resolve(providers);
        return Injector.fromResolvedProviders(resolvedProviders, parent)
    }

    static fromResolvedProviders(providers: ResolvedProvider[], parent: Injector = null) {
        return new Injector(providers, parent);
    }

    resolveAndCreateChild(providers: Array<ClassType<any> | Provider | { [key: string]: any }>): Injector {
        let resolvedProviders = Injector.resolve(providers);
        return this.createChildFromResolved(resolvedProviders);
    }

    createChildFromResolved(providers: ResolvedProvider[]): Injector {
        return Injector.fromResolvedProviders(providers, this);
    }

    get(token: any): any {
        let value = this._values.get(token);
        if (value) {
            return value; 
        }
        for (let i = 0, max = this._providers.length; i < max; i++) {
            let provider = this._providers[i];
            if (provider.token === token) {
                value = provider.resolvedFactory.factory();
                this._values.set(token, value);
                return value;
            }
        }
        return this._parent ? this._parent.get(token) : null;
    }
}