import { ClassType, ComponentFactory } from 'mojiito-core';
import { CssSelector } from '../selector';

export interface CompileComponentSummary {
  type: ClassType<any>;
  selector: CssSelector[];
  hostListeners: { [key: string]: string };
  childListeners: { [key: string]: string };
  componentFactory: ComponentFactory<any>;
  viewDefinitionFactory: () => any;
  components: CompileComponentSummary[];
}
