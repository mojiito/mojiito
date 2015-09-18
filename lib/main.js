import ENV from './environment';
import { get, set, isArray, isObject, isBoolean, isNumber, isString, isFunction, isEmpty, typeOf, extend, parseJSON, generateRandomString } from './utils';
import { querySelector, querySelectorAll, getAttribute, setAttribute, getDataParams, addEventListener, hasClass, addClass, removeClass } from './dom';
import CoreObject from './core-object';
import Controller from './controller';
import { register, registerController, applyController, getControllersByParam, getControllerById, getControllerByRef, getControllersByClassName } from './core';
import { observer, addObserver, applyObserver, getObservers, callObserver } from './observer';
import { applyComputed, getComputedProperty, computed } from './computed';

const Mojito = {
    // core
    ENV: ENV,
    register: register,
    registerController: registerController,
    Controller: Controller,
    CoreObject: CoreObject,
    getControllersByParam: getControllersByParam,
    getControllerById: getControllerById,
    getControllerByRef: getControllerByRef,
    getControllersByClassName: getControllersByClassName,

    // public
    get: get,
    set: set,
    isArray: isArray,
    isObject: isObject,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isString: isString,
    isFunction: isFunction,
    isEmpty: isEmpty,
    typeOf: typeOf,
    extend: extend,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll,
    getAttribute: getAttribute,
    setAttribute: setAttribute,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    getDataParams: getDataParams,
    parseJSON: parseJSON,
    generateRandomString: generateRandomString,
    addEventListener: addEventListener,
    addObserver: addObserver,
    getObservers: getObservers,
    applyObserver: applyObserver,
    callObserver: callObserver,
    observer: observer,
    applyComputed: applyComputed,
    getComputedProperty: getComputedProperty,
    computed: computed,

    // intern
    _controllerInstances: [],
    _ids: [],
    _observers: []
};

// make Mojito a global object
if(typeof window !== 'undefined') {
    window.Mojito = Mojito;
}

export default Mojito;
