import { ClassType } from '../../utils/class/class';
import { HostElement } from '../view/host';
import { Injector } from '../di/di';
export declare class ComponentReference<C> {
    private _hostElement;
    private _componentType;
    constructor(hostElement: HostElement, componentType: ClassType<C>);
    hostElement: HostElement;
    instance: C;
    injector: Injector;
    componentType: ClassType<C>;
    parse(): void;
    destroy(): void;
}
