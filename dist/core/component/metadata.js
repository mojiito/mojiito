"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var debug_1 = require('../../debug/debug');
var stringify_1 = require('../../utils/string/stringify');
var metadata_1 = require('../di/metadata');
var DirectiveMetadata = (function (_super) {
    __extends(DirectiveMetadata, _super);
    function DirectiveMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, selector = _b.selector, inputs = _b.inputs, outputs = _b.outputs, host = _b.host, providers = _b.providers;
        _super.call(this);
        // Check if a selector is specified in the metadata.
        // Every directive must have a selector
        debug_1.assert(typeof selector === 'string', "The directive metadata object on your class must specify a selector!", TypeError);
        selector = selector.trim();
        // Check if selector contains only one level of dom nodes
        // Ok: .my-selector
        // Not allowed: .parent .my-selector
        debug_1.assert(selector.indexOf(' ') === -1, "The selector \"" + selector + "\" contains more than one levels of nodes. Only one is allowed!", SyntaxError);
        // Check if selector is valid
        debug_1.assert(!!selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/), "The directive selector \"" + selector + "\" is not valid", SyntaxError);
        // Parsing the selector string to an array
        // 'my-element.class1#id[attribute1].class2[attribute2="value"]'
        // to
        // ["my-element", ".class1", "#id", "[attribute1]", ".class2", "[attribute2="value"]"]   
        var selectorList = selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');
        for (var i = 0, max = selectorList.length; i < max; i++) {
            var selectorPart = selectorList[i];
            if (!selectorPart.length) {
                continue;
            }
            // Check if the selector contains element names whicht are not allowed
            // eg. custom elements without a "-" in it
            debug_1.assert(!selectorPart.match(/^\w+(-\w+)*$/) || !(document.createElement(selectorPart) instanceof HTMLUnknownElement), "The selector \"" + selector + "\" contains an element name \"" + selectorPart + "\" which is not allowed. \n                If you are using a custom element, there has to be a \"-\" char in it. E.g.: my-component", SyntaxError);
        }
        this.selector = selector;
        this.inputs = inputs;
        this.outputs = outputs;
        this.host = host;
        this.providers = providers;
    }
    DirectiveMetadata.prototype.toString = function () { return "@DirectiveMetadata()"; };
    return DirectiveMetadata;
}(metadata_1.InjectableMetadata));
exports.DirectiveMetadata = DirectiveMetadata;
/**
 * The component directive allows you to attach behavior (a class) to elements in the DOM
 * using a class decorator or the {@link registerDirective} function.
 *
 * A component directive contains metadata (including the elements selector)
 * and a class which will be attached to the elements.
 *
 * Assume this HTML Template or DOM
 * ```html
 * <form class="form">
 *   <div>
 *     <div my-component>
 *       <div>
 *         <div></div>
 *       </div>
 *       <div></div>
 *     </div>
 *   </div>
 * </form>
 * ```
 *
 * ```typescript
 * @Component({ selector: '[my-component]'})
 * class MyComponent {
 *  // Your Code
 * }
 * ```
 *
 * @export
 * @class ComponentMetadata
 * @extends {DirectiveMetadata}
 */
var ComponentMetadata = (function (_super) {
    __extends(ComponentMetadata, _super);
    function ComponentMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, changeDetection = _b.changeDetection, selector = _b.selector, inputs = _b.inputs, outputs = _b.outputs, host = _b.host, providers = _b.providers, templateUrl = _b.templateUrl, template = _b.template, styleUrls = _b.styleUrls, styles = _b.styles;
        _super.call(this, { selector: selector, inputs: inputs, outputs: outputs, host: host, providers: providers });
        this.changeDetection = changeDetection;
        this.templateUrl = templateUrl;
        this.template = template;
        this.styles = styles;
        this.styleUrls = styleUrls;
    }
    ComponentMetadata.prototype.toString = function () { return "@ComponentMetadata()"; };
    return ComponentMetadata;
}(DirectiveMetadata));
exports.ComponentMetadata = ComponentMetadata;
var InputMetadata = (function () {
    function InputMetadata(bindingPropertyName) {
        this.bindingPropertyName = bindingPropertyName;
    }
    InputMetadata.prototype.toString = function () { return "@InputMetadata(" + stringify_1.stringify(this.bindingPropertyName) + ")"; };
    return InputMetadata;
}());
exports.InputMetadata = InputMetadata;
var OutputMetadata = (function () {
    function OutputMetadata(bindingPropertyName) {
        this.bindingPropertyName = bindingPropertyName;
    }
    OutputMetadata.prototype.toString = function () { return "@OutputMetadata(" + stringify_1.stringify(this.bindingPropertyName) + ")"; };
    return OutputMetadata;
}());
exports.OutputMetadata = OutputMetadata;
//# sourceMappingURL=metadata.js.map