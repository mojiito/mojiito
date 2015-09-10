(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libControllerJs = require('../lib/controller.js');

var _libControllerJs2 = _interopRequireDefault(_libControllerJs);

var _libUtils = require('../lib/utils');

var Utils = _interopRequireWildcard(_libUtils);

var _libMainJs = require('../lib/main.js');

var _libMainJs2 = _interopRequireDefault(_libMainJs);

var ControllerProxy = {

    register: function register(name, controller) {
        if (!Utils.isObject(controller) && ! typeof controller === 'function') {
            return null;
        }

        if (_libMainJs2['default'].isObject(document) && 'querySelectorAll' in document) {
            var elements = document.querySelectorAll('[data-controller="' + name + '"]');

            for (var i = 0, max = elements.length; i < max; i++) {
                var element = elements[i];
                _libMainJs2['default'].controllers.push(new controller(element));
            }
        }
        return controller;
    }

};

exports['default'] = ControllerProxy;
module.exports = exports['default'];

},{"../lib/controller.js":2,"../lib/main.js":4,"../lib/utils":5}],2:[function(require,module,exports){
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

var _libCoreObject = require('../lib/core-object');

var _libCoreObject2 = _interopRequireDefault(_libCoreObject);

var _libUtils = require('../lib/utils');

var Utils = _interopRequireWildcard(_libUtils);

var Controller = (function (_CoreObject) {
    _inherits(Controller, _CoreObject);

    function Controller($) {
        _classCallCheck(this, Controller);

        _get(Object.getPrototypeOf(Controller.prototype), 'constructor', this).call(this);
        if (Utils.isArray($)) {
            this.$ = $;
        }
    }

    _createClass(Controller, [{
        key: 'toString',
        value: function toString() {
            return 'Mojito Controller';
        }
    }]);

    return Controller;
})(_libCoreObject2['default']);

exports['default'] = Controller;
module.exports = exports['default'];

},{"../lib/core-object":3,"../lib/utils":5}],3:[function(require,module,exports){
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
    }

    _createClass(CoreObject, [{
        key: 'set',
        value: function set(param, value) {
            return (0, _libUtilsJs.set)(this, param, value);
        }
    }, {
        key: 'get',
        value: function get(param) {
            return (0, _libUtilsJs.get)(this, param);
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'Mojito Core Object';
        }
    }]);

    return CoreObject;
})();

exports['default'] = CoreObject;
module.exports = exports['default'];

},{"../lib/utils.js":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilsJs = require('../lib/utils.js');

var _libCoreObject = require('../lib/core-object');

var _libCoreObject2 = _interopRequireDefault(_libCoreObject);

var _libController = require('../lib/controller');

var _libController2 = _interopRequireDefault(_libController);

var _libControllerProxy = require('../lib/controller-proxy');

var _libControllerProxy2 = _interopRequireDefault(_libControllerProxy);

var _libUtils = require('../lib/utils');

var Utils = _interopRequireWildcard(_libUtils);

var Mojito = {
    toString: function toString() {
        return 'Mojito';
    },
    get: _libUtilsJs.get,
    set: _libUtilsJs.set,
    isArray: _libUtilsJs.isArray,
    isObject: _libUtilsJs.isObject,
    isNumber: _libUtilsJs.isNumber,
    isBoolean: _libUtilsJs.isBoolean,
    isString: _libUtilsJs.isString,
    isEmpty: _libUtilsJs.isEmpty,
    typeOf: _libUtilsJs.typeOf,
    extend: _libUtilsJs.extend,
    CoreObject: new _libCoreObject2['default'](),
    ControllerClass: _libController2['default'],
    Controller: _libControllerProxy2['default'],
    controllers: []
};

// make Mojito a global object
if (typeof window !== 'undefined') {
    window.Mojito = Mojito;
}

exports['default'] = Mojito;
module.exports = exports['default'];

},{"../lib/controller":2,"../lib/controller-proxy":1,"../lib/core-object":3,"../lib/utils":5,"../lib/utils.js":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var undefined = undefined;

var get = function get(obj, param) {
    if (typeof obj === 'object' && param in obj) {
        return obj[param];
    }
    return null;
};

var set = function set(obj, param, value) {
    if (typeof obj === 'object') {
        obj[param] = value;
        return obj;
    }
    return null;
};

var generateRandomString = function generateRandomString(stringLength) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var strgLength = typeof stringLength === 'number' && stringLength > 0 ? stringLength : 4;
    var randomString = '';
    for (var i = 0; i < strgLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
};

var parseJSON = function parseJSON(item) {
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

    if (this.isArray(item)) {
        // handle array
        for (var i = 0, max = item.length; i < max; i++) {
            item[i] = this.parseJSON(item[i]);
        }
    } else if (this.isObject(item)) {
        // handle object
        for (var prop in item) {
            if (item.hasOwnProperty(prop)) {
                item[prop] = this.parseJSON(item[prop]);
            }
        }
    }
    return item;
};

var isArray = function isArray(array) {
    return Object.prototype.toString.call(array) === '[object Array]';
};

var isObject = function isObject(obj) {
    return typeof obj === 'object' && !isArray(obj);
};

var isBoolean = function isBoolean(bool) {
    return typeof bool === 'boolean';
};

var isNumber = function isNumber(number) {
    return typeof number === 'number' && !isNaN(number) && isFinite(number);
};

var isString = function isString(string) {
    return typeof string === 'string';
};

var isEmpty = function isEmpty(obj) {
    if (isBoolean(obj) || isNumber(obj)) {
        return false;
    } else if (isArray(obj)) {
        return !obj.length;
    } else if (isObject(obj)) {
        return !Object.keys(obj).length;
    } else {
        return !obj;
    }
};

var typeOf = function typeOf(obj) {
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
    } else {
        return 'undefined';
    }
};

var extend = function extend(obj1, obj2) {
    if (!isObject(obj1) || !isObject(obj2)) {
        return null;
    }
    var result = {};
    for (var prop in obj2) {
        if (obj2.hasOwnProperty(prop)) {
            result[prop] = obj2[prop];
        }
    }
    for (var prop in obj1) {
        if (obj1.hasOwnProperty(prop)) {
            result[prop] = obj1[prop];
        }
    }
    return result;
};

exports.get = get;
exports.set = set;
exports.parseJSON = parseJSON;
exports.generateRandomString = generateRandomString;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isBoolean = isBoolean;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isEmpty = isEmpty;
exports.typeOf = typeOf;
exports.extend = extend;

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGhvbWFzcGluay9Qcm9qZWN0cy9tb2ppdG8uanMvbGliL2NvbnRyb2xsZXItcHJveHkuanMiLCIvVXNlcnMvdGhvbWFzcGluay9Qcm9qZWN0cy9tb2ppdG8uanMvbGliL2NvbnRyb2xsZXIuanMiLCIvVXNlcnMvdGhvbWFzcGluay9Qcm9qZWN0cy9tb2ppdG8uanMvbGliL2NvcmUtb2JqZWN0LmpzIiwiL1VzZXJzL3Rob21hc3BpbmsvUHJvamVjdHMvbW9qaXRvLmpzL2xpYi9tYWluLmpzIiwiL1VzZXJzL3Rob21hc3BpbmsvUHJvamVjdHMvbW9qaXRvLmpzL2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7K0JDQXVCLHNCQUFzQjs7Ozt3QkFDdEIsY0FBYzs7SUFBekIsS0FBSzs7eUJBQ0UsZ0JBQWdCOzs7O0FBRW5DLElBQU0sZUFBZSxHQUFHOztBQUVwQixZQUFRLEVBQUUsa0JBQVMsSUFBSSxFQUFFLFVBQVUsRUFBRTtBQUNqQyxZQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLE9BQU8sVUFBVSxLQUFLLFVBQVUsRUFBRTtBQUNqRSxtQkFBTyxJQUFJLENBQUM7U0FDZjs7QUFFRCxZQUFHLHVCQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxrQkFBa0IsSUFBSSxRQUFRLEVBQUU7QUFDNUQsZ0JBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsR0FBQyxJQUFJLEdBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpFLGlCQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxHQUFHLEdBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFDLG9CQUFJLE9B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LFFBQVEsQ0FBQztLQUNuQixNQUFNO0FBQ0gsZUFBTyxXQUFXLENBQUM7S0FDdEI7Q0FDSixDQUFDOztBQUVGLElBQU0sTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFZLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDaEMsUUFBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNuQyxlQUFPLElBQUksQ0FBQztLQUNmO0FBQ0QsUUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFNBQUssSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO0FBQ25CLFlBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMxQixrQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QjtLQUNKO0FBQ0QsU0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDbkIsWUFBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzFCLGtCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdCO0tBQ0o7QUFDRCxXQUFPLE1BQU0sQ0FBQztDQUNqQixDQUFBOztRQUVRLEdBQUcsR0FBSCxHQUFHO1FBQUUsR0FBRyxHQUFILEdBQUc7UUFBRSxTQUFTLEdBQVQsU0FBUztRQUFFLG9CQUFvQixHQUFwQixvQkFBb0I7UUFBRSxPQUFPLEdBQVAsT0FBTztRQUFFLFFBQVEsR0FBUixRQUFRO1FBQUUsU0FBUyxHQUFULFNBQVM7UUFBRSxRQUFRLEdBQVIsUUFBUTtRQUFFLFFBQVEsR0FBUixRQUFRO1FBQUUsT0FBTyxHQUFQLE9BQU87UUFBRSxNQUFNLEdBQU4sTUFBTTtRQUFFLE1BQU0sR0FBTixNQUFNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDb250cm9sbGVyIGZyb20gJy4uL2xpYi9jb250cm9sbGVyLmpzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5pbXBvcnQgTW9qaXRvIGZyb20gJy4uL2xpYi9tYWluLmpzJztcblxuY29uc3QgQ29udHJvbGxlclByb3h5ID0ge1xuXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKG5hbWUsIGNvbnRyb2xsZXIpIHtcbiAgICAgICAgaWYoIVV0aWxzLmlzT2JqZWN0KGNvbnRyb2xsZXIpICYmICF0eXBlb2YgY29udHJvbGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZihNb2ppdG8uaXNPYmplY3QoZG9jdW1lbnQpICYmICdxdWVyeVNlbGVjdG9yQWxsJyBpbiBkb2N1bWVudCkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29udHJvbGxlcj1cIicrbmFtZSsnXCJdJyk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaT0wLCBtYXg9ZWxlbWVudHMubGVuZ3RoOyBpPG1heDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcbiAgICAgICAgICAgICAgICBNb2ppdG8uY29udHJvbGxlcnMucHVzaChuZXcgY29udHJvbGxlcihlbGVtZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgfSxcblxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJQcm94eTtcbiIsImltcG9ydCBDb3JlT2JqZWN0IGZyb20gJy4uL2xpYi9jb3JlLW9iamVjdCc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuLi9saWIvdXRpbHMnO1xuXG5jbGFzcyBDb250cm9sbGVyIGV4dGVuZHMgQ29yZU9iamVjdCB7XG5cbiAgICBjb25zdHJ1Y3RvcigkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmKFV0aWxzLmlzQXJyYXkoJCkpIHtcbiAgICAgICAgICAgIHRoaXMuJCA9ICQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuICdNb2ppdG8gQ29udHJvbGxlcic7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXI7XG4iLCJpbXBvcnQgeyBnZXQsIHNldCB9IGZyb20gJy4uL2xpYi91dGlscy5qcyc7XG5cbmNsYXNzIENvcmVPYmplY3Qge1xuICAgIHNldChwYXJhbSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHNldCh0aGlzLCBwYXJhbSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGdldChwYXJhbSkge1xuICAgICAgICByZXR1cm4gZ2V0KHRoaXMsIHBhcmFtKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuICdNb2ppdG8gQ29yZSBPYmplY3QnO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29yZU9iamVjdDtcbiIsImltcG9ydCB7IGdldCwgc2V0LCBpc0FycmF5LCBpc09iamVjdCwgaXNCb29sZWFuLCBpc051bWJlciwgaXNTdHJpbmcsIGlzRW1wdHksIHR5cGVPZiwgZXh0ZW5kIH0gZnJvbSAnLi4vbGliL3V0aWxzLmpzJ1xuaW1wb3J0IENvcmVPYmplY3QgZnJvbSAnLi4vbGliL2NvcmUtb2JqZWN0JztcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4uL2xpYi9jb250cm9sbGVyJztcbmltcG9ydCBDb250cm9sbGVyUHJveHkgZnJvbSAnLi4vbGliL2NvbnRyb2xsZXItcHJveHknO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vbGliL3V0aWxzJztcblxuY29uc3QgTW9qaXRvID0ge1xuICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuICdNb2ppdG8nOyB9LFxuICAgIGdldDogZ2V0LFxuICAgIHNldDogc2V0LFxuICAgIGlzQXJyYXk6IGlzQXJyYXksXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICAgIGlzTnVtYmVyOiBpc051bWJlcixcbiAgICBpc0Jvb2xlYW46IGlzQm9vbGVhbixcbiAgICBpc1N0cmluZzogaXNTdHJpbmcsXG4gICAgaXNFbXB0eTogaXNFbXB0eSxcbiAgICB0eXBlT2Y6IHR5cGVPZixcbiAgICBleHRlbmQ6IGV4dGVuZCxcbiAgICBDb3JlT2JqZWN0OiBuZXcgQ29yZU9iamVjdCgpLFxuICAgIENvbnRyb2xsZXJDbGFzczogQ29udHJvbGxlcixcbiAgICBDb250cm9sbGVyOiBDb250cm9sbGVyUHJveHksXG4gICAgY29udHJvbGxlcnM6IFtdXG59O1xuXG4vLyBtYWtlIE1vaml0byBhIGdsb2JhbCBvYmplY3RcbmlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93Lk1vaml0byA9IE1vaml0bztcbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9qaXRvO1xuIiwibGV0IHVuZGVmaW5lZDtcblxuY29uc3QgZ2V0ID0gZnVuY3Rpb24ob2JqLCBwYXJhbSkge1xuICAgIGlmKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHBhcmFtIGluIG9iaikge1xuICAgICAgICByZXR1cm4gb2JqW3BhcmFtXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBzZXQgPSBmdW5jdGlvbihvYmosIHBhcmFtLCB2YWx1ZSkge1xuICAgIGlmKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG9ialtwYXJhbV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBnZW5lcmF0ZVJhbmRvbVN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZ0xlbmd0aCkge1xuICAgIHZhciBjaGFycyA9IFwiMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFRaYWJjZGVmZ2hpa2xtbm9wcXJzdHV2d3h5elwiO1xuICAgIHZhciBzdHJnTGVuZ3RoID0gdHlwZW9mIHN0cmluZ0xlbmd0aCA9PT0gJ251bWJlcicgJiYgc3RyaW5nTGVuZ3RoID4gMCA/IHN0cmluZ0xlbmd0aCA6IDQ7XG4gICAgdmFyIHJhbmRvbVN0cmluZyA9ICcnO1xuICAgIGZvciAodmFyIGk9MDsgaTxzdHJnTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJudW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFycy5sZW5ndGgpO1xuICAgICAgICByYW5kb21TdHJpbmcgKz0gY2hhcnMuc3Vic3RyaW5nKHJudW0scm51bSsxKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhbmRvbVN0cmluZztcbn07XG5cbmNvbnN0IHBhcnNlSlNPTiA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZih0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYodHlwZW9mIEpTT04gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnTW9qaXRvIG5lZWRzIEpTT04gdG8gd29yay4gTWluLiBJRTgnO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpdGVtID0gSlNPTi5wYXJzZShpdGVtKTtcbiAgICAgICAgfSBjYXRjaChleCkge1xuICAgICAgICAgICAgaWYoIWlzTmFOKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0uaW5kZXhPZignLicpID8gcGFyc2VGbG9hdChpdGVtKSA6IHBhcnNlSW50KGl0ZW0sIDEwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0gPT09ICd0cnVlJyA/IHRydWUgOiBpdGVtO1xuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtID09PSAnZmFsc2UnID8gZmFsc2UgOiBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYodGhpcy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIC8vIGhhbmRsZSBhcnJheVxuICAgICAgICBmb3IodmFyIGkgPTAsIG1heD1pdGVtLmxlbmd0aDsgaTxtYXg7IGkrKykge1xuICAgICAgICAgICAgaXRlbVtpXSA9IHRoaXMucGFyc2VKU09OKGl0ZW1baV0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmKHRoaXMuaXNPYmplY3QoaXRlbSkpe1xuICAgICAgICAvLyBoYW5kbGUgb2JqZWN0XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gaXRlbSkge1xuICAgICAgICAgICAgaWYoaXRlbS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgIGl0ZW1bcHJvcF0gPSB0aGlzLnBhcnNlSlNPTihpdGVtW3Byb3BdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXRlbTtcbn07XG5cbmNvbnN0IGlzQXJyYXkgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyYXkpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuY29uc3QgaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgIWlzQXJyYXkob2JqKTtcbn07XG5cbmNvbnN0IGlzQm9vbGVhbiA9IGZ1bmN0aW9uKGJvb2wpIHtcbiAgICByZXR1cm4gdHlwZW9mIGJvb2wgPT09ICdib29sZWFuJztcbn07XG5cbmNvbnN0IGlzTnVtYmVyID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBudW1iZXIgPT09ICdudW1iZXInICYmICFpc05hTihudW1iZXIpICYmIGlzRmluaXRlKG51bWJlcik7XG59O1xuXG5jb25zdCBpc1N0cmluZyA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgIHJldHVybiB0eXBlb2Ygc3RyaW5nID09PSAnc3RyaW5nJztcbn07XG5cbmNvbnN0IGlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZihpc0Jvb2xlYW4ob2JqKSB8fCBpc051bWJlcihvYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYoaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiAhb2JqLmxlbmd0aFxuICAgIH0gZWxzZSBpZihpc09iamVjdChvYmopKSB7XG4gICAgICAgIHJldHVybiAhT2JqZWN0LmtleXMob2JqKS5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICFvYmo7XG4gICAgfVxufTtcblxuY29uc3QgdHlwZU9mID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYoaXNOdW1iZXIob2JqKSkge1xuICAgICAgICByZXR1cm4gJ251bWJlcic7XG4gICAgfSBlbHNlIGlmKGlzQm9vbGVhbihvYmopKSB7XG4gICAgICAgIHJldHVybiAnYm9vbGVhbic7XG4gICAgfSBlbHNlIGlmKGlzU3RyaW5nKG9iaikpIHtcbiAgICAgICAgcmV0dXJuICdzdHJpbmcnO1xuICAgIH0gZWxzZSBpZihpc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfSBlbHNlIGlmKGlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAndW5kZWZpbmVkJztcbiAgICB9XG59O1xuXG5jb25zdCBleHRlbmQgPSBmdW5jdGlvbihvYmoxLCBvYmoyKSB7XG4gICAgaWYoIWlzT2JqZWN0KG9iajEpIHx8ICFpc09iamVjdChvYmoyKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIHByb3AgaW4gb2JqMikge1xuICAgICAgICBpZihvYmoyLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICByZXN1bHRbcHJvcF0gPSBvYmoyW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIHByb3AgaW4gb2JqMSkge1xuICAgICAgICBpZihvYmoxLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICByZXN1bHRbcHJvcF0gPSBvYmoxW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCB7IGdldCwgc2V0LCBwYXJzZUpTT04sIGdlbmVyYXRlUmFuZG9tU3RyaW5nLCBpc0FycmF5LCBpc09iamVjdCwgaXNCb29sZWFuLCBpc051bWJlciwgaXNTdHJpbmcsIGlzRW1wdHksIHR5cGVPZiwgZXh0ZW5kIH07XG4iXX0=
