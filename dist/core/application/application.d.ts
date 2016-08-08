import { ClassType } from '../../utils/utils';
import { Injector, Provider } from '../di/di';
import { ComponentFactory, ComponentReference } from '../component/component';
export declare var DEFAULT_PROVIDERS: Provider[];
export declare function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | {
    [key: string]: any;
}>, root?: Element): Application;
export declare function bootstrap<C>(appComponentType: ClassType<C>, root?: HTMLElement): Application;
export declare class Application {
    private _appComponent;
    private _injector;
    private _runningTick;
    private _zoneService;
    injector: Injector;
    appComponent: ComponentReference<any>;
    constructor(injector: Injector);
    bootstrap<C>(componentOrFactory: ComponentFactory<C> | ClassType<C>, root?: Element): void;
    tick(): void;
}
