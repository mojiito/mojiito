/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { BaseError, WrappedError } from '../facade/error';
import { stringify } from '../facade/lang';
import { ClassType } from '../type';

import { ReflectiveInjector } from './reflective_injector';
import { ReflectiveKey } from './reflective_key';

function findFirstClosedCycle(keys: any[]): any[] {
  const res: any[] = [];
  for (let i = 0; i < keys.length; ++i) {
    if (res.indexOf(keys[i]) > -1) {
      res.push(keys[i]);
      return res;
    }
    res.push(keys[i]);
  }
  return res;
}

function constructResolvingPath(keys: any[]): string {
  if (keys.length > 1) {
    const reversed = findFirstClosedCycle(keys.slice().reverse());
    const tokenStrs = reversed.map(k => stringify(k.token));
    return ' (' + tokenStrs.join(' -> ') + ')';
  }

  return '';
}


/**
 * Base class for all errors arising from misconfigured providers.
 * @stable
 */
export class AbstractProviderError extends BaseError {
  /** @internal */
  message: string;

  /** @internal */
  keys: ReflectiveKey[];

  /** @internal */
  injectors: ReflectiveInjector[];

  /** @internal */
  constructResolvingMessage: Function;

  constructor(
    injector: ReflectiveInjector, key: ReflectiveKey, constructResolvingMessage: Function) {
    super('DI Error');
    this.keys = [key];
    this.injectors = [injector];
    this.constructResolvingMessage = constructResolvingMessage;
    this.message = this.constructResolvingMessage(this.keys);
  }

  addKey(injector: ReflectiveInjector, key: ReflectiveKey): void {
    this.injectors.push(injector);
    this.keys.push(key);
    this.message = this.constructResolvingMessage(this.keys);
  }
}

/**
 * Thrown when trying to retrieve a dependency by key from {@link Injector}, but the
 * {@link Injector} does not have a {@link Provider} for the given key.
 *
 * ### Example ([live demo](http://plnkr.co/edit/vq8D3FRB9aGbnWJqtEPE?p=preview))
 *
 * ```typescript
 * class A {
 *   constructor(b:B) {}
 * }
 *
 * expect(() => Injector.resolveAndCreate([A])).toThrowError();
 * ```
 * @stable
 */
export class NoProviderError extends AbstractProviderError {
  constructor(injector: ReflectiveInjector, key: ReflectiveKey) {
    super(injector, key, function (keys: any[]) {
      const first = stringify(keys[0].token);
      return `No provider for ${first}!${constructResolvingPath(keys)}`;
    });
  }
}

/**
 * Thrown when dependencies form a cycle.
 *
 * ### Example ([live demo](http://plnkr.co/edit/wYQdNos0Tzql3ei1EV9j?p=info))
 *
 * ```typescript
 * var injector = Injector.resolveAndCreate([
 *   {provide: "one", useFactory: (two) => "two", deps: [[new Inject("two")]]},
 *   {provide: "two", useFactory: (one) => "one", deps: [[new Inject("one")]]}
 * ]);
 *
 * expect(() => injector.get("one")).toThrowError();
 * ```
 *
 * Retrieving `A` or `B` throws a `CyclicDependencyError` as the graph above cannot be constructed.
 * @stable
 */
export class CyclicDependencyError extends AbstractProviderError {
  constructor(injector: ReflectiveInjector, key: ReflectiveKey) {
    super(injector, key, function (keys: any[]) {
      return `Cannot instantiate cyclic dependency!${constructResolvingPath(keys)}`;
    });
  }
}

/**
 * Thrown when a constructing type returns with an Error.
 *
 * The `InstantiationError` class contains the original error plus the dependency graph which caused
 * this object to be instantiated.
 *
 * ### Example ([live demo](http://plnkr.co/edit/7aWYdcqTQsP0eNqEdUAf?p=preview))
 *
 * ```typescript
 * class A {
 *   constructor() {
 *     throw new Error('message');
 *   }
 * }
 *
 * var injector = Injector.resolveAndCreate([A]);

 * try {
 *   injector.get(A);
 * } catch (e) {
 *   expect(e instanceof InstantiationError).toBe(true);
 *   expect(e.originalException.message).toEqual("message");
 *   expect(e.originalStack).toBeDefined();
 * }
 * ```
 * @stable
 */
export class InstantiationError extends WrappedError {
  /** @internal */
  keys: ReflectiveKey[];

  /** @internal */
  injectors: ReflectiveInjector[];

  constructor(
    injector: ReflectiveInjector, originalException: any, originalStack: any,
    key: ReflectiveKey) {
    super('DI Error', originalException);
    this.keys = [key];
    this.injectors = [injector];
  }

  addKey(injector: ReflectiveInjector, key: ReflectiveKey): void {
    this.injectors.push(injector);
    this.keys.push(key);
  }

  get message(): string {
    const first = stringify(this.keys[0].token);
    return `${this.originalError.message}: Error during instantiation ` +
      `of ${first}!${constructResolvingPath(this.keys)}.`;
  }

  get causeKey(): ReflectiveKey { return this.keys[0]; }
}

/**
 * Thrown when an object other then {@link Provider} (or `Type`) is passed to {@link Injector}
 * creation.
 *
 * ### Example ([live demo](http://plnkr.co/edit/YatCFbPAMCL0JSSQ4mvH?p=preview))
 *
 * ```typescript
 * expect(() => Injector.resolveAndCreate(["not a type"])).toThrowError();
 * ```
 * @stable
 */
export class InvalidProviderError extends BaseError {
  constructor(provider: any) {
    super(`Invalid provider - only instances of Provider and Type are allowed, got: ${provider}`);
  }
}

/**
 * Thrown when the class has no annotation information.
 *
 * Lack of annotation information prevents the {@link Injector} from determining which dependencies
 * need to be injected into the constructor.
 *
 * ### Example ([live demo](http://plnkr.co/edit/rHnZtlNS7vJOPQ6pcVkm?p=preview))
 *
 * ```typescript
 * class A {
 *   constructor(b) {}
 * }
 *
 * expect(() => Injector.resolveAndCreate([A])).toThrowError();
 * ```
 *
 * This error is also thrown when the class not marked with {@link Injectable} has parameter types.
 *
 * ```typescript
 * class B {}
 *
 * class A {
 *   constructor(b:B) {} // no information about the parameter types of A is available at runtime.
 * }
 *
 * expect(() => Injector.resolveAndCreate([A,B])).toThrowError();
 * ```
 * @stable
 */
export class NoAnnotationError extends BaseError {
  constructor(typeOrFunc: ClassType<any> | Function, params: any[][]) {
    super(NoAnnotationError._genMessage(typeOrFunc, params));
  }

  private static _genMessage(typeOrFunc: ClassType<any> | Function, params: any[][]) {
    const signature: string[] = [];
    for (let i = 0, ii = params.length; i < ii; i++) {
      const parameter = params[i];
      if (!parameter || parameter.length == 0) {
        signature.push('?');
      } else {
        signature.push(parameter.map(stringify).join(' '));
      }
    }
    return 'Cannot resolve all parameters for \'' + stringify(typeOrFunc) + '\'(' +
      signature.join(', ') + '). ' +
      'Make sure that all the parameters are decorated with Inject or have valid type ' +
      'annotations and that \'' + stringify(typeOrFunc) + '\' is decorated with Injectable.';
  }
}

/**
 * Thrown when getting an object by index.
 *
 * ### Example ([live demo](http://plnkr.co/edit/bRs0SX2OTQiJzqvjgl8P?p=preview))
 *
 * ```typescript
 * class A {}
 *
 * var injector = Injector.resolveAndCreate([A]);
 *
 * expect(() => injector.getAt(100)).toThrowError();
 * ```
 * @stable
 */
export class OutOfBoundsError extends BaseError {
  constructor(index: number) { super(`Index ${index} is out-of-bounds.`); }
}

// TODO: add a working example after alpha38 is released
/**
 * Thrown when a multi provider and a regular provider are bound to the same token.
 *
 * ### Example
 *
 * ```typescript
 * expect(() => Injector.resolveAndCreate([
 *   { provide: "Strings", useValue: "string1", multi: true},
 *   { provide: "Strings", useValue: "string2", multi: false}
 * ])).toThrowError();
 * ```
 */
export class MixingMultiProvidersWithRegularProvidersError extends BaseError {
  constructor(provider1: any, provider2: any) {
    super(
      'Cannot mix multi providers and regular providers, got: ' + provider1.toString() + ' ' +
      provider2.toString());
  }
}
