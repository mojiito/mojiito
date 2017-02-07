/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export class ListWrapper {
  static findLast<T>(arr: T[], condition: (value: T) => boolean): T {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (condition(arr[i])) {
        return arr[i];
      }
    }
    return null;
  }

  static removeAll<T>(list: T[], items: T[]) {
    for (let i = 0; i < items.length; ++i) {
      const index = list.indexOf(items[i]);
      if (index > -1) {
        list.splice(index, 1);
      }
    }
  }

  static remove<T>(list: T[], el: T): boolean {
    const index = list.indexOf(el);
    if (index > -1) {
      list.splice(index, 1);
      return true;
    }
    return false;
  }

  static equals(a: any[], b: any[]): boolean {
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  static flatten<T>(list: Array<T | T[]>): T[] {
    return list.reduce((flat: any[], item: T | T[]): T[] => {
      const flatItem = Array.isArray(item) ? ListWrapper.flatten(item) : item;
      return (<T[]>flat).concat(flatItem);
    }, []);
  }

  static forEach(list: ArrayLike<any>, callback: (item: any, index: number) => void): void {
    for (let i = 0, max = list.length; i < max; i++) {
      callback.call(callback, list[i], i);
    }
  }
}
