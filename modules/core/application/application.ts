import { assert } from '../../debug/debug';
import { ClassType, isClassType } from '../../utils/utils';
import { Injector, Inject, Injectable, Provider, provide, forwardRef } from '../di/di';
import { ComponentFactory, ComponentRef, ComponentFactoryResolver } from '../directive/factory';
import { DirectiveMetadata } from '../directive/metadata';
import { DirectiveResolver } from '../directive/resolver';
import { ZONE_PROVIDERS, ZoneService } from '../zone/zone';
import { RUNTIME_PROVIDERS, RuntimeCompiler, RuntimeRenderer } from '../../runtime/runtime';

export const CORE_PROVIDERS = [
    DirectiveResolver
];

export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | { [key: string]: any }>, root?: Element): void;
export function bootstrap<C>(appComponentType: ClassType<C>, root?: Element): void;
export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: any = [], root = <Element>document.body): void {

    if (customProviders instanceof Element) {
        root = customProviders;
        customProviders = [];
    }
    assert(isClassType((appComponentType)), `The first argument ("appComponentType") of the bootstrap function has to be a class`, TypeError);
    assert(root instanceof Element, 'Root has to be an Element!', TypeError);
    assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);
    

    const rootInjector = Injector.resolveAndCreate([
        ZONE_PROVIDERS,
        RUNTIME_PROVIDERS,
        CORE_PROVIDERS,
        customProviders,
        Application
    ]);

    rootInjector.get(Application).bootstrap(appComponentType, rootInjector, root);
}

@Injectable()
export class Application {

    private _appComponent: ComponentRef<any>;
    private _runningTick = false;


    // get injector() { return this._injector; }
    // get appComponent() { return this._appComponent; }

    constructor(
        @Inject(ZoneService) private _zoneService: ZoneService,
        @Inject(RuntimeCompiler) private _compiler: RuntimeCompiler
    ) {
        this._zoneService.onMicrotaskEmpty.subscribe(() => { this._zoneService.run(() => { this.tick(); }); })
        this._zoneService.onError.subscribe((error) => { throw error; });
    }

    bootstrap<C>(componentOrFactory: ComponentFactory<C> | ClassType<C>, injector: Injector, root: Element = document.documentElement) {
        this._zoneService.run(() => {

            let type = <ClassType<C>>componentOrFactory;
            if (componentOrFactory instanceof ComponentFactory) {
                type = componentOrFactory.componentType
            }

            const compiledDirectives = this._compiler.compileDirectiveAndAllChilds(type);
            console.log(compiledDirectives);
            
        });
    }

    tick() {
        // assert(!this._runningTick, `Tick is already running. You may call tick recursivly!`);
        // this._runningTick = true;
        // assert(!!this._appComponent, `Please call "bootstrap" before the first tick!`);
        // this._appComponent.hostElement.detectChanges();
        // this._runningTick = false;
    }
}