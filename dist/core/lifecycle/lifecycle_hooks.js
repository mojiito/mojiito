"use strict";
(function (LifecycleHook) {
    LifecycleHook[LifecycleHook["OnInit"] = 0] = "OnInit";
    LifecycleHook[LifecycleHook["OnChanges"] = 1] = "OnChanges";
    LifecycleHook[LifecycleHook["OnBeforeCheck"] = 2] = "OnBeforeCheck";
    LifecycleHook[LifecycleHook["OnAfterCheck"] = 3] = "OnAfterCheck";
    LifecycleHook[LifecycleHook["OnRender"] = 4] = "OnRender";
    LifecycleHook[LifecycleHook["OnParse"] = 5] = "OnParse";
    LifecycleHook[LifecycleHook["OnDestroy"] = 6] = "OnDestroy";
})(exports.LifecycleHook || (exports.LifecycleHook = {}));
var LifecycleHook = exports.LifecycleHook;
var hooks = [
    'onInit',
    'onChanges',
    'onBeforeCheck',
    'onAfterCheck',
    'onRender',
    'onParse',
    'onDestro'
];
var OnInit = (function () {
    function OnInit() {
    }
    return OnInit;
}());
exports.OnInit = OnInit;
var OnChanges = (function () {
    function OnChanges() {
    }
    return OnChanges;
}());
exports.OnChanges = OnChanges;
var OnBeforeCheck = (function () {
    function OnBeforeCheck() {
    }
    return OnBeforeCheck;
}());
exports.OnBeforeCheck = OnBeforeCheck;
var OnAfterCheck = (function () {
    function OnAfterCheck() {
    }
    return OnAfterCheck;
}());
exports.OnAfterCheck = OnAfterCheck;
var OnRender = (function () {
    function OnRender() {
    }
    return OnRender;
}());
exports.OnRender = OnRender;
var OnParse = (function () {
    function OnParse() {
    }
    return OnParse;
}());
exports.OnParse = OnParse;
var OnDestroy = (function () {
    function OnDestroy() {
    }
    return OnDestroy;
}());
exports.OnDestroy = OnDestroy;
function triggerLifecycleHook(hook, instance) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var name = hooks[hook];
    if (instance && typeof instance[name] === 'function') {
        instance[name].apply(instance, args);
    }
}
exports.triggerLifecycleHook = triggerLifecycleHook;
//# sourceMappingURL=lifecycle_hooks.js.map