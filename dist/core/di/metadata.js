"use strict";
var stringify_1 = require('../../utils/string/stringify');
var InjectableMetadata = (function () {
    function InjectableMetadata() {
    }
    InjectableMetadata.prototype.toString = function () { return "@Injectable()"; };
    return InjectableMetadata;
}());
exports.InjectableMetadata = InjectableMetadata;
var InjectMetadata = (function () {
    function InjectMetadata(token) {
        this.token = token;
    }
    InjectMetadata.prototype.toString = function () { return "@Inject(" + stringify_1.stringify(this.token) + ")"; };
    return InjectMetadata;
}());
exports.InjectMetadata = InjectMetadata;
//# sourceMappingURL=metadata.js.map