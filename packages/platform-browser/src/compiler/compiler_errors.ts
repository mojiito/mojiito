import { BaseError } from '../facade/error';
import { stringify } from '../facade/lang';
import { Type } from 'mojiito-core';

export class NoAnnotationError extends BaseError {
  constructor(typeOrFunc: Type<any> | Function, params: any[][]) {
    super(NoAnnotationError._genMessage(typeOrFunc, params));
  }

  private static _genMessage(typeOrFunc: Type<any> | Function, params: any[][]) {
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
