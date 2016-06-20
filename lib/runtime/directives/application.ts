import { Directive, DirectiveMetadata } from './directive';

export interface ApplicationMetadata extends DirectiveMetadata {
}

export function Application(meta: ApplicationMetadata): ClassDecorator {
    return Directive(meta);
}