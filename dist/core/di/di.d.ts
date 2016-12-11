export { Injectable, Inject } from './decorators';
export { Injector, IInjector } from './injector';
export { Provider, ResolvedProvider, provide } from './provider';
export { forwardRef } from './forward_ref';
export declare class OpaqueToken {
    private _desc;
    constructor(_desc: string);
    toString(): string;
}
