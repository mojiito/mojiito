import { ClassType } from '../../utils/utils';
import { Provider } from '../di/di';
import { ComponentFactory, ComponentReference } from '../component/component';
import { ZoneService } from '../zone/zone';
import { RuntimeRenderer } from '../../runtime/runtime';
export declare var DEFAULT_PROVIDERS: Provider[];
export declare function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | {
    [key: string]: any;
}>, root?: Element): void;
export declare function bootstrap<C>(appComponentType: ClassType<C>, root?: HTMLElement): void;
export declare class Application {
    private _zoneService;
    private _renderer;
    private _appComponent;
    private _runningTick;
    appComponent: ComponentReference<any>;
    constructor(_zoneService: ZoneService, _renderer: RuntimeRenderer);
    bootstrap<C>(componentOrFactory: ComponentFactory<C> | ClassType<C>, root?: Element): void;
    tick(): void;
}
