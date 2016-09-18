"use strict";
var debug_1 = require('../debug/debug');
var utils_1 = require('../utils/utils');
// See https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/selector.ts#L16
var _SELECTOR_REGEXP = new RegExp('(\\:not\\()|' +
    '([-\\w]+)|' +
    '(#[-\\w]+)|' +
    '(?:\\.([-\\w]+))|' +
    '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])|' +
    '(\\))|' +
    '(\\s*,\\s*)', // ","
'g');
var Selector = (function () {
    function Selector() {
        this.classNames = [];
        this.attributes = [];
    }
    Selector.parse = function (selector) {
        debug_1.assert(selector.indexOf(' ') === -1, "Nesting in a selector \"" + selector + "\" is not allowed!");
        var sel = new Selector();
        var match;
        while (utils_1.isPresent(match = _SELECTOR_REGEXP.exec(selector))) {
            if (utils_1.isPresent(match[1])) {
                throw new Error(":not is currently not supported in a selector \"" + selector + "\"");
            }
            if (utils_1.isPresent(match[2])) {
                sel.setElement(match[2]);
            }
            if (utils_1.isPresent(match[3])) {
                sel.setID(match[3]);
            }
            if (utils_1.isPresent(match[4])) {
                sel.addClassName(match[4]);
            }
            if (utils_1.isPresent(match[5])) {
                sel.addAttribute(match[5], match[6]);
            }
            // if (isPresent(match[7])) {
            // }
            if (utils_1.isPresent(match[8])) {
                throw new Error("Multiple selectors are currently not supported: \"" + selector + "\"");
            }
        }
        return sel;
    };
    Selector.parseElement = function (element) {
        var selector = new Selector();
        selector.setElement(element.tagName.toLowerCase());
        selector.setID(element.id || undefined);
        element.className.split(' ').filter(function (n) { return !!n; }).forEach(function (n) { return selector.addClassName(n); });
        Array.prototype.slice.call(element.attributes)
            .filter(function (a) { return a.name !== 'class' && a.name !== 'id'; })
            .forEach(function (a) { return selector.addAttribute(a.name, a.value); });
        return selector;
    };
    Selector.prototype.setElement = function (name) {
        this.element = name;
    };
    Selector.prototype.setID = function (id) {
        this.id = id;
    };
    Selector.prototype.addAttribute = function (name, value) {
        if (value === void 0) { value = ''; }
        this.attributes.push([name, value]);
    };
    Selector.prototype.addClassName = function (name) {
        this.classNames.push(name.toLowerCase());
    };
    Selector.prototype.match = function (selector) {
        return this._matchElement(selector) && this._matchID(selector) &&
            this._matchClassNames(selector) && this._matchAttributes(selector);
    };
    Selector.prototype._matchElement = function (selector) {
        return utils_1.isPresent(this.element) ? this.element === selector.element : true;
    };
    Selector.prototype._matchID = function (selector) {
        return utils_1.isPresent(this.id) ? this.id === selector.id : true;
    };
    Selector.prototype._matchClassNames = function (selector) {
        if (!utils_1.isEmpty(this.classNames)) {
            if (utils_1.isEmpty(selector.classNames))
                return false;
            return this.classNames.filter(function (n) { return selector.classNames.indexOf(n) !== -1; }).length !== this.classNames.length;
        }
        return true;
    };
    Selector.prototype._matchAttributes = function (selector) {
        if (!utils_1.isEmpty(this.attributes)) {
            if (utils_1.isEmpty(selector.attributes))
                return false;
            var result = this.attributes.filter(function (a1) { return utils_1.isPresent(selector.attributes.find(function (a2) { return a1[0] === a2[0] && a1[1] === a2[1]; })); });
            return result.length === this.attributes.length;
        }
        return true;
    };
    Selector.prototype.toString = function () {
        var result = this.element || '';
        result += (this.id && '#' + this.id) || '';
        result += this.classNames.map(function (n) { return '.' + n; }).join('');
        return result += this.attributes
            .filter(function (a) { return a[0] !== 'class' && a[0] !== 'id'; })
            .map(function (a) {
            var attr = a[0];
            if (a[1]) {
                attr += '="' + a[1] + '"';
            }
            return '[' + attr + ']';
        }).join('');
    };
    return Selector;
}());
exports.Selector = Selector;
//# sourceMappingURL=selector.js.map