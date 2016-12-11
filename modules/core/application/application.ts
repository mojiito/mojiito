import { assert } from '../../debug/debug';
import { ClassType, isClassType } from '../../utils/utils';
import { Injector, Inject, Injectable, Provider, provide, forwardRef } from '../di/di';
import { ComponentFactory, ComponentRef, ComponentFactoryResolver } from '../directive/factory';
import { DirectiveMetadata } from '../directive/metadata';
import { DirectiveResolver } from '../directive/resolver';
import { ZONE_PROVIDERS, ZoneService } from '../zone/zone';
import { RUNTIME_PROVIDERS, RuntimeCompiler, RuntimeRenderer, NodeVisitor } from '../../runtime/runtime';
import { DOM_PROVIDERS, DOMTraverser } from '../../browser/browser';

export const CORE_PROVIDERS = [
    DirectiveResolver
];


export function bootstrap<C>(appComponentType: ClassType<C>, rootProviders: Array<ClassType<any> | Provider | { [key: string]: any }>, root?: Element): void;
export function bootstrap<C>(appComponentType: ClassType<C>, root?: Element): void;
export function bootstrap<C>(appComponentType: ClassType<C>, rootProviders: any = [], root?: Element): void {

    if (rootProviders instanceof Element) {
        root = rootProviders;
        rootProviders = [];
    }
    assert(isClassType((appComponentType)), `The first argument ("appComponentType") of the bootstrap function has to be a class`, TypeError);
    assert(Array.isArray(rootProviders), 'The custom providers must be an array', TypeError);
    
    const rootInjector = Injector.resolveAndCreate([
        ZONE_PROVIDERS,
        RUNTIME_PROVIDERS,
        CORE_PROVIDERS,
        DOM_PROVIDERS,
        rootProviders,
        Application
    ]);
    const compiler: RuntimeCompiler = rootInjector.get(RuntimeCompiler);
    compiler.compileDirectiveAndChilds(appComponentType);
    rootInjector.get(Application).bootstrap(appComponentType, root);
}

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
@Injectable()
export class Application {

    private _appComponent: ComponentRef<any>;
    private _runningTick = false;
    private _injector: Injector;

    get injector() { return this._injector; }
    get appComponent() { return this._appComponent; }

    constructor(
        @Inject(ZoneService) private _zoneService: ZoneService,
        @Inject(RuntimeCompiler) private _compiler: RuntimeCompiler,
        @Inject(DOMTraverser) private _traverser: DOMTraverser,
        @Inject(Injector) private _rootInjector: Injector
    ) {
        // subscribe to the zone
        this._zoneService.onMicrotaskEmpty.subscribe(() => { this._zoneService.run(() => { this.tick(); }); })
        this._zoneService.onError.subscribe((error) => { throw error; });
    }

    bootstrap<C>(componentOrFactory: ComponentFactory<C> | ClassType<C>, root: Element = document.body) {
        assert(!this._appComponent, `This Application is already bootstrapped!`);
        assert(root instanceof Element, 'Root has to be an Element!', TypeError);

        // run a zone for bootstrapping the whole Application
        // with all the provided Components starting at the 
        // provided app component or factory
        this._zoneService.run(() => {

            let type: ClassType<C>;
            let factory: ComponentFactory<C>;
            if (componentOrFactory instanceof ComponentFactory) {
                type = componentOrFactory.componentType
                factory = componentOrFactory;
            } else {
                type = componentOrFactory;
                factory = this._compiler.compileComponent(type);
            }
            
            const appVisitor = this._compiler.createVisitor([type]);
            const appResolver = this._compiler.createComponentFactoryResolver([factory]);

            this._injector = this._rootInjector.resolveAndCreateChild([
                provide(NodeVisitor, { useValue: appVisitor }),
                provide(ComponentFactoryResolver, { useValue: appResolver })
            ]);

            this._traverser.traverse(root, appVisitor);

            // this._renderer.parse(root, this._injector);
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