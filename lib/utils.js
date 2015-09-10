import Mojito from './main';
import { callObserver } from './observer';
import CoreObject from './core-object';
import { applyComputed, getComputedProperty } from './computed';

let undefined;

export function get(obj, param, ignoreComputed) {
    if(isObject(obj) && isString(param)) {
        const params = param.split('.');
        param = params.slice(0,1)[0];
        if(param in obj) {
            return params.length === 1 ? obj[param] : get(obj[param], params.slice(1).join('.'), ignoreComputed);
        }
        if(params.length === 1 && !ignoreComputed) {
            applyComputed(obj);
            return getComputedProperty(obj, param);
        }
        return null;
    }
    throw '[Type Exeption] obj has to be an object ['+obj+'] & param has to be a string ['+param+']';
};

export function set(obj, param, value) {
    if(isObject(obj) && isString(param)) {
        const params = param.split('.');
        param = params.slice(0,1)[0];
        if(params.length === 1) {
            obj[param] = value;
            callObserver(obj, param);
            return obj[param];
        }
        if(!(param in obj)) {
            obj[param] = {};
        } else if(!isObject(obj[param])){
            throw '[Type Exeption] param has to be an object to cue it';
        }
        return set(obj[param], params.slice(1).join('.'), value);
    }
    throw '[Type Exeption] obj has to be an object & param has to be a string';
};

export function generateRandomString(stringLength) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var strgLength = typeof stringLength === 'number' && stringLength > 0 ? stringLength : 4;
    var randomString = '';
    for (var i=0; i<strgLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum,rnum+1);
    }
    if(Mojito._ids.indexOf(randomString) !== -1) {
        randomString = generateRandomString(stringLength);
    }
    Mojito._ids.push(randomString);
    return randomString;
};

export function parseJSON(item) {
    if(typeof item === 'string') {
        if(typeof JSON === 'undefined') {
            throw 'Mojito needs JSON to work. Min. IE8';
        }
        try {
            item = JSON.parse(item);
        } catch(ex) {
            if(!isNaN(item)) {
                item = item.indexOf('.') ? parseFloat(item) : parseInt(item, 10);
            } else {
                item = item === 'true' ? true : item;
                item = item === 'false' ? false : item;
            }
        }
    }

    if(isArray(item)) {
        // handle array
        for(var i =0, max=item.length; i<max; i++) {
            item[i] = parseJSON(item[i]);
        }
    } else if(isObject(item)){
        // handle object
        for (var prop in item) {
            if(item.hasOwnProperty(prop)) {
                item[prop] = parseJSON(item[prop]);
            }
        }
    }
    return item;
};

export function isArray(array) {
    return Object.prototype.toString.call(array) === '[object Array]';
};

export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

export function isBoolean(bool) {
    return typeof bool === 'boolean';
};

export function isNumber(number) {
    return typeof number === 'number' && !isNaN(number) && isFinite(number);
};

export function isString(string) {
    return typeof string === 'string';
};

export function isFunction(fn) {
    return typeof fn === 'function';
};

export function isEmpty(obj) {
    if(isBoolean(obj) || isNumber(obj) || isFunction(obj)) {
        return false;
    } else if(isArray(obj)) {
        return !obj.length
    } else if(isObject(obj)) {
        return !Object.keys(obj).length;
    } else {
        return !obj;
    }
};

export function typeOf(obj) {
    if(isNumber(obj)) {
        return 'number';
    } else if(isBoolean(obj)) {
        return 'boolean';
    } else if(isString(obj)) {
        return 'string';
    } else if(isArray(obj)) {
        return 'array';
    } else if(isObject(obj)) {
        return 'object';
    } else if(isFunction(obj)) {
        return 'function';
    } else {
        return 'undefined';
    }
};

export function extend(target, source) {

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
                            o[tItem[i]] = true
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
                    tItem = target[prop]

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
