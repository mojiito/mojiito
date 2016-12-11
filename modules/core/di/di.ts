/**
 * Mojito's dependency injection basically a simpler version of Angular's DI.      
 * All the credits and respect to the Angular team.
 *
 * TODO: Insert stuff...
 */

import { Injectable } from './decorators';

export { Injectable, Inject } from './decorators';
export { Injector, IInjector } from './injector';
export { Provider, ResolvedProvider, provide } from './provider';
export { forwardRef } from './forward_ref';

@Injectable()
export class OpaqueToken {
    constructor(private _desc: string) { }
    toString(): string { return `Token ${this._desc}`; }
}