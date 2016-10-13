"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stringify_1 = require('../../utils/string/stringify');
var metadata_1 = require('../di/metadata');
var DirectiveMetadata = (function (_super) {
    __extends(DirectiveMetadata, _super);
    function DirectiveMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, selector = _b.selector, inputs = _b.inputs, outputs = _b.outputs, providers = _b.providers, directives = _b.directives;
        _super.call(this);
        this.selector = selector;
        this.inputs = inputs;
        this.outputs = outputs;
        this.providers = providers;
        this.directives = directives;
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
        var _b = _a === void 0 ? {} : _a, changeDetection = _b.changeDetection, selector = _b.selector, inputs = _b.inputs, outputs = _b.outputs, host = _b.host, providers = _b.providers, directives = _b.directives, templateUrl = _b.templateUrl, template = _b.template, styleUrls = _b.styleUrls, styles = _b.styles;
        _super.call(this, { selector: selector, inputs: inputs, outputs: outputs, providers: providers, directives: directives });
        this.changeDetection = changeDetection;
        this.host = host;
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