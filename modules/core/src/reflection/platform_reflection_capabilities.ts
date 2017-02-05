/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { ClassType } from '../type';
import { GetterFn, MethodFn, SetterFn } from './types';

export interface PlatformReflectionCapabilities {
  isReflectionEnabled(): boolean;
  factory(type: ClassType<any>): Function;
  hasLifecycleHook(type: any, lcProperty: string): boolean;
  parameters(type: ClassType<any>): any[][];
  annotations(type: ClassType<any>): any[];
  propMetadata(typeOrFunc: ClassType<any>): { [key: string]: any[] };
  getter(name: string): GetterFn;
  setter(name: string): SetterFn;
  method(name: string): MethodFn;
  importUri(type: ClassType<any>): string;
  resolveIdentifier(name: string, moduleUrl: string, runtime: any): any;
  resolveEnum(enumIdentifier: any, name: string): any;
}
