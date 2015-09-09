import Mojito from './main';
import * as Utils from './utils';
import { addObserver, callObserver } from './observer';

export function computed() {
    if(arguments.length <2) {
        throw '[Type Exeption] observer needs at least 2 arguments';
    }

    let fn = arguments[arguments.length-1];
    let keyNames = Array.prototype.slice.call(arguments, 0,-1);
    let i = keyNames.length;

    if(!Utils.isFunction(fn)) {
        throw '[Type Exeption] last argument has to be a function';
    }

    while(i--) {
        if(!Utils.isString(keyNames[i])) {
            throw '[Type Exeption] all keyNames have to be a string';
        }
    }

    return {
        keyNames: keyNames,
        fn: fn
    }
}

export function applyComputed(obj, context) {
    if(!Utils.isObject(obj)) {
        return;
    }

    if(!context) {
        context = obj;
        if(!Utils.get(context, '__meta__', true)) {
            Utils.set(context, '__meta__', {});
        }
        if(Utils.get(context, '__meta__.computedApplied', true)) {
            return;
        }
        Utils.set(context, '__meta__.computedApplied', true);
    }

    let keys = Object.getOwnPropertyNames(obj)
    for (let index in keys) {
        if (obj.hasOwnProperty(keys[index])) {
            let key = keys[index];
            var keySplit = key.split('Computed');
            if(keySplit.length >= 2 && !keySplit[keySplit.length-1]) {
                let computedKey = keySplit.join('');
                let computedObject = obj[key].call(context);
                let fn = Utils.get(computedObject, 'fn', true);
                let keyNames = Utils.get(computedObject, 'keyNames', true);
                if(Utils.isFunction(fn) && Utils.isArray(keyNames)) {
                    let i = keyNames.length;
                    while(i--) {
                        let keyName = keyNames[i];
                        if(Utils.isString(keyName)) {
                            addObserver(context, keyName, function(computedKey, fn) {
                                callObserver(context, computedKey);
                                this.set('__meta__.cache.'+computedKey, fn.call(this));
                            }, [computedKey, fn, context]);
                            if(i===0) {
                                callObserver(context, keyName);
                            }
                        }
                    }
                }
            }
        }
    }

    if(!!obj.prototype) {
        applyComputed(obj.prototype, context);
    } else if('__proto__' in obj) {
        applyComputed(obj.__proto__, context);
    }
}

export function getComputedProperty(obj, keyName) {
    if(Utils.isObject(obj) && Utils.isString(keyName) && Utils.get(obj, '__meta__.cache.'+keyName, true)) {
        return Utils.get(obj, '__meta__.cache.'+keyName, true);
    }
    return null;
}
