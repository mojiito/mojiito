import { ClassType } from '../../utils/utils';
import { Injector, Provider } from '../di/di';
import { ComponentFactory, ComponentRef } from '../directive/factory';
import { DirectiveResolver } from '../directive/resolver';
import { ZoneService } from '../zone/zone';
import { RuntimeCompiler } from '../../runtime/runtime';
import { DOMTraverser } from '../../browser/browser';
export declare const CORE_PROVIDERS: typeof DirectiveResolver[];
export declare function bootstrap<C>(appComponentType: ClassType<C>, rootProviders: Array<ClassType<any> | Provider | {
    [key: string]: any;
}>, root?: Element): void;
export declare function bootstrap<C>(appComponentType: ClassType<C>, root?: Element): void;
/**
 * The main entrypoint.
 * A single Application gets instanciated per page in the exported bootstrap function.
 * It creates a Zone where your Application with all Components an Directives run in.
 * The Application class itself is not a component.
 * It takes a single component or component factory for creating the app component.
 *
 * @Injectable
 * @export
 * @class Application
 */
export declare class Application {
    private _zoneService;
    private _compiler;
    private _traverser;
    private _rootInjector;
    private _appComponent;
    private _runningTick;
    private _injector;
    injector: Injector;
    appComponent: ComponentRef<any>;
    constructor(_zoneService: ZoneService, _compiler: RuntimeCompiler, _traverser: DOMTraverser, _rootInjector: Injector);
    bootstrap<C>(componentOrFactory: ComponentFactory<C> | ClassType<C>, root?: Element): void;
    tick(): void;
}
