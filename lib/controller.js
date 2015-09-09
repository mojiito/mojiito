import CoreObject from './core-object';
import * as Utils from './utils';
import Mojito from './main';
import { getControllersByParam, getControllerById, getControllerByRef, getControllersByClassName } from './core';

class Controller extends CoreObject {

    constructor(config) {
        super();

        if(typeof config === 'object') {

            this.set('_$', config.element);
            this.set('_id', config.id);
            this.set('_ref', config.ref);
            this.set('_className', config.className);

            if(typeof jQuery === 'function') {
                const $ = function(selector) {
                    if(typeof selector === 'string') {
                        return jQuery(this.get('_$', true)).find(selector);
                    } else {
                        return jQuery(this.get('_$', true));
                    }
                }
                this.set('$', $);
            } else {
                this.set('$', this.get('_$', true));
            }
        } else {
            throw 'Please call super(...args), in your Controller!';
        }
    }

    getControllersByParam(param, value) {
        return getControllersByParam(param, value);
    }

    getControllerById(id) {
        return getControllerById(id);
    }

    getControllerByRef(ref) {
        return getControllerByRef(ref);
    }

    getControllersByClassName(name) {
        return getControllersByClassName(name);
    }

}

export default Controller;
