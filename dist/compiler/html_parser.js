"use strict";
var interpolation_1 = require('./angular_compiler/interpolation');
var html_tags_1 = require('./angular_compiler/html_tags');
var lexer_1 = require('./angular_compiler/lexer');
var HTMLParser = (function () {
    function HTMLParser() {
    }
    HTMLParser.prototype.parse = function (source, urlOrName) {
        var tokensAndErrors = lexer_1.tokenize(source, urlOrName, html_tags_1.getHtmlTagDefinition, false, interpolation_1.DEFAULT_INTERPOLATION_CONFIG);
        // let builder = new TemplateBuilder(tokensAndErrors.tokens);
        // console.log(builder.build());
    };
    return HTMLParser;
}());
exports.HTMLParser = HTMLParser;
//# sourceMappingURL=html_parser.js.map