"use strict";
var Executable = (function () {
    function Executable(expression, requestContextForToken) {
        this._contexts = [];
        var pattern = /\$?\b\w+(\.\w+)*\b/g;
        var executableString = "";
        var lastIndex = 0;
        var match;
        var contexts = [];
        while (match = pattern.exec(expression)) {
            var token = expression.substr(match.index, pattern.lastIndex - match.index);
            contexts.push(requestContextForToken(token.split('.')[0]));
            executableString += expression.substr(lastIndex, match.index - lastIndex) + 'arguments[' + (contexts.length - 1) + '].' + token;
            lastIndex = pattern.lastIndex;
        }
        executableString += expression.substr(lastIndex, expression.length);
        this._executableFn = Function(executableString);
        this._contexts = contexts;
    }
    Executable.prototype.execute = function () {
        return this._executableFn.apply(this._executableFn, this._contexts);
    };
    return Executable;
}());
exports.Executable = Executable;
//# sourceMappingURL=executable.js.map