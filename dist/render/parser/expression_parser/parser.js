"use strict";
var executable_1 = require('./executable');
var ExpressionParser = (function () {
    function ExpressionParser(expession) {
        this.expession = expession;
    }
    ExpressionParser.prototype.parse = function (requestContextForToken) {
        return new executable_1.Executable(this.expession, requestContextForToken);
    };
    return ExpressionParser;
}());
exports.ExpressionParser = ExpressionParser;
//# sourceMappingURL=parser.js.map