import { ComponentResolver } from './src/component/resolver';
import { reflector } from './src/reflection/reflection';
import { ReflectorReader } from './src/reflection/reflector_reader';
import {
  Provider, ClassProvider, ExistingProvider,
  FactoryProvider, TypeProvider, ValueProvider
} from './src/di/provider';

export { createPlatformFactory, getPlatform, PlatformRef } from './src/application/platform';
export { ApplicationRef } from './src/application/application';
export { Component } from './src/component/metadata';
export { ComponentResolver };
export { ComponentFactory } from './src/component/factory';
export { ComponentFactoryResolver } from './src/component/factory_resolver';
export { ComponentRef } from './src/component/reference';
export { AppView } from './src/component/view';
export { ElementRef } from './src/element_ref';
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
export { reflector, Reflector } from './src/reflection/reflection';
export * from './src/type';
export * from './src/render';
export * from './src/benchmark'

export const CORE_PROVIDERS: Provider[] = [
  { provide: ReflectorReader, useValue: reflector },
  ComponentResolver,
];
