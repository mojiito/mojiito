import {
  createPlatformFactory, PlatformRef, Injectable, Inject, Injector, Provider,
  InjectionToken, ClassType, ComponentFactory, ApplicationRef, RendererFactory,
  CORE_PROVIDERS, ComponentResolver, ReflectiveInjector, ComponentFactoryResolver
} from 'mojiito-core';
import { unimplemented } from './facade/error';
import { ListWrapper } from './facade/collection';
import { DOCUMENT } from './tokens';
import { Compiler } from './compiler/compiler';
import { DomTraverser } from './dom_traverser';
import { DomRendererFactory } from './dom_renderer';
import { ExpressionParser } from './expression/expression';
import { BindingParser } from './binding_parser';

@Injectable()
export class BrowserPlatformRef extends PlatformRef {
  private _destroyed = false;
  private _destroyListeners: Function[] = [];

  constructor(private _injector: Injector, private _resolver: ComponentResolver,
    private _compiler: Compiler) {
    super();
  }

  get injector(): Injector { return this._injector; }
  get destroyed(): boolean { return this._destroyed; }

  bootstrapComponent<C>(component: ClassType<C>): void {
    this._compiler.compileComponents([component]);
    const appInjector = ReflectiveInjector.resolveAndCreate([
      {
        provide: ComponentFactoryResolver,
        useFactory: () => this._compiler.createComponentFactoryResolver()
      },
      ApplicationRef,
    ], this._injector);

    const app = appInjector.get(ApplicationRef) as ApplicationRef;
    app.bootstrap(component);
  }

  onDestroy(callback: () => void): void {
    this._destroyListeners.push(callback);
  }

  destroy(): void {
    if (this._destroyed) {
      throw new Error('The platform has already been destroyed!');
    }
    // TODO: destroy all se stuff
    this._destroyListeners.forEach(listener => listener());
    this._destroyed = true;
  }
}

function factoryResolver(compiler: Compiler) {
  return compiler.componentFactoryResolver;
}

export const PLATFORM_PROVIDERS = [
  { provide: PlatformRef, useClass: BrowserPlatformRef },
  { provide: DOCUMENT, useValue: document },
  { provide: RendererFactory, useClass: DomRendererFactory},
  Compiler,
  ExpressionParser,
  BindingParser
];

export const platformBrowser = createPlatformFactory([PLATFORM_PROVIDERS, CORE_PROVIDERS]);
