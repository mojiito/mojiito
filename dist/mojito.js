(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.computed = computed;
exports.applyComputed = applyComputed;
exports.getComputedProperty = getComputedProperty;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _observer = require('./observer');

function computed() {
    if (arguments.length < 2) {
        throw '[Type Exeption] observer needs at least 2 arguments';
    }

    var fn = arguments[arguments.length - 1];
    var keyNames = Array.prototype.slice.call(arguments, 0, -1);
    var i = keyNames.length;

    if (!Utils.isFunction(fn)) {
        throw '[Type Exeption] last argument has to be a function';
    }

    while (i--) {
        if (!Utils.isString(keyNames[i])) {
            throw '[Type Exeption] all keyNames have to be a string';
        }
    }

    return {
        keyNames: keyNames,
        fn: fn
    };
}

function applyComputed(obj, context) {
    if (!Utils.isObject(obj)) {
        return;
    }

    if (!context) {
        context = obj;
        if (!Utils.get(context, '__meta__', true)) {
            Utils.set(context, '__meta__', {});
        }
        if (Utils.get(context, '__meta__.computedApplied', true)) {
            return;
        }
        Utils.set(context, '__meta__.computedApplied', true);
    }

    var keys = Object.getOwnPropertyNames(obj);
    for (var index in keys) {
        if (obj.hasOwnProperty(keys[index])) {
            var key = keys[index];
            var keySplit = key.split('Computed');
            if (keySplit.length >= 2 && !keySplit[keySplit.length - 1]) {
                var computedKey = keySplit.join('');
                var computedObject = obj[key].call(context);
                var fn = Utils.get(computedObject, 'fn', true);
                var keyNames = Utils.get(computedObject, 'keyNames', true);
                if (Utils.isFunction(fn) && Utils.isArray(keyNames)) {
                    var i = keyNames.length;
                    while (i--) {
                        var keyName = keyNames[i];
                        if (Utils.isString(keyName)) {
                            (0, _observer.addObserver)(context, keyName, function (computedKey, fn, context) {
                                this.set('__meta__.cache.' + computedKey, fn.call(this));
                                (0, _observer.callObserver)(context, computedKey);
                            }, [computedKey, fn, context]);
                            if (i === 0) {
                                (0, _observer.callObserver)(context, keyName);
                            }
                        }
                    }
                }
            }
        }
    }

    if (!!obj.prototype) {
        applyComputed(obj.prototype, context);
    } else if ('__proto__' in obj) {
        applyComputed(obj.__proto__, context);
    }
}

function getComputedProperty(obj, keyName) {
    if (Utils.isObject(obj) && Utils.isString(keyName)) {
        return Utils.get(obj, '__meta__.cache.' + keyName, true);
    }
    return null;
}

},{"./main":7,"./observer":8,"./utils":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _coreObject = require('./core-object');

var _coreObject2 = _interopRequireDefault(_coreObject);

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _core = require('./core');

var Controller = (function (_CoreObject) {
    _inherits(Controller, _CoreObject);

    function Controller() {
        _classCallCheck(this, Controller);

        _get(Object.getPrototypeOf(Controller.prototype), 'constructor', this).call(this);

        var args = !!arguments.length && Utils.isArray(arguments[arguments.length - 1]) ? arguments[arguments.length - 1] : arguments;

        if (Utils.isArray(args) && !!args.length && Utils.isObject(args[args.length - 1])) {

            var config = args.pop();

            this.set('_$', config.element);
            this.set('_id', config.id);
            this.set('_ref', config.ref);
            this.set('_className', config.className);

            if (typeof jQuery === 'function') {
                var $ = function $(selector) {
                    if (typeof selector === 'string') {
                        return jQuery(this.get('_$', true)).find(selector);
                    } else {
                        return jQuery(this.get('_$', true));
                    }
                };
                this.set('$', $);
            } else {
                this.set('$', this.get('_$', true));
            }
            (0, _core.applyController)(this);
        } else {
            throw 'Please call super(args), in your Controller!';
        }
    }

    _createClass(Controller, [{
        key: 'getControllersByParam',
        value: function getControllersByParam(param, value) {
            return (0, _core.getControllersByParam)(param, value);
        }
    }, {
        key: 'getControllerById',
        value: function getControllerById(id) {
            return (0, _core.getControllerById)(id);
        }
    }, {
        key: 'getControllerByRef',
        value: function getControllerByRef(ref) {
            return (0, _core.getControllerByRef)(ref);
        }
    }, {
        key: 'getControllersByClassName',
        value: function getControllersByClassName(name) {
            return (0, _core.getControllersByClassName)(name);
        }
    }]);

    return Controller;
})(_coreObject2['default']);

exports['default'] = Controller;
module.exports = exports['default'];

},{"./core":4,"./core-object":3,"./main":7,"./utils":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _libUtilsJs = require('../lib/utils.js');

var CoreObject = (function () {
    function CoreObject() {
        _classCallCheck(this, CoreObject);

        this.set('__meta__', {
            observerApplied: false,
            computedApplied: false,
            cache: {}
        }, true);
    }

    _createClass(CoreObject, [{
        key: 'set',
        value: function set(param, value) {
            return (0, _libUtilsJs.set)(this, param, value);
        }
    }, {
        key: 'get',
        value: function get(param, ignoreComputed) {
            return (0, _libUtilsJs.get)(this, param, ignoreComputed);
        }
    }]);

    return CoreObject;
})();

exports['default'] = CoreObject;
module.exports = exports['default'];

},{"../lib/utils.js":9}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.registerController = registerController;
exports.applyController = applyController;
exports.applyActionsToController = applyActionsToController;
exports.applyClassBindingsToController = applyClassBindingsToController;
exports.applyInputBindingsToController = applyInputBindingsToController;
exports.applyContentBindingsToController = applyContentBindingsToController;
exports.register = register;
exports.getControllersByParam = getControllersByParam;
exports.getControllerById = getControllerById;
exports.getControllerByRef = getControllerByRef;
exports.getControllersByClassName = getControllersByClassName;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _dom = require('./dom');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _observer = require('./observer');

var _computed = require('./computed');

/**
    registers a controller in mojito, creates an instance
    and does all the magic for setting up all the controller stuff
*/

function registerController(name, ControllerClass) {

    // make sure registerController has exactly two arguments
    if (arguments.length < 2) {
        throw '[Type Exeption] missing parameters';
    }

    // check name to make sure it is an array
    if (!Utils.isString(name)) {
        throw '[Type Exeption] name has to be a string';
    }

    // check ControllerClass to make sure it is a function or object
    if (!Utils.isFunction(ControllerClass) && !Utils.isObject(ControllerClass)) {
        throw '[Type Exeption] No ControllerClass found for ' + name + ' (maybe you forgot to export ' + name + ' as default)';
    }

    // check for controller instances array
    if (!Utils.isArray(_main2['default']._controllerInstances)) {
        throw '[Type Exeption] No _controllerInstances found';
    }

    // grab elements from DOM where this controller has been attached
    var elements = (0, _dom.querySelectorAll)('[data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_CONTROLLER_DEF_SHORTHAND : _environment2['default'].HTMLDATA_CONTROLLER_DEF) + '="' + name + '"]');

    // loop through elements and create controller instances
    for (var i = 0, max = elements.length; i < max; i++) {

        var element = elements[0];
        var params = [];
        // check if controller is already registered (has an id)
        if ((0, _dom.getAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_CONTROLLER_ID_SHORTHAND : _environment2['default'].HTMLDATA_CONTROLLER_ID))) {
            continue;
        }

        // check if there are any params for controller init
        if ((0, _dom.getAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_PARAMS_SHORTHAND : _environment2['default'].HTMLDATA_PARAMS))) {
            params = (0, _dom.getDataParams)(element);
        }

        // check if controller reference is set and apply it to instance
        var ref = (0, _dom.getAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_CONTROLLER_REF_SHORTHAND : _environment2['default'].HTMLDATA_CONTROLLER_REF));

        // merge params with config
        params = params.concat([{
            element: element,
            id: Utils.generateRandomString(16),
            ref: ref,
            className: name
        }]);

        // create new controller instance from class
        // instead of new ControllerClass() using the following code to apply
        // the params as an arguments array
        var controller = new (Function.prototype.bind.apply(ControllerClass, [null].concat(params)))();

        // return instance
        return controller;
    }

    return null;
}

function applyController(controller) {

    // check name to make sure it is an array
    if (typeof controller === 'undefined') {
        throw '[Type Exeption] controller has to be a object';
    }

    // apply id to dome node
    (0, _dom.setAttribute)(controller._$, _environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_CONTROLLER_ID_SHORTHAND : _environment2['default'].HTMLDATA_CONTROLLER_ID, controller.get('_id', true));

    // add controller instance to instances array for later access
    _main2['default']._controllerInstances.push(controller);

    // add all the computed properties on this controller
    (0, _computed.applyComputed)(controller);

    // add all the observers on this controller
    (0, _observer.applyObserver)(controller);

    // apply actions
    applyActionsToController(controller);

    // apply class bindings
    applyClassBindingsToController(controller);

    // apply input bindings
    applyInputBindingsToController(controller);

    // apply content bindings
    applyContentBindingsToController(controller);
}

function applyActionsToController(controller) {

    // make sure applyDomToController has exactly one arguments
    if (arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if (!Utils.isObject(controller)) {
        throw '[Type Exeption] controller has to be an object';
    }

    var actionElements = (0, _dom.querySelectorAll)(controller.get('_$', true), '[data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_ACTION_SHORTHAND : _environment2['default'].HTMLDATA_ACTION) + ']');

    var i = actionElements.length;

    var _loop = function () {
        var element = actionElements[i];
        var action = (0, _dom.getAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_ACTION_SHORTHAND : _environment2['default'].HTMLDATA_ACTION));
        var id = (0, _dom.getAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_ACTION_SHORTHAND_ID : _environment2['default'].HTMLDATA_ACTION_ID));
        var eventType = (0, _dom.getAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_EVENT_SHORTHAND : _environment2['default'].HTMLDATA_EVENT));

        if (id) {
            return 'continue';
        }

        if (Utils.isString(action)) {
            (function () {
                var actionParts = action.split('.');

                if (actionParts.length === 2 && actionParts[0] === controller.get('_className', true) && actionParts[1] in controller) {

                    if (!eventType || _environment2['default'].EVENTTYPES.split(' ').indexOf(eventType) === -1) {
                        eventType = _environment2['default'].DEFAULT_EVENTTYPE;
                    }

                    (0, _dom.setAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_ACTION_ID_SHORTHAND : _environment2['default'].HTMLDATA_ACTION_ID), Utils.generateRandomString(16));
                    (0, _dom.addEventListener)(element, eventType, function (event) {
                        event.preventDefault();
                        var params = (0, _dom.getDataParams)(element);
                        controller[actionParts[1]].apply(controller, params.concat([event]));
                    }, controller);
                }
            })();
        }
    };

    while (i--) {
        var _ret = _loop();

        if (_ret === 'continue') continue;
    }
}

function applyClassBindingsToController(controller) {
    // make sure applyDomToController has exactly one arguments
    if (arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if (!Utils.isObject(controller)) {
        throw '[Type Exeption] controller has to be an object';
    }

    var bindingElements = (0, _dom.querySelectorAll)(controller.get('_$', true), '[data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_CLASSBINDING_SHORTHAND : _environment2['default'].HTMLDATA_CLASSBINDING) + ']');

    var i = bindingElements.length;

    while (i--) {
        var element = bindingElements[i];
        var bindings = (0, _dom.getAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_CLASSBINDING_SHORTHAND : _environment2['default'].HTMLDATA_CLASSBINDING)).split(' ');
        var j = bindings.length;

        while (j--) {
            var binding = bindings[j];

            if (!Utils.isString(binding)) {
                continue;
            }

            binding = binding.split('.');

            if (binding.length !== 2 || binding[0] !== controller.get('_className', true)) {
                continue;
            }

            binding = binding[1].split(':');

            if (!binding.length || !binding[0].length) {
                continue;
            }

            var trigger = binding[0];
            var class1 = binding.length > 1 && binding[1].length ? binding[1] : null;
            var class2 = binding.length > 2 && binding[2].length ? binding[2] : null;

            (0, _observer.addObserver)(controller, trigger, function (trigger, element, class1, class2) {
                if (this.get(trigger)) {
                    if (!!class1) {
                        (0, _dom.addClass)(element, class1);
                    } else {
                        (0, _dom.addClass)(element, trigger);
                    }
                    !!class2 && (0, _dom.removeClass)(element, class2);
                } else {
                    if (!!class1) {
                        (0, _dom.removeClass)(element, class1);
                    } else {
                        (0, _dom.removeClass)(element, trigger);
                    }
                    !!class2 && (0, _dom.addClass)(element, class2);
                }
            }, [trigger, element, class1, class2]);
            (0, _observer.callObserver)(controller, trigger);
        }
    }
}

function applyInputBindingsToController(controller) {

    // make sure applyDomToController has exactly one arguments
    if (arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if (!Utils.isObject(controller)) {
        throw '[Type Exeption] controller has to be an object';
    }

    var bindingElements = (0, _dom.querySelectorAll)(controller.get('_$', true), '[data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_INPUTBINDING_SHORTHAND : _environment2['default'].HTMLDATA_INPUTBINDING) + ']');

    var i = bindingElements.length;

    var _loop2 = function () {
        var element = bindingElements[i];
        var binding = (0, _dom.getAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_INPUTBINDING_SHORTHAND : _environment2['default'].HTMLDATA_INPUTBINDING));

        if (!Utils.isString(binding)) {
            return 'continue';
        }

        binding = binding.split('.');

        if (binding.length < 2 || binding[0] !== controller.get('_className', true)) {
            return 'continue';
        }

        var param = binding.slice(1).join('.');
        var events = '';

        switch (element.tagName.toLowerCase()) {
            case 'textarea':
            case 'input':
                events = 'input change paste';
                break;
            case 'select':
                events = 'change';
                break;
        }
        (function (element, events, controller, param) {
            (0, _dom.addEventListener)(element, events, function (event) {
                if (element.type === 'checkbox') {
                    value = element.checked;
                } else if (element.type !== 'radio' || element.checked) {
                    value = element.value;
                }

                if (value !== controller.get(param)) {
                    controller.set(param, value);
                }
            });
        })(element, events, controller, param);

        (0, _observer.addObserver)(controller, param, function (param, element) {
            switch (element.type) {
                case 'checkbox':
                    element.checked !== !!controller.get(param) && (element.checked = !!controller.get(param));
                    break;
                case 'radio':
                    element.checked = controller.get(param) === element.value;
                    break;
                default:
                    if (controller.get(param) !== element.value) {
                        element.value = controller.get(param);
                    }
                    break;
            }
        }, [param, element]);

        var value = null;
        if (element.type === 'checkbox') {
            value = element.checked;
        } else if (element.type !== 'radio' || element.checked) {
            value = element.value;
        }

        if (!!value) {
            controller.set(param, value);
        } else if (controller.get(param)) {
            switch (element.type) {
                case 'checkbox':
                    element.checked !== !!controller.get(param) && (element.checked = !!controller.get(param));
                    break;
                case 'radio':
                    element.checked = controller.get(param) === element.value;
                    break;
                default:
                    if (controller.get(param) !== element.value) {
                        element.value = controller.get(param);
                    }
                    break;
            }
        }
    };

    while (i--) {
        var _ret3 = _loop2();

        if (_ret3 === 'continue') continue;
    }
}

function applyContentBindingsToController(controller) {
    // make sure applyDomToController has exactly one arguments
    if (arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if (!Utils.isObject(controller)) {
        throw '[Type Exeption] controller has to be an object';
    }

    var bindingElements = (0, _dom.querySelectorAll)(controller.get('_$', true), '[data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_CONTENTBINDING_SHORTHAND : _environment2['default'].HTMLDATA_CONTENTBINDING) + ']');

    var i = bindingElements.length;

    while (i--) {
        var element = bindingElements[i];
        var binding = (0, _dom.getAttribute)(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_CONTENTBINDING_SHORTHAND : _environment2['default'].HTMLDATA_CONTENTBINDING));

        if (!Utils.isString(binding)) {
            continue;
        }

        binding = binding.split('.');

        if (binding.length < 2 || binding[0] !== controller.get('_className', true)) {
            continue;
        }

        var keyName = binding.slice(1).join('.');

        (0, _observer.addObserver)(controller, keyName, function (keyName, element) {
            element.innerHTML = controller.get(keyName) ? controller.get(keyName) : '';
        }, [keyName, element]);
        (0, _observer.callObserver)(controller, keyName);
    }
}

function register(type, name, Class) {

    if (arguments.length < 3) {
        throw '[Type Exeption] missing parameters';
    }

    if (!Utils.isString(type) || !Utils.isString(name)) {
        throw '[Type Exeption] type and name have to be strings';
    }

    if (type === 'controller') {
        return registerController(name, Class);
    }

    return null;
}

function getControllersByParam(param, value) {

    // check for controller instances array
    if (!Utils.isArray(_main2['default']._controllerInstances)) {
        throw '[Type Exeption] No _controllerInstances found';
    }

    // check id to make sure it is a string
    if (!Utils.isString(value)) {
        console.error('[Type Error] ' + param + ' has to be a string');
        return null;
    }

    var i = _main2['default']._controllerInstances.length;
    var result = [];
    while (i--) {
        var controller = _main2['default']._controllerInstances[i];
        if (controller.get(param) === value) {
            result.push(controller);
        }
    }
    return result;
}

function getControllerById(id) {

    var controllers = getControllersByParam('_id', id);
    return controllers.length ? controllers[0] : null;
}

function getControllerByRef(ref) {

    var controllers = getControllersByParam('_ref', ref);
    return controllers.length ? controllers[0] : null;
}

function getControllersByClassName(name) {

    return getControllersByParam('_className', name);
}

},{"./computed":1,"./dom":5,"./environment":6,"./main":7,"./observer":8,"./utils":9}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.querySelectorAll = querySelectorAll;
exports.querySelector = querySelector;
exports.getAttribute = getAttribute;
exports.setAttribute = setAttribute;
exports.getDataParams = getDataParams;
exports.addEventListener = addEventListener;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

var _utils = require('./utils');

function querySelectorAll(root, selector) {
    if (typeof document !== 'object') {
        throw 'No document found';
    }

    if (!('querySelectorAll' in document)) {
        try {
            console.error('[Type Error] querySelectorAll function not found, probably your browser version is too old. (http://caniuse.com/#search=querySelectorAll)');
        } finally {
            return [];
        }
    }

    if (typeof root === 'string') {
        selector = root;
        root = document;
    } else if (typeof root !== 'object') {
        try {
            console.error('[Type Error] Root has to be a DOM Element');
        } finally {
            return [];
        }
    }

    if (typeof selector !== 'string') {
        try {
            console.error('[Type Error] Selector has to be a string');
        } finally {
            return [];
        }
    }

    return document.querySelectorAll(selector);
}

function querySelector(selector) {
    if (typeof document !== 'object') {
        throw 'No document found';
    }

    if (!('querySelector' in document)) {
        try {
            console.error('[Type Error] querySelector function not found, probably your browser version is too old. (http://caniuse.com/#search=querySelector)');
        } finally {
            return [];
        }
    }

    if (typeof selector !== 'string') {
        try {
            console.error('[Type Error] Selector has to be a string');
        } finally {
            return [];
        }
    }

    return document.querySelector(selector);
}

function getAttribute(element, name) {

    if (typeof document !== 'object') {
        throw 'No document found';
    }

    if (typeof element !== 'object' || !('getAttribute' in element)) {
        try {
            console.error('[Type Error] Element has to be a DOM Element and support the getAttribute method');
        } finally {
            return null;
        }
    }

    if (typeof name !== 'string') {
        try {
            console.error('[Type Error] Attribute name has to be a string');
        } finally {
            return null;
        }
    }

    return element.getAttribute(name);
}

function setAttribute(element, name, value) {

    if (typeof document !== 'object') {
        throw 'No document found';
    }

    if (typeof element !== 'object' || !('setAttribute' in element)) {
        try {
            console.error('[Type Error] Element has to be a DOM Element and support the getAttribute method');
        } finally {
            return null;
        }
    }

    if (typeof name !== 'string') {
        try {
            console.error('[Type Error] Attribute name has to be a string');
        } finally {
            return null;
        }
    }

    element.setAttribute(name, value);
}

function getDataParams(element) {

    var params = getAttribute(element, 'data-' + (_environment2['default'].HTMLDATA_SHORTHAND ? _environment2['default'].HTMLDATA_PARAMS_SHORTHAND : _environment2['default'].HTMLDATA_PARAMS));
    var attributes = [];
    if (typeof params === 'string' && params.length > 0) {

        params = params.replace(/,/g, "\",\"");
        params = params.replace(/:/g, "\":\"");
        params = params.replace(/{/g, "{\"");
        params = params.replace(/}/g, "\"}");
        params = params.replace(/\[/g, "[\"");
        params = params.replace(/\]/g, "\"]");
        params = params.replace(/}"/g, "}");
        params = params.replace(/"{/g, "{");
        params = params.replace(/]"/g, "]");
        params = params.replace(/"\[/g, "[");
        if (params.charAt(0) !== '{' && params.charAt(0) !== '[') {
            params = '\"' + params;
        }
        if (params.charAt(params.length - 1) !== '}' && params.charAt(params.length - 1) !== ']') {
            params = params + '\"';
        }
        params = '[' + params + ']';
        attributes = (0, _utils.parseJSON)(params);
    }
    return attributes;
}

;

function addEventListener(element, types, callback, context) {
    if (typeof element !== 'object') {
        throw '[Type Exeption] element has to be a DOM Element';
    }

    if (typeof types === 'string') {
        types = types.split(' ');
    } else if (types !== 'array') {
        throw '[Type Exeption] types has to be a string or an array';
    }

    if (typeof callback !== 'function') {
        throw '[Type Exeption] callback has to be a function';
    }

    if (!element.addEventListener) {
        throw '[Type Exeption] There is no addEventListener function on element';
    }

    var validTypes = _environment2['default'].EVENTTYPES.split(' ');
    var i = types.length;

    while (i--) {
        var type = types[i];
        if (validTypes.indexOf(type)) {
            element.addEventListener(type, function (event) {
                callback.apply(!!context ? context : callback, [].concat([event]));
            });
        }
    }

    return element;
}

function hasClass(elem, className) {

    // Check if there is an element and
    // a Class Name given
    if (!elem || !className) return null;

    // Check if it is a list of elements
    if (elem.length > 1) {

        // Run through the list and check if
        // one of them has not that class Name
        for (var i = 0, max = elem.length; i < max; i++) {
            if (!hasClass(elem[i], className)) {
                return false;
            }
        }

        // Not found - return false
        return true;
    } else {
        // Check if browser supports classList
        // Jep: Check with classList
        // Nope: Do a regex
        if (!!elem.classList) {
            return elem.classList.contains(className);
        } else {
            var className = " " + className + " ";
            return (" " + elem.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1;
        }
    }
}

function addClass(elem, className) {

    // Check if there is an element and
    // a Class Name given
    if (!elem || !className) return null;

    // Check if it is a list of elements
    if (elem.length > 1) {

        // Run through the list and add
        // Class Name to all of them
        for (var i = 0, max = elem.length; i < max; i++) {
            addClass(elem[i], className);
        }

        // Extend all Elements and return it
        return elem;
    } else {

        // Check if browser supports classList
        // Jep: Add it to classList
        // Nope: Add it as string
        if (!!elem.classList) {
            elem.classList.add(className);
        } else if (!hasClass(elem, className)) {
            elem.className += " " + className;
        }

        // return the extended Element
        return elem;
    }
}

function removeClass(elem, className) {
    // Check if there is an element and
    // a Class Name given
    if (!elem || !className) return null;

    // Check if it is a list of elements
    if (elem.length > 1) {

        // Run through the list and remove
        // Class Name of them all
        for (var i = 0, max = elem.length; i < max; i++) {
            removeClass(elem[i], className);
        }

        // Extend all Elements and return it
        return elem;
    } else {
        // Check if browser supports classList
        // Jep: Remove it from classList
        // Nope: Remove it with regex
        if (!!elem.classList) {
            elem.classList.remove(className);
        } else if (hasClass(elem, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            elem.className = elem.className.replace(reg, ' ');
        }

        // return the extended Element
        return elem;
    }
}

},{"./environment":6,"./utils":9}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var ENV = {};

// HTML data attributes
ENV.HTMLDATA_SHORTHAND = false;
ENV.HTMLDATA_NAMESPACE = 'mojito';
ENV.HTMLDATA_CONTROLLER_DEF = ENV.HTMLDATA_NAMESPACE + '-controller';
ENV.HTMLDATA_CONTROLLER_DEF_SHORTHAND = 'controller';
ENV.HTMLDATA_CONTROLLER_ID = ENV.HTMLDATA_CONTROLLER_DEF + '-id';
ENV.HTMLDATA_CONTROLLER_ID_SHORTHAND = ENV.HTMLDATA_CONTROLLER_DEF_SHORTHAND + '-id';
ENV.HTMLDATA_CONTROLLER_REF = ENV.HTMLDATA_CONTROLLER_DEF + '-ref';
ENV.HTMLDATA_CONTROLLER_REF_SHORTHAND = ENV.HTMLDATA_CONTROLLER_DEF_SHORTHAND + '-ref';
ENV.HTMLDATA_ACTION = ENV.HTMLDATA_NAMESPACE + '-action';
ENV.HTMLDATA_ACTION_SHORTHAND = 'action';
ENV.HTMLDATA_ACTION_ID = ENV.HTMLDATA_ACTION + '-id';
ENV.HTMLDATA_ACTION_ID_SHORTHAND = ENV.HTMLDATA_ACTION_SHORTHAND + '-id';
ENV.HTMLDATA_EVENT = ENV.HTMLDATA_NAMESPACE + '-event';
ENV.HTMLDATA_EVENT_SHORTHAND = 'event';
ENV.HTMLDATA_PARAMS = ENV.HTMLDATA_NAMESPACE + '-params';
ENV.HTMLDATA_PARAMS_SHORTHAND = 'params';
ENV.HTMLDATA_CLASSBINDING = ENV.HTMLDATA_NAMESPACE + '-bind-class';
ENV.HTMLDATA_CLASSBINDING_SHORTHAND = 'bind-class';
ENV.HTMLDATA_INPUTBINDING = ENV.HTMLDATA_NAMESPACE + '-bind-input';
ENV.HTMLDATA_INPUTBINDING_SHORTHAND = 'bind-input';
ENV.HTMLDATA_CONTENTBINDING = ENV.HTMLDATA_NAMESPACE + '-bind-content';
ENV.HTMLDATA_CONTENTBINDING_SHORTHAND = 'bind-content';

// events
ENV.EVENTTYPES = "blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu";
ENV.DEFAULT_EVENTTYPE = 'click';

exports['default'] = ENV;
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

var _utils = require('./utils');

var _dom = require('./dom');

var _coreObject = require('./core-object');

var _coreObject2 = _interopRequireDefault(_coreObject);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _core = require('./core');

var _observer = require('./observer');

var _computed = require('./computed');

var Mojito = {
    // core
    ENV: _environment2['default'],
    register: _core.register,
    registerController: _core.registerController,
    Controller: _controller2['default'],
    CoreObject: _coreObject2['default'],
    getControllersByParam: _core.getControllersByParam,
    getControllerById: _core.getControllerById,
    getControllerByRef: _core.getControllerByRef,
    getControllersByClassName: _core.getControllersByClassName,

    // public
    get: _utils.get,
    set: _utils.set,
    isArray: _utils.isArray,
    isObject: _utils.isObject,
    isNumber: _utils.isNumber,
    isBoolean: _utils.isBoolean,
    isString: _utils.isString,
    isFunction: _utils.isFunction,
    isEmpty: _utils.isEmpty,
    typeOf: _utils.typeOf,
    extend: _utils.extend,
    querySelector: _dom.querySelector,
    querySelectorAll: _dom.querySelectorAll,
    getAttribute: _dom.getAttribute,
    setAttribute: _dom.setAttribute,
    hasClass: _dom.hasClass,
    addClass: _dom.addClass,
    removeClass: _dom.removeClass,
    getDataParams: _dom.getDataParams,
    parseJSON: _utils.parseJSON,
    generateRandomString: _utils.generateRandomString,
    addEventListener: _dom.addEventListener,
    addObserver: _observer.addObserver,
    getObservers: _observer.getObservers,
    applyObserver: _observer.applyObserver,
    callObserver: _observer.callObserver,
    observer: _observer.observer,
    applyComputed: _computed.applyComputed,
    getComputedProperty: _computed.getComputedProperty,
    computed: _computed.computed,

    // intern
    _controllerInstances: [],
    _ids: [],
    _observers: []
};

// make Mojito a global object
if (typeof window !== 'undefined') {
    window.Mojito = Mojito;
}

exports['default'] = Mojito;
module.exports = exports['default'];

},{"./computed":1,"./controller":2,"./core":4,"./core-object":3,"./dom":5,"./environment":6,"./observer":8,"./utils":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.observer = observer;
exports.addObserver = addObserver;
exports.applyObserver = applyObserver;
exports.getObservers = getObservers;
exports.callObserver = callObserver;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

function observer() {
    if (arguments.length < 2) {
        throw '[Type Exeption] observer needs at least 2 arguments';
    }

    var fn = arguments[arguments.length - 1];
    var keyNames = Array.prototype.slice.call(arguments, 0, -1);
    var i = keyNames.length;

    if (!Utils.isFunction(fn)) {
        throw '[Type Exeption] last argument has to be a function';
    }

    while (i--) {
        if (!Utils.isString(keyNames[i])) {
            throw '[Type Exeption] all keyNames have to be a string';
        }
    }

    return {
        keyNames: keyNames,
        fn: fn
    };
}

function addObserver(obj, keyName, fn, args) {

    if (arguments.length < 3) {
        throw '[Type Exeption] addObserver needs 3 arguments';
    }
    if (!Utils.isObject(obj)) {
        throw '[Type Exeption] obj has to be an object';
    }
    if (!Utils.isString(keyName)) {
        throw '[Type Exeption] keyName has to be a string';
    }
    if (!Utils.isFunction(fn)) {
        throw '[Type Exeption] fn has to be a function';
    }
    if (!Utils.isArray(args)) {
        args = [];
    }

    _main2['default']._observers.push({
        obj: obj,
        keyName: keyName,
        fn: fn,
        args: args
    });
}

function applyObserver(obj, context) {

    if (!Utils.isObject(obj)) {
        return;
    }

    if (!context) {
        context = obj;
        if (!!context.__meta__.observerApplied) {
            return;
        }
        context.__meta__.observerApplied = true;
    }

    var keys = Object.getOwnPropertyNames(obj);
    for (var index in keys) {
        if (obj.hasOwnProperty(keys[index])) {
            var key = keys[index];
            var keySplit = key.split('Observer');
            if (keySplit.length >= 2 && !keySplit[keySplit.length - 1]) {
                var observerObject = obj[key].call(context);
                var fn = Utils.get(observerObject, 'fn', true);
                var keyNames = Utils.get(observerObject, 'keyNames', true);
                if (Utils.isFunction(fn) && Utils.isArray(keyNames)) {
                    var i = keyNames.length;
                    while (i--) {
                        var keyName = keyNames[i];
                        if (Utils.isString(keyName)) {
                            addObserver(context, keyName, fn);
                        }
                    }
                }
            }
        }
    }

    if (!!obj.prototype) {
        applyObserver(obj.prototype, context);
    } else if ('__proto__' in obj) {
        applyObserver(obj.__proto__, context);
    }
}

function getObservers(obj, keyName) {
    if (!Utils.isObject(obj)) {
        throw '[Type Exeption] obj has to be an object';
    }
    if (!Utils.isString(keyName)) {
        throw '[Type Exeption] keyName has to be a string';
    }
    var i = _main2['default']._observers.length;
    var observers = [];

    while (i--) {
        var _observer = _main2['default']._observers[i];
        var observerObject = Utils.get(_observer, 'obj', true);
        var observerKeyName = Utils.get(_observer, 'keyName', true);
        if (Utils.isObject(observerObject) && Utils.isString(observerKeyName) && obj === observerObject && keyName === observerKeyName) {
            observers.push(_observer);
        }
    }
    return observers;
}

function callObserver(obj, keyName) {
    var observers = getObservers(obj, keyName);
    var i = observers.length;
    while (i--) {
        var _observer2 = observers[i];
        var fn = Utils.get(_observer2, 'fn', true);
        var args = Utils.get(_observer2, 'args', true);

        if (!Utils.isArray(args)) {
            args = [];
        }

        if (_observer2 && Utils.isFunction(fn)) {
            fn.apply(obj, args);
        }
    }
}

},{"./main":7,"./utils":9}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.get = get;
exports.set = set;
exports.generateRandomString = generateRandomString;
exports.parseJSON = parseJSON;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isBoolean = isBoolean;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isFunction = isFunction;
exports.isEmpty = isEmpty;
exports.typeOf = typeOf;
exports.extend = extend;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _observer = require('./observer');

var _coreObject = require('./core-object');

var _coreObject2 = _interopRequireDefault(_coreObject);

var _computed = require('./computed');

var undefined = undefined;

function get(_x, _x2, _x3) {
    var _again = true;

    _function: while (_again) {
        var obj = _x,
            param = _x2,
            ignoreComputed = _x3;
        params = undefined;
        _again = false;

        if (isObject(obj) && isString(param)) {
            var params = param.split('.');
            param = params.slice(0, 1)[0];
            if (param in obj) {
                if (params.length === 1) {
                    return obj[param];
                } else {
                    _x = obj[param];
                    _x2 = params.slice(1).join('.');
                    _x3 = ignoreComputed;
                    _again = true;
                    continue _function;
                }
            }
            if (params.length === 1 && !ignoreComputed) {
                (0, _computed.applyComputed)(obj);
                return (0, _computed.getComputedProperty)(obj, param);
            }
            return null;
        }
        throw '[Type Exeption] obj has to be an object [' + obj + '] & param has to be a string [' + param + ']';
    }
}

;

function set(obj, paramName, value) {
    if (!isObject(obj)) {
        throw '[Type Exeption] obj has to be an object';
    }

    if (!isString(paramName) && !isArray(paramName)) {
        throw 'Param has to be a string or array';
    }

    var params = isArray(paramName) ? paramName : paramName.split('.');
    var param = params.slice(0, 1)[0];

    if (params.length === 1) {
        obj[param] = value;
    } else {
        if (!(param in obj)) {
            obj[param] = {};
        } else if (!isObject(obj[param])) {
            throw '[Type Exeption] param has to be an object to cue it';
        }
        set(obj[param], params.slice(1), value);
    }

    if (isString(paramName)) {
        (0, _observer.callObserver)(obj, paramName);
    }

    return obj;
}

;

function generateRandomString(stringLength) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var strgLength = typeof stringLength === 'number' && stringLength > 0 ? stringLength : 4;
    var randomString = '';
    for (var i = 0; i < strgLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
    }
    if (_main2['default']._ids.indexOf(randomString) !== -1) {
        randomString = generateRandomString(stringLength);
    }
    _main2['default']._ids.push(randomString);
    return randomString;
}

;

function parseJSON(item) {
    if (typeof item === 'string') {
        if (typeof JSON === 'undefined') {
            throw 'Mojito needs JSON to work. Min. IE8';
        }
        try {
            item = JSON.parse(item);
        } catch (ex) {
            if (!isNaN(item)) {
                item = item.indexOf('.') ? parseFloat(item) : parseInt(item, 10);
            } else {
                item = item === 'true' ? true : item;
                item = item === 'false' ? false : item;
            }
        }
    }

    if (isArray(item)) {
        // handle array
        for (var i = 0, max = item.length; i < max; i++) {
            item[i] = parseJSON(item[i]);
        }
    } else if (isObject(item)) {
        // handle object
        for (var prop in item) {
            if (item.hasOwnProperty(prop)) {
                item[prop] = parseJSON(item[prop]);
            }
        }
    }
    return item;
}

;

function isArray(array) {
    return Object.prototype.toString.call(array) === '[object Array]';
}

;

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

;

function isBoolean(bool) {
    return typeof bool === 'boolean';
}

;

function isNumber(number) {
    return typeof number === 'number' && !isNaN(number) && isFinite(number);
}

;

function isString(string) {
    return typeof string === 'string';
}

;

function isFunction(fn) {
    return typeof fn === 'function';
}

;

function isEmpty(obj) {
    if (isBoolean(obj) || isNumber(obj) || isFunction(obj)) {
        return false;
    } else if (isArray(obj)) {
        return !obj.length;
    } else if (isObject(obj)) {
        return !Object.keys(obj).length;
    } else {
        return !obj;
    }
}

;

function typeOf(obj) {
    if (isNumber(obj)) {
        return 'number';
    } else if (isBoolean(obj)) {
        return 'boolean';
    } else if (isString(obj)) {
        return 'string';
    } else if (isArray(obj)) {
        return 'array';
    } else if (isObject(obj)) {
        return 'object';
    } else if (isFunction(obj)) {
        return 'function';
    } else {
        return 'undefined';
    }
}

;

function extend(target, source) {

    var item, tItem, o, idx;

    // If either argument is undefined, return the other.
    // If both are undefined, return undefined.
    if (typeof source == 'undefined') {
        return source;
    } else if (typeof target == 'undefined') {
        return target;
    }

    // Assume both are objects and don't care about inherited properties
    for (var prop in source) {
        item = source[prop];

        if (typeof item == 'object' && item !== null) {

            if (isArray(item) && item.length) {

                // deal with arrays, will be either array of primitives or array of objects
                // If primitives
                if (typeof item[0] != 'object') {

                    // if target doesn't have a similar property, just reference it
                    tItem = target[prop];
                    if (!tItem) {
                        target[prop] = item;

                        // Otherwise, copy only those members that don't exist on target
                    } else {

                            // Create an index of items on target
                            o = {};
                            for (var i = 0, iLen = tItem.length; i < iLen; i++) {
                                o[tItem[i]] = true;
                            }

                            // Do check, push missing
                            for (var j = 0, jLen = item.length; j < jLen; j++) {

                                if (!(item[j] in o)) {
                                    tItem.push(item[j]);
                                }
                            }
                        }
                } else {
                    // Deal with array of objects
                    // Create index of objects in target object using ID property
                    // Assume if target has same named property then it will be similar array
                    idx = {};
                    tItem = target[prop];

                    for (var k = 0, kLen = tItem.length; k < kLen; k++) {
                        idx[tItem[k].id] = tItem[k];
                    }

                    // Do updates
                    for (var l = 0, ll = item.length; l < ll; l++) {
                        // If target doesn't have an equivalent, just add it
                        if (!(item[l].id in idx)) {
                            tItem.push(item[l]);
                        } else {
                            extend(idx[item[l].id], item[l]);
                        }
                    }
                }
            } else {
                // deal with object
                extend(target[prop], item);
            }
        } else {
            // item is a primitive, just copy it over
            target[prop] = item;
        }
    }
    return target;
}

},{"./computed":1,"./core-object":3,"./main":7,"./observer":8}]},{},[7]);
