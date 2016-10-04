import { Injector, ResolvedProvider } from '../di/di';
import { ComponentFactoryResolver, ComponentFactory } from '../directive/factory';
export declare class AppInjector extends Injector {
    private _componentFactoryResolver;
    constructor(factories: ComponentFactory<any>[], providers: ResolvedProvider[], parent: Injector);
    injector: Injector;
    componentFactoryResolver: ComponentFactoryResolver;
    get(token: any): any;
}
