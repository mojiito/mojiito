"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var debug_1 = require('../../debug/debug');
var di_1 = require('../../core/di/di');
var context_1 = require('./context');
var DOMParser = (function () {
    function DOMParser() {
        this.elementHooks = [];
        this.attributeHooks = [];
    }
    DOMParser.prototype.parseTree = function (rootElement, context, skipRootElement) {
        if (typeof context === 'boolean') {
            skipRootElement = context;
        }
        this.parseNode(rootElement, new context_1.ContextTree(context), skipRootElement);
    };
    DOMParser.prototype.parseNode = function (element, contextTree, skipRootElement) {
        if (skipRootElement === void 0) { skipRootElement = false; }
        if (!(element instanceof Element)) {
            throw new Error('The property element has to be an Element');
        }
        if (!skipRootElement) {
            contextTree.down();
        }
        // Skip script and styles elements
        var tagName = element.tagName.toUpperCase();
        if (tagName.toUpperCase() === 'SCRIPT' || tagName.toUpperCase() === 'STYLES') {
            return;
        }
        var elementHooks = this.elementHooks;
        var parseFunctions = [];
        var afterParseFunctions = [];
        if (element.hasAttribute(DOMParser.PARSED_ELEMENT_ATTR)) {
            skipRootElement = true;
        }
        if (!skipRootElement) {
            for (var i = 0, max = elementHooks.length; i < max; i++) {
                var elementHook = elementHooks[i];
                if (elementHook.predicate(element)) {
                    if (elementHook.onBeforeParse) {
                        try {
                            contextTree.add(elementHook.onBeforeParse(element, contextTree));
                        }
                        catch (ex) {
                            debug_1.Logger.log(debug_1.LogLevel.error, ex, debug_1.LogType.error);
                        }
                    }
                    (function (hook, element) {
                        if (hook.onParse)
                            parseFunctions.push(function (context) { hook.onParse(element, context); });
                        if (hook.onAfterParse)
                            afterParseFunctions.push(function (context) { hook.onAfterParse(element, context); });
                    })(elementHook, element);
                }
            }
            var attributes = element.attributes;
            var attributeHooks = this.attributeHooks;
            var diff = 0;
            for (var i = 0, max = attributes.length; i < max; i++) {
                var attribute = attributes[i - diff];
                if (attribute.name === DOMParser.PARSED_ELEMENT_ATTR) {
                    continue;
                }
                for (var j = 0, max_1 = attributeHooks.length; j < max_1; j++) {
                    var attributeHook = attributeHooks[j];
                    if (attributeHook.predicate(attribute)) {
                        if (attributeHook.onBeforeParse) {
                            try {
                                contextTree.add(attributeHook.onBeforeParse(element, attribute, contextTree));
                            }
                            catch (ex) {
                                debug_1.Logger.log(debug_1.LogLevel.critical, ex, debug_1.LogType.error);
                            }
                        }
                        if (attributeHook.removeAttributeNode) {
                            element.removeAttributeNode(attribute);
                            diff++;
                        }
                        (function (hook, element, attribute) {
                            if (hook.onParse)
                                parseFunctions.push(function (context) { hook.onParse(element, attribute, context); });
                            if (hook.onAfterParse)
                                afterParseFunctions.push(function (context) { hook.onAfterParse(element, attribute, context); });
                        })(attributeHook, element, attribute);
                    }
                }
            }
            for (var i = 0, max = parseFunctions.length; i < max; i++) {
                parseFunctions[i](contextTree);
            }
        }
        // loop through child nodes and recursively parse them       
        var nodes = element.childNodes;
        for (var i = 0, max = nodes.length; i < max; i++) {
            var node = nodes[i];
            var nodeType = node.nodeType;
            if (nodeType !== Node.ELEMENT_NODE && nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                continue;
            }
            if (node instanceof Element) {
                this.parseNode(node, contextTree);
            }
        }
        if (!skipRootElement) {
            for (var i = 0, max = afterParseFunctions.length; i < max; i++) {
                afterParseFunctions[i](contextTree);
            }
        }
        element.setAttribute(DOMParser.PARSED_ELEMENT_ATTR, '');
        if (!skipRootElement) {
            contextTree.up();
        }
    };
    DOMParser.prototype.registerElementHook = function (hook) {
        this.elementHooks.push(hook);
    };
    DOMParser.prototype.registerAttributeHook = function (hook) {
        this.attributeHooks.push(hook);
    };
    DOMParser.PARSED_ELEMENT_ATTR = '_mparsed';
    DOMParser = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DOMParser);
    return DOMParser;
}());
exports.DOMParser = DOMParser;
//# sourceMappingURL=dom_parser.js.map