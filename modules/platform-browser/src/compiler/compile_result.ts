import { ClassType, Renderer, ComponentFactory } from 'mojiito-core';

export interface CompileComponentSummary {
  type: ClassType<any>;
  selector: string;
  hostListeners: { [key: string]: string };
  childListeners: { [key: string]: string };
  rendererType: ClassType<Renderer>;
  componentFactory: ComponentFactory<any>;
  viewDefinitionFactory: () => any;
  components: CompileComponentSummary[];
}
