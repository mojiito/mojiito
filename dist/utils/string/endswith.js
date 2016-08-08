"use strict";
function endsWith(str, searchString, position) {
    var prototype = String.prototype;
    if (typeof prototype.endsWith === 'function') {
        return prototype.endsWith.call(str, searchString, position);
    }
    else {
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > str.length) {
            position = str.length;
        }
        position -= searchString.length;
        var lastIndex = str.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    }
}
exports.endsWith = endsWith;
//# sourceMappingURL=endswith.js.map