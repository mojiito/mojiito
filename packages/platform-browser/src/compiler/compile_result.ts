import { ClassType, ComponentFactory, ViewDefinitionFactory, Visitor } from 'mojiito-core';
import { CssSelector } from '../selector';

export interface CompileComponentSummary {
  type: ClassType<any>;
  selector: CssSelector[];
  hostListeners: { [key: string]: string };
  childListeners: { [key: string]: string };
  componentFactory: ComponentFactory<any>;
  viewDefinitionFactory: ViewDefinitionFactory;
  components: CompileComponentSummary[] | null;
  visitor: Visitor;
  parent: CompileComponentSummary | null;
}
