import { ClassType } from '../../utils/class/class';
import { Provider, ResolvedProvider } from './provider';
/**
 * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
 * constructor dependencies.
 *
 * @export
 * @class Injector
 */
export declare class Injector {
    private _parent;
    private _providers;
    private _values;
    /**
     * Creates an instance of Injector.
     *
     * @param {ResolvedProvider[]} providers
     * @param {Injector} [parent=null]
     */
    constructor(providers: ResolvedProvider[], parent?: Injector);
    /**
     * The parent of this injector
     *
     * @readonly
     * @type {Injector}
     */
    parent: Injector;
    /**
     * Turns an array of provider definitions into an array of resolved providers.
     *
     * @static
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @returns {ResolvedProvider[]}
     */
    static resolve(providers: Array<ClassType<any> | Provider | {
        [key: string]: any;
    }>): ResolvedProvider[];
    /**
     * Resolves an array of providers and creates an injector from those providers.
     *
     * @static
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @param {Injector} [parent=null]
     * @returns
     */
    static resolveAndCreate(providers: Array<ClassType<any> | Provider | {
        [key: string]: any;
    }>, parent?: Injector): Injector;
    /**
     * Creates an injector from previously resolved providers.
     *
     * @static
     * @param {ResolvedProvider[]} providers
     * @param {Injector} [parent=null]
     * @returns
     */
    static fromResolvedProviders(providers: ResolvedProvider[], parent?: Injector): Injector;
    /**
     * Resolves an array of providers and creates a child injector from those providers.
     *
     * @param {(Array<ClassType<any> | Provider | { [key: string]: any }>)} providers
     * @returns {Injector}
     */
    resolveAndCreateChild(providers: Array<ClassType<any> | Provider | {
        [key: string]: any;
    }>): Injector;
    /**
     * Creates a child injector from previously resolved providers.
     *
     * @param {ResolvedProvider[]} providers
     * @returns {Injector}
     */
    createChildFromResolved(providers: ResolvedProvider[]): Injector;
    /**
     * Gets the value of the resolved provider matching the token
     *
     * @param {*} token
     * @returns {*}
     */
    get(token: any): any;
}
