import {
  createPlatformFactory, PlatformRef, Injectable, Inject, Injector, Provider,
  ClassType, ComponentFactory, ApplicationRef
} from '../../core';
import { ListWrapper } from '../../facade';

@Injectable()
export class BrowserPlatformRef extends PlatformRef {
  private _destroyed = false;
  private _destroyListeners: Function[] = [];

  constructor(private _injector: Injector, private _app: ApplicationRef) {
    super();
  }

  get injector(): Injector { return this._injector; }
  get destroyed(): boolean { return this._destroyed; }

  bootstrapFactory(): void {

  }

  bootstrap(componentsOrFactories: Array<ClassType<any> | ComponentFactory<any> |
    Array<ClassType<any> | ComponentFactory<any>>>): void {
    const flattened = ListWrapper.flatten
      <ClassType<any> | ComponentFactory<any>>(componentsOrFactories);
    this._app.bootstrap(flattened);
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
  ApplicationRef
];

export const platformBrowser = createPlatformFactory([PLATFORM_PROVIDERS]);
