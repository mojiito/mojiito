import { assert } from './../../debug/debug';

export function onBeforeInstantiation(TargetClass: any, callback: Function) {
    return instantiation(TargetClass, callback);
}

export function onAfterInstantiation(TargetClass: any, callback: Function) {
    return instantiation(TargetClass, null, callback);
}

export function instantiation(TargetClass: any, onBeforeInstantiation?: Function, onAfterInstantiation?: Function): any {
    assert(typeof TargetClass === 'function', 'TargetClass has to be a class!', TypeError);
    
    if (typeof onBeforeInstantiation === 'function') {
        addInstantiationCallback(TargetClass, '_onBeforeInstantiation', onBeforeInstantiation);
    }
    if (typeof onAfterInstantiation === 'function') {
        addInstantiationCallback(TargetClass, '_onAfterInstantiation', onAfterInstantiation);
    }
    
    if (TargetClass['_hasInstantiationHooks']) {
        return;
    }
    
    TargetClass['_hasInstantiationHooks'] = true;
    
    let OriginalClass: any = TargetClass;
    
    // a utility function to generate instances of a class
    function construct(constructor: any, args: Array<any>) {
        const C: any = function() {
            callInstantiationCallbacks(constructor['_onBeforeInstantiation']);
            const instance = constructor.apply(this, args);
            callInstantiationCallbacks(constructor['_onAfterInstantiation']);
            return instance;
        }
        C.prototype = constructor.prototype;
        return new C();
    }
    
    TargetClass = function(...args: Array<any>) {
        return construct(OriginalClass, args);
    }
    
    // copy prototype so intanceof operator still works
    TargetClass.prototype = OriginalClass.prototype;
    
    return TargetClass;
}

function addInstantiationCallback(Klass: any, key: string, callback: Function) {
    var callbacks = Klass[key];
    if (!Array.isArray(callbacks)) {
        Klass[key] = callbacks = [];
    }
    callbacks.push(callback);
}

function callInstantiationCallbacks(callbacks: Array<Function>) {
    if (Array.isArray(callbacks)) {
            for (let index = 0; index < callbacks.length; index++) {
                let callback = callbacks[index];
                if (typeof callback === 'function') {
                    callback(this);
                }
            }
        }
}