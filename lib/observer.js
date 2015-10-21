import Mojito from './main';
import * as Utils from './utils';

export function observer() {
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

export function addObserver(obj, keyName, fn, args) {

    if(arguments.length < 3) {
        throw '[Type Exeption] addObserver needs 3 arguments';
    }
    if(!Utils.isObject(obj)) {
        throw '[Type Exeption] obj has to be an object';
    }
    if(!Utils.isString(keyName)) {
        throw '[Type Exeption] keyName has to be a string';
    }
    if(!Utils.isFunction(fn)) {
        throw '[Type Exeption] fn has to be a function';
    }
    if(!Utils.isArray(args)) {
        args = [];
    }
    
    const id = Utils.generateRandomString(16);
    
    Mojito._observers.push({
        id: id,
        obj: obj,
        keyName: keyName,
        fn: fn,
        args: args
    });
    
    return id;

}

export function applyObserver(obj, context) {

    if(!Utils.isObject(obj)) {
        return;
    }

    if(!context) {
        context = obj;
        if(!!context.__meta__.observerApplied) {
            return;
        }
        context.__meta__.observerApplied = true;
    }

    let keys = Object.getOwnPropertyNames(obj)
    for (let index in keys) {
        if (obj.hasOwnProperty(keys[index])) {
            let key = keys[index];
            var keySplit = key.split('Observer');
            if(keySplit.length >= 2 && !keySplit[keySplit.length-1]) {
                let observerObject = obj[key].call(context);
                let fn = Utils.get(observerObject, 'fn', true);
                let keyNames = Utils.get(observerObject, 'keyNames', true);
                if(Utils.isFunction(fn) && Utils.isArray(keyNames)) {
                    let i = keyNames.length;
                    while(i--) {
                        let keyName = keyNames[i];
                        if(Utils.isString(keyName)) {
                            addObserver(context, keyName, fn);
                        }
                    }
                }
            }
        }
    }

    if(!!obj.prototype) {
        applyObserver(obj.prototype, context);
    } else if('__proto__' in obj) {
        applyObserver(obj.__proto__, context);
    }
}

export function getObservers(obj, keyName) {
    if(!Utils.isObject(obj)) {
        throw '[Type Exeption] obj has to be an object';
    }
    if(!Utils.isString(keyName)) {
        throw '[Type Exeption] keyName has to be a string';
    }
    let i = Mojito._observers.length;
    let observers = [];

    while(i--) {
        let observer = Mojito._observers[i];
        let observerObject = Utils.get(observer, 'obj', true);
        let observerKeyName = Utils.get(observer, 'keyName', true);
        if(Utils.isObject(observerObject) && Utils.isString(observerKeyName)
            && obj === observerObject && keyName === observerKeyName) {
            observers.push(observer);
        }
    }
    return observers;
}

export function callObserver(obj, keyName) {
    const observers = getObservers(obj, keyName);
    let i = observers.length;
    while(i--) {
        let observer = observers[i];
        let fn = Utils.get(observer, 'fn', true);
        let args = Utils.get(observer, 'args', true);

        if(!Utils.isArray(args)) {
            args = [];
        }

        if(observer && Utils.isFunction(fn)) {
            fn.apply(obj, args);
        }
    }
}

export function removeObserverById(id) {
    if(!Utils.isString(id)) {
        throw '[Type Exeption] id has to be a string';
    }
    let i = Mojito._observers.length;

    while(i--) {
        let observer = Mojito._observers[i];
        if(observer.id === id) {
            Mojito._observers.splice(i,1);
        }
        
        return observer;
    }
}