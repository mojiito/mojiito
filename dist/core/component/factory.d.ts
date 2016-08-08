import { ClassType } from '../../utils/class/class';
import { ComponentReference } from './reference';
import { Injector } from '../di/di';
export declare class ComponentFactory<C> {
    private _componentType;
    constructor(componentType: ClassType<C>);
    componentType: ClassType<C>;
    create(injector: Injector, nativeElement: Element): ComponentReference<C>;
}
