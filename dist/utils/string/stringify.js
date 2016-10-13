"use strict";
var class_1 = require('../class/class');
function stringify(token) {
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
        return class_1.getClassName(token);
    }
    if (token instanceof HTMLElement) {
        var parts = token.toString().match(/\w+/g);
        if (parts && parts.length) {
            return parts[parts.length - 1];
        }
    }
    var res = token.toString();
    var newLineIndex = res.indexOf('\n');
    return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}
exports.stringify = stringify;
//# sourceMappingURL=stringify.js.map