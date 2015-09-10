import { get, set } from '../lib/utils.js';

class CoreObject {

    constructor() {
        this.set('__meta__',{
            observerApplied: false,
            computedApplied: false,
            cache: {}
        }, true);
    }

    set(param, value) {
        return set(this, param, value);
    }

    get(param, ignoreComputed) {
        return get(this, param, ignoreComputed);
    }
}

export default CoreObject;
