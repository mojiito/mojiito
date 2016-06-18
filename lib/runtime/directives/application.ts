import { Directive, IDirectiveMetadata } from './directive';

export interface IApplicationMetadata extends IDirectiveMetadata {
    actions?: Object;
}

export function Application(meta: IApplicationMetadata): ClassDecorator {
    return Directive(meta);
}