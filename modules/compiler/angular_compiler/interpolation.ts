/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {isArray, isBlank, isPresent, isString} from '../../utils/utils';

const INTERPOLATION_BLACKLIST_REGEXPS = [
  /^\s*$/,        // empty
  /[<>]/,         // html tag
  /^[{}]$/,       // i18n expansion
  /&(#|[a-z])/i,  // character reference,
  /^\/\//,        // comment
];

export function assertInterpolationSymbols(identifier: string, value: any): void {
  if (isPresent(value) && !(isArray(value) && value.length == 2)) {
    throw new Error(`Expected '${identifier}' to be an array, [start, end].`);
  }
}

export class InterpolationConfig {
  static fromArray(markers: [string, string]): InterpolationConfig {
    if (!markers) {
      return DEFAULT_INTERPOLATION_CONFIG;
    }

    assertInterpolationSymbols('interpolation', markers);
    return new InterpolationConfig(markers[0], markers[1]);
  }

  constructor(public start: string, public end: string){};
}

export const DEFAULT_INTERPOLATION_CONFIG: InterpolationConfig =
    new InterpolationConfig('{{', '}}');