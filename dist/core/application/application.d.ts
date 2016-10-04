import { ClassType } from '../../utils/utils';
import { Injector, Provider } from '../di/di';
import { ComponentFactory } from '../directive/factory';
import { DirectiveResolver } from '../directive/resolver';
import { ZoneService } from '../zone/zone';
import { RuntimeCompiler } from '../../runtime/runtime';
export declare const CORE_PROVIDERS: typeof DirectiveResolver[];
export declare function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | {
    [key: string]: any;
}>, root?: Element): void;
export declare function bootstrap<C>(appComponentType: ClassType<C>, root?: Element): void;
export declare class Application {
    private _zoneService;
    private _compiler;
    private _appComponent;
    private _runningTick;
    constructor(_zoneService: ZoneService, _compiler: RuntimeCompiler);
    bootstrap<C>(componentOrFactory: ComponentFactory<C> | ClassType<C>, injector: Injector, root?: Element): void;
    tick(): void;
}
