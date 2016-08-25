"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var debug_1 = require('../../../debug/debug');
var stringify_1 = require('../../../utils/string/stringify');
var hooks_1 = require('./hooks');
var view_1 = require('../../../core/view/view');
var reflection_1 = require('../../../core/reflect/reflection');
var metadata_1 = require('../../../core/component/metadata');
var events_1 = require('../../../core/async/events');
var parser_1 = require('../expression_parser/parser');
var EventParserHook = (function (_super) {
    __extends(EventParserHook, _super);
    function EventParserHook() {
        _super.call(this);
        this.removeAttributeNode = true;
    }
    EventParserHook.prototype.predicate = function (attribute) {
        return !!attribute.name.match(/^\(\w+(-\w+)*\)|on-\w+(-\w+)*|data-on-\w+(-\w+)*$/);
    };
    EventParserHook.prototype.onAfterParse = function (element, attribute, context) {
        var view = context.getNearestContextOfType(view_1.View);
        var host = view.hostElement;
        var attrName = attribute.name;
        var eventType;
        var eventExpression = attribute.value;
        debug_1.assert(view instanceof view_1.View, "There is no view, directive or component found for this event " + attribute.name + "=\"" + attribute.value + "\"");
        if (attrName.indexOf('on-') !== -1) {
            eventType = attrName.split('on-')[1];
        }
        else {
            eventType = attrName.match(/\w+(-\w+)*/)[0];
        }
        eventType = eventType.toLowerCase();
        var isComponent = context.getUnfiltered()[0].filter(function (value) { return value.context === view; }).length
            && view.hostElement.componentView === view;
        var eventContextObject = {
            $event: {}
        };
        var exprParser = new parser_1.ExpressionParser(eventExpression);
        var executable = exprParser.parse(function (token) {
            if (token === '$event') {
                return eventContextObject;
            }
            // Check for template var in view
            if (!isComponent && view !== host.componentView && view.getTemplateVar(token, false)) {
                return view.templateVars;
            }
            // Check for template var in component view
            if (!isComponent && host.componentView.getTemplateVar(token, false)) {
                return host.componentView.templateVars;
            }
            // Check for template var in parent component view
            if (isComponent && host.parent.componentView.getTemplateVar(token, false)) {
                return host.parent.componentView.templateVars;
            }
            // Check for var or method in 
            return isComponent ? host.parent.component : host.component;
        });
        if (isComponent) {
            var outputFound_1 = false;
            reflection_1.ClassReflection.peek(view.hostElement.component.constructor).properties.forEach(function (value, key) {
                if (value instanceof metadata_1.OutputMetadata && value.bindingPropertyName.toLowerCase() === eventType) {
                    var emitter = host.component[key];
                    debug_1.assert(emitter instanceof events_1.EventEmitter, "The output property \"" + key + "\" on the component " + stringify_1.stringify(host.component.constructor) + " is not an EventEmitter. Only EventEmitter are allowed!");
                    outputFound_1 = true;
                    emitter.subscribe(function (event) {
                        if (event) {
                            eventContextObject.$event = event;
                        }
                        executable.execute();
                    });
                }
            });
            debug_1.assert(outputFound_1, "There was no output property \"" + attrName + "\" found on the component " + stringify_1.stringify(host.component.constructor) + "!");
        }
        else {
            element.addEventListener(eventType, function (event) {
                if (event) {
                    eventContextObject.$event = event;
                }
                executable.execute();
            });
        }
    };
    return EventParserHook;
}(hooks_1.ParserAttributeHook));
exports.EventParserHook = EventParserHook;
//# sourceMappingURL=event.js.map