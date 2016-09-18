"use strict";
var utils_1 = require('../utils/utils');
var debug_1 = require('../debug/debug');
var CONTEXT_REGEXP = /([\$\.\w\d]+)/g;
var ExpressionParser = (function () {
    function ExpressionParser() {
    }
    ExpressionParser.prototype.parse = function (expressionString) {
        debug_1.assert(!utils_1.isEmpty(expressionString), "Expressions can not be empty", TypeError);
        var contexts = expressionString.match(CONTEXT_REGEXP);
        console.log(contexts);
    };
    return ExpressionParser;
}());
exports.ExpressionParser = ExpressionParser;
var Expression = (function () {
    function Expression() {
    }
    return Expression;
}());
exports.Expression = Expression;
//# sourceMappingURL=expression.js.map