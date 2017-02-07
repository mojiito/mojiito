import {
  createPlatformFactory, PlatformRef, Injectable, Inject, Injector, Provider,
  InjectionToken, ClassType, ComponentFactory, ApplicationRef, Renderer,
  CORE_PROVIDERS, ComponentResolver
} from '../../core';
import { ListWrapper, unimplemented } from '../../facade';
import { DOCUMENT } from './tokens';
import { DomRenderer } from './dom_renderer';
import { Compiler } from './compiler';
import { DomTraverser } from './dom_traverser';

@Injectable()
export class BrowserPlatformRef extends PlatformRef {
  private _destroyed = false;
  private _destroyListeners: Function[] = [];
  private _compiler: Compiler;

  constructor(private _injector: Injector, private _resolver: ComponentResolver,
  private _renderer: Renderer) {
    super();
    console.time('mojito bootstrap');
    this._compiler = new Compiler(_resolver);
  }

  get injector(): Injector { return this._injector; }
  get destroyed(): boolean { return this._destroyed; }

  bootstrapComponent<C>(component: ClassType<C>): void {
    const compiled = this._compiler.compileComponent(component);
    const rootElements = this._renderer.selectElements(compiled.metadata.selector);
    ListWrapper.forEach(rootElements, el => {
      const traverser = new DomTraverser();
      traverser.traverse(el, compiled.visitor);
    });
    console.timeEnd('mojito bootstrap');
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

export const PLATFORM_PROVIDERS = [
  { provide: PlatformRef, useClass: BrowserPlatformRef },
  { provide: Renderer, useClass: DomRenderer },
  { provide: DOCUMENT, useValue: document },
];

export const platformBrowser = createPlatformFactory([PLATFORM_PROVIDERS, CORE_PROVIDERS]);
