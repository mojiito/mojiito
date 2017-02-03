import { ClassType } from '../type';
import { ApplicationRef } from '../application/application';
import { ComponentFactory } from '../component/factory';

export function bootstrap(componentsOrFactories: Array<ClassType<any> | ComponentFactory<any>>,
  rootElement: Element = document.documentElement): ApplicationRef {

  const app = new ApplicationRef(rootElement);
  app.bootstrap(componentsOrFactories);
  return app;
}
