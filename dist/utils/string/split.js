"use strict";
function splitAtColon(input, defaultValues) {
    var colonIndex = input.indexOf(':');
    if (colonIndex == -1)
        return defaultValues;
    return [input.slice(0, colonIndex).trim(), input.slice(colonIndex + 1).trim()];
}
exports.splitAtColon = splitAtColon;
//# sourceMappingURL=split.js.map