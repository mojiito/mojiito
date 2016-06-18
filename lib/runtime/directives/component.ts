import { Directive, IDirectiveMetadata } from './directive';

export interface IComponentMetadata extends IDirectiveMetadata {
    actions?: Object;
}

export function Component(meta: IComponentMetadata): ClassDecorator {
    return Directive(meta);
}