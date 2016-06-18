import { Directive, IDirectiveMetadata } from './directive';

export interface IControllerMetadata extends IDirectiveMetadata {
    actions?: Object;
}

export function Controller(meta: IControllerMetadata): ClassDecorator {
    return Directive(meta);
}