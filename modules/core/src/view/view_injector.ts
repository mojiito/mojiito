import { Injector } from '../di/injector';
import { ViewData } from './types';

// tslint:disable-next-line:class-name
export class ViewInjector implements Injector {
  constructor(private view: ViewData) {}

  get(token: any, notFoundValue: any = Injector.THROW_IF_NOT_FOUND): any {
    // const allowPrivateServices = (this.elDef.flags & NodeFlags.ComponentView) !== 0;
    // return Services.resolveDep(
    //     this.view, this.elDef, allowPrivateServices,
    //     {flags: DepFlags.None, token, tokenKey: tokenKey(token)}, notFoundValue);
  }
}

export function createViewInjector(view: ViewData): Injector {
  return new ViewInjector(view);
}
