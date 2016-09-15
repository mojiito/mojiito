"use strict";
var lexer_1 = require('./angular_compiler/lexer');
var TemplateBuilder = (function () {
    function TemplateBuilder() {
        this._index = -1;
        this._activeTag = function (tokens) { };
    }
    TemplateBuilder.prototype.build = function () {
        this._attachInstruction('start');
        while (this._peek.type !== lexer_1.TokenType.EOF) {
            if (this._peek.type === lexer_1.TokenType.TAG_OPEN_START) {
            }
            else if (this._peek.type === lexer_1.TokenType.TAG_CLOSE) {
            }
            else if (this._peek.type === lexer_1.TokenType.CDATA_START) {
            }
            else if (this._peek.type === lexer_1.TokenType.COMMENT_START) {
            }
            else if (this._peek.type === lexer_1.TokenType.TEXT || this._peek.type === lexer_1.TokenType.RAW_TEXT ||
                this._peek.type === lexer_1.TokenType.ESCAPABLE_RAW_TEXT) {
            }
            else if (this._peek.type === lexer_1.TokenType.EXPANSION_FORM_START) {
            }
            else {
                // Skip all other tokens...
                this._advance();
            }
            this._advance();
        }
        return this._result;
    };
    TemplateBuilder.prototype._advance = function () {
        var prev = this._peek;
        if (this._index < this.tokens.length - 1) {
            this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev;
    };
    TemplateBuilder.prototype._consumeStartTag = function (startTagToken) {
        var prefix = startTagToken.parts[0];
        var name = startTagToken.parts[1];
        this._attachInstruction('createTag', name);
    };
    TemplateBuilder.prototype._attachInstruction = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._result += TEMPLATE_DICTIONARY[key].apply(this, args) + ';';
    };
    return TemplateBuilder;
}());
exports.TemplateBuilder = TemplateBuilder;
var TEMPLATE_DICTIONARY = {
    start: '',
    end: '',
    createTag: function (name) { return ("document.createElement(" + name + ")"); },
    setAttribute: function (name, value) { return ("document.setAttribute(" + name + "," + value + ")"); },
};
//# sourceMappingURL=template_builder.js.map