import { assert } from '../../debug/debug';
import { ClassType, stringify, doesSelectorMatchElement } from '../../utils/utils';
import { Injector, Inject, Injectable, Provider, provide } from '../di/di';
import { ComponentFactory, ComponentReference, ComponentFactoryResolver } from '../component/component';
import { ComponentMetadata } from '../directive/metadata';
import { ClassReflection } from '../reflect/reflection';
import { DirectiveRegistry } from '../directive/registry';
import { DirectiveResolver } from '../directive/resolver';
import { ZoneService } from '../zone/zone';
import { RUNTIME_PROVIDERS, RuntimeCompiler, RuntimeRenderer } from '../../runtime/runtime';

export var DEFAULT_PROVIDERS = [
    new Provider(ComponentFactoryResolver, { useClass: ComponentFactoryResolver }),
    new Provider(DirectiveResolver, { useClass: DirectiveResolver }),
    // new Provider(Parser, { useClass: Parser }),
    new Provider(ZoneService, { useClass: ZoneService })
];

export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | { [key: string]: any }>, root?: Element): void;
export function bootstrap<C>(appComponentType: ClassType<C>, root?: HTMLElement): void;
export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: any = [], root = document.body): void {
    if (customProviders instanceof Element) {
        root = customProviders;
        customProviders = [];
    }

    assert(root instanceof Element, 'Root has to be an Element!', TypeError);
    assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);

    let rootInjector = Injector.resolveAndCreate([
        DEFAULT_PROVIDERS,
        RUNTIME_PROVIDERS,
        customProviders,
        Application
    ]);
    rootInjector.get(RuntimeCompiler).compileDirectives(DirectiveRegistry.directiveTypes);
    rootInjector.get(Application).bootstrap(appComponentType, root);
}

@Injectable()
export class Application {

    private _appComponent: ComponentReference<any>;
    private _runningTick = false;


    // get injector() { return this._injector; }
    get appComponent() { return this._appComponent; }

    constructor(
        @Inject(ZoneService) private _zoneService: ZoneService,
        @Inject(RuntimeRenderer) private _renderer: RuntimeRenderer
    ) {
        this._zoneService.onMicrotaskEmpty.subscribe(() => { this._zoneService.run(() => { this.tick(); }); })
        this._zoneService.onError.subscribe((error) => { throw error; });
    }

    bootstrap<C>(componentOrFactory: ComponentFactory<C> | ClassType<C>, root: Element = document.documentElement) {
        this._zoneService.run(() => {

            // let type = <ClassType<C>>componentOrFactory;
            // if (componentOrFactory instanceof ComponentFactory) {
            //     type = componentOrFactory.componentType
            // }

            // let metadata: ComponentMetadata = ClassReflection.peek(type).annotations.get(ComponentMetadata);
            // assert(metadata instanceof ComponentMetadata, `The class "${stringify(type)}" has no metadata defined in the @Component decorator.`);
            // let selector = metadata.selector;
            // assert(!!(typeof selector === 'string' && selector.length), `The class "${stringify(type)}" has no selector defined in the @Component metadata object.`);
            // let rootNode = root.querySelector(selector);
            // assert(!!rootNode, `No root element found that matches the app components selector ${selector}`);

            this._renderer.parseDOM(document.documentElement);
            
            // TODO
            // REWORK THE FOLLOWING PART
            // Encapsulate Rendering/Parsing from Core
            // let traverser = new DOMTraverser(new NodeVisitor(DirectiveRegistry.directiveTypes, new DirectiveResolver()));
            // traverser.traverse(rootNode, this._injector);


            // let compiler = new RuntimeCompiler(DirectiveRegistry.directiveTypes);            





            // let componentFactory: ComponentFactory<C>;
            // if (componentOrFactory instanceof ComponentFactory) {
            //     componentFactory = componentOrFactory;
            // } else {
            //     let componentResolver = <ComponentFactoryResolver>this._injector.get(ComponentFactoryResolver);
            //     componentFactory = componentResolver.resolveComponent(componentOrFactory)
            // }

            // let metadata: ComponentMetadata = ClassReflection.peek(componentFactory.componentType).annotations.get(ComponentMetadata);
            // assert(metadata instanceof ComponentMetadata, `The class "${stringify(componentFactory.componentType)}" has no metadata defined in the @Component decorator.`);

            // let element: Element;
            // let selector = metadata.selector;
            // assert(!!(typeof selector === 'string' && selector.length), `The class "${stringify(componentFactory.componentType)}" has no selector defined in the @Component metadata object.`);

            // if (doesSelectorMatchElement(selector, root)) {
            //     element = root;
            // } else {
            //     let elements = root.querySelectorAll(selector);
            //     assert(
            //         !!elements.length,
            //         `Mojito could not find an element matching the selector "${selector}" of the "${stringify(componentFactory.componentType)}" component provided to the bootstrap function`
            //     );
            //     assert(
            //         elements.length === 1,
            //         `There are more than one elements matching the selector "${selector}" of the "${stringify(componentFactory.componentType)}" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!`
            //     );
            //     element = elements[0];
            // }

            // let appRef = this._appComponent = componentFactory.create(this._injector, element);
            // appRef.parse();
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