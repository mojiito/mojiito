import { createClassDecorator } from '../utils/decorator';
import { ComponentMetadata } from './metadata';

export interface ComponentMetadataFactory {
    (metadata: {
        selector?: string
    }): ClassDecorator;
}

// tslint:disable-next-line:variable-name
export const Component: ComponentMetadataFactory =
  <ComponentMetadataFactory>createClassDecorator(ComponentMetadata);
