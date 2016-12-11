import { CompiledDirectiveResult } from './compiler';
import { Injector } from '../core/di/di';
import { ComponentRef } from '../core/directive/factory';
export declare function createComponent<T>(component: CompiledDirectiveResult<T>, parentInjector: Injector, nativeElement: Element): ComponentRef<T>;
