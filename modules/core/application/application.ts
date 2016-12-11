import { assert } from '../../debug/debug';
import { ClassType, stringify, doesSelectorMatchElement } from '../../utils/utils';
import { Injector, Injectable, Provider } from '../di/di';
import { ComponentFactory, ComponentReference, ComponentResolver, ComponentMetadata } from '../component/component';
import { ClassReflection } from '../reflect/reflection';
import { Parser } from '../../render/parser/parser';
// import { ZoneService } from '../zone/zone';

export var DEFAULT_PROVIDERS = [
    new Provider(ComponentResolver, { useClass: ComponentResolver }),
    new Provider(Parser, { useClass: Parser }),
    // new Provider(ZoneService, { useClass: ZoneService })
];

export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | { [key: string]: any }>, root?: Element): Application;
export function bootstrap<C>(appComponentType: ClassType<C>, root?: HTMLElement): Application;
export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: any = [], root = document.body): Application {
    if (customProviders instanceof Element) {
        root = customProviders;
        customProviders = [];
    }

    assert(root instanceof Element, 'Root has to be an Element!', TypeError);
    assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);

    let rootInjector = Injector.resolveAndCreate(DEFAULT_PROVIDERS.concat(customProviders));
    let app = new Application(rootInjector);
    app.bootstrap(appComponentType, root);
    return app;
}

export class Application {

    private _appComponent: ComponentReference<any>;
    private _injector: Injector;
    private _runningTick = false;
    // private _zoneService: ZoneService;


    get injector() { return this._injector; }
    get appComponent() { return this._appComponent; }

    constructor(injector: Injector) {
        this._injector = injector;
        // let zoneService: ZoneService = this._zoneService = this._injector.get(ZoneService);
        // zoneService.onMicrotaskEmpty.subscribe(() => { zoneService.run(() => { this.tick(); }); })
        // zoneService.onError.subscribe((error) => { throw error; });
    }

    bootstrap<C>(componentOrFactory: ComponentFactory<C> | ClassType<C>, root: Element = document.body) {
        // this._zoneService.run(() => {
            let componentFactory: ComponentFactory<C>;
            if (componentOrFactory instanceof ComponentFactory) {
                componentFactory = componentOrFactory;
            } else {
                let componentResolver = <ComponentResolver>this._injector.get(ComponentResolver);
                componentFactory = componentResolver.resolveComponent(componentOrFactory)
            }

            let metadata: ComponentMetadata = ClassReflection.peek(componentFactory.componentType).annotations.get(ComponentMetadata);
            assert(metadata instanceof ComponentMetadata, `The class "${stringify(componentFactory.componentType)}" has no metadata defined in the @Component decorator.`);

            let element: Element;
            let selector = metadata.selector;
            assert(!!(typeof selector === 'string' && selector.length), `The class "${stringify(componentFactory.componentType)}" has no selector defined in the @Component metadata object.`);

            if (doesSelectorMatchElement(selector, root)) {
                element = root;
            } else {
                let elements = root.querySelectorAll(selector);
                assert(
                    !!elements.length,
                    `Mojito could not find an element matching the selector "${selector}" of the "${stringify(componentFactory.componentType)}" component provided to the bootstrap function`
                );
                assert(
                    elements.length === 1,
                    `There are more than one elements matching the selector "${selector}" of the "${stringify(componentFactory.componentType)}" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!`
                );
                element = elements[0];
            }

            let appRef = this._appComponent = componentFactory.create(this._injector, element);
            appRef.parse();
        // });
    }

    tick() {
        assert(!this._runningTick, `Tick is already running. You may call tick recursivly!`);
        this._runningTick = true;
        assert(!!this._appComponent, `Please call "bootstrap" before the first tick!`);
        this._appComponent.hostElement.detectChanges();
        this._runningTick = false;
    }
}