import { CoreMap } from '../../core/core';
import { ClassType } from '../../utils/class/class';
import { Provider, ResolvedProvider, resolveProviders } from './provider';
import { resolveForwardRef } from './forward_ref';
import { assert } from '../../debug/debug';
import { stringify } from '../../utils/string/stringify';

/**
 * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
 * constructor dependencies.
 * 
 * @export
 * @class Injector
 */
export class Injector {

    private _parent: Injector = null;
    private _providers: ResolvedProvider[] = [];
    private _values: CoreMap = new CoreMap();

    /**
     * Creates an instance of Injector.
     * 
     * @param {ResolvedProvider[]} providers
     * @param {Injector} [parent=null]
     */
    constructor(providers: ResolvedProvider[], parent: Injector = null) {
        this._parent = parent;
        this._providers = providers;
    }

    /**
     * The parent of this injector
     * 
     * @readonly
     * @type {Injector}
     */
    get parent(): Injector {
        return this._parent || null;
    }

    /**
     * Turns an array of provider definitions into an array of resolved providers.
     * 
     * @static
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @returns {ResolvedProvider[]}
     */
    static resolve(providers: Array<ClassType<any> | Provider | { [key: string]: any }>): ResolvedProvider[] {
        return resolveProviders(providers);
    }

    /**
     * Resolves an array of providers and creates an injector from those providers.
     * 
     * @static
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @param {Injector} [parent=null]
     * @returns
     */
    static resolveAndCreate(
        providers: Array<ClassType<any> | Provider | { [key: string]: any }>,
        parent: Injector = null
    ) {
        let resolvedProviders = Injector.resolve(providers);
        return Injector.fromResolvedProviders(resolvedProviders, parent)
    }

    /**
     * Creates an injector from previously resolved providers.
     * 
     * @static
     * @param {ResolvedProvider[]} providers
     * @param {Injector} [parent=null]
     * @returns
     */
    static fromResolvedProviders(providers: ResolvedProvider[], parent: Injector = null) {
        return new Injector(providers, parent);
    }

    /**
     * Resolves an array of providers and creates a child injector from those providers.
     * 
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @returns {Injector}
     */
    resolveAndCreateChild(providers: Array<ClassType<any> | Provider | { [key: string]: any }>): Injector {
        let resolvedProviders = Injector.resolve(providers);
        return this.createChildFromResolved(resolvedProviders);
    }

    /**
     * Creates a child injector from previously resolved providers.
     * 
     * @param {ResolvedProvider[]} providers
     * @returns {Injector}
     */
    createChildFromResolved(providers: ResolvedProvider[]): Injector {
        return Injector.fromResolvedProviders(providers, this);
    }

    /**
     * Gets the value of the resolved provider matching the token
     * 
     * @param {*} token
     * @returns {*}
     */
    get(token: any): any {
        let value = this._values.get(token);
        if (value) {
            return value; 
        }
        for (let i = 0, max = this._providers.length; i < max; i++) {
            let provider = this._providers[i];
            if (provider.token === token) {
                let resolvedFactory = provider.resolvedFactory;
                let resolvedDepts: any[] = [];
                for (let j = 0, max = resolvedFactory.dependencies.length; j < max; j++) {
                    let deptToken = resolveForwardRef(resolvedFactory.dependencies[j]);
                    let dept = this.get(deptToken);
                    assert(!!dept, `Cannot resolve all parameters for ${stringify(resolvedFactory.factory)}! \n Please make shure the class is marked as @Injectable() and the parameters are injected with @Inject`);
                    resolvedDepts.push(dept);
                }
                value = resolvedFactory.factory(resolvedDepts);
                this._values.set(token, value);
                return value;
            }
        }
        return this._parent ? this._parent.get(token) : null;
    }
}