import { ComponentResolver } from './src/component/resolver';
import { reflector, Reflector } from './src/reflection/reflection';
import { ReflectorReader } from './src/reflection/reflector_reader';
import {
  Provider, ClassProvider, ExistingProvider,
  FactoryProvider, TypeProvider, ValueProvider
} from './src/di/provider';

// Platform & Application
export { createPlatformFactory, getPlatform, PlatformRef } from './src/application/platform';
export { ApplicationRef } from './src/application/application';

// Component
export { Component, HostListener, ChildListener } from './src/component/metadata';
export { ComponentResolver };
export { ComponentFactory, createComponentFactory } from './src/component/factory';
export { ComponentFactoryResolver } from './src/component/factory_resolver';
export { ComponentRef } from './src/component/reference';

// View
export { ViewData } from './src/view/types';
export {  } from './src/view/view';
export { ViewRef } from './src/view/view_ref';
export { ViewContainerRef } from './src/view/view_container_ref';
export { ElementRef } from './src/view/element_ref';

// Dependency Injection
export { forwardRef } from './src/di/forward_ref';
export { InjectionToken } from './src/di/injection_token';
export { Injector } from './src/di/injector';
export { Host, Inject, Injectable, Optional, Self, SkipSelf } from './src/di/metadata';
export {
  Provider, ClassProvider, ExistingProvider,
  FactoryProvider, TypeProvider, ValueProvider
};
export { ReflectiveInjector, ReflectiveInjector_ } from './src/di/reflective_injector';
export { ReflectiveKey } from './src/di/reflective_key';
export {
  ReflectiveDependency, ResolvedReflectiveFactory, ResolvedReflectiveProvider,
  ResolvedReflectiveProvider_, resolveReflectiveProviders, mergeResolvedReflectiveProviders
} from './src/di/reflective_provider';
export { reflector, ReflectorReader, Reflector }

// Others
export * from './src/type';
export * from './src/render';

// Providers
export const CORE_PROVIDERS: Provider[] = [
  { provide: ReflectorReader, useValue: reflector },
  ComponentResolver,
];
