import { createClassDecorator } from '../utils/decorator';
import { stringify } from '../facade';

export class ComponentMetadata {
  selector: string;
  constructor({ selector }: { selector?: string } = {}) {
    this.selector = selector;
  }
  get name(): string { return `@Component`; };
  toString(): string { return `@Component({${this.selector}})`; };
}

export interface ComponentMetadataFactory {
    (metadata: {
        selector?: string
    }): ClassDecorator;
}

// tslint:disable-next-line:variable-name
export const Component = createClassDecorator(ComponentMetadata) as ComponentMetadataFactory;
