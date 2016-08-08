"use strict";
(function (LifecycleHooks) {
    LifecycleHooks[LifecycleHooks["OnInit"] = 0] = "OnInit";
    LifecycleHooks[LifecycleHooks["OnChanges"] = 1] = "OnChanges";
    LifecycleHooks[LifecycleHooks["OnRender"] = 2] = "OnRender";
    LifecycleHooks[LifecycleHooks["OnDestroy"] = 3] = "OnDestroy";
})(exports.LifecycleHooks || (exports.LifecycleHooks = {}));
var LifecycleHooks = exports.LifecycleHooks;
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
var OnRender = (function () {
    function OnRender() {
    }
    return OnRender;
}());
exports.OnRender = OnRender;
var OnDestroy = (function () {
    function OnDestroy() {
    }
    return OnDestroy;
}());
exports.OnDestroy = OnDestroy;
//# sourceMappingURL=lifecycle_hooks.js.map