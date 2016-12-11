/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Injector } from '../di/injector';
import { AppView } from './view';

const _UNDEFINED:any = undefined;

export class ElementInjector extends Injector {
    constructor(private _view: AppView<any>, private _nodeIndex: number) {
        super([]);
    }

    get(token: any): any {
        var result = _UNDEFINED;
        if (result === _UNDEFINED) {
            result = this._view.injectorGet(token, this._nodeIndex);
        }
        if (result === _UNDEFINED) {
            result = this._view.parentInjector.get(token);
        }
        return result;
    }
}