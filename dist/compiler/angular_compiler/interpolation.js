/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var utils_1 = require('../../utils/utils');
var INTERPOLATION_BLACKLIST_REGEXPS = [
    /^\s*$/,
    /[<>]/,
    /^[{}]$/,
    /&(#|[a-z])/i,
    /^\/\//,
];
function assertInterpolationSymbols(identifier, value) {
    if (utils_1.isPresent(value) && !(utils_1.isArray(value) && value.length == 2)) {
        throw new Error("Expected '" + identifier + "' to be an array, [start, end].");
    }
}
exports.assertInterpolationSymbols = assertInterpolationSymbols;
var InterpolationConfig = (function () {
    function InterpolationConfig(start, end) {
        this.start = start;
        this.end = end;
    }
    InterpolationConfig.fromArray = function (markers) {
        if (!markers) {
            return exports.DEFAULT_INTERPOLATION_CONFIG;
        }
        assertInterpolationSymbols('interpolation', markers);
        return new InterpolationConfig(markers[0], markers[1]);
    };
    ;
    return InterpolationConfig;
}());
exports.InterpolationConfig = InterpolationConfig;
exports.DEFAULT_INTERPOLATION_CONFIG = new InterpolationConfig('{{', '}}');
//# sourceMappingURL=interpolation.js.map