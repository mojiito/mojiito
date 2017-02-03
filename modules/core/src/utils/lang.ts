import { ClassType } from '../type';

/**
 * Returns the class name of a type.
 *
 * @export
 * @template T
 * @param {ClassType<T>} klass
 * @returns
 */
export function getClassName<T>(klass: ClassType<T>) {
  return klass.name ? klass.name : /^function\s+([\w\$]+)\s*\(/.exec(this.toString())[1];
}

/**
 * Tries to stringify a token. A token can be any type.
 *
 * @export
 * @param {*} token
 * @returns {string}
 */
export function stringify(token: any): string {
  if (typeof token === 'string') {
    return token;
  }

  if (token === undefined || token === null) {
    return '' + token;
  }
  if (token.name) {
    return token.name;
  }
  if (token.overriddenName) {
    return token.overriddenName;
  }
  if (typeof token === 'function') {
      return getClassName(token);
  }
  if (token instanceof HTMLElement) {
    let parts = token.toString().match(/\w+/g);
    if (parts && parts.length) {
      return parts[parts.length - 1];
    }
  }

  var res = token.toString();
  var newLineIndex = res.indexOf('\n');
  return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}
