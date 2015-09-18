import ENV from './environment';
import * as Utils from './utils';
import { getDataParams, querySelector, querySelectorAll, getAttribute, setAttribute, addEventListener, hasClass, addClass, removeClass } from './dom';
import Mojito from './main';
import { applyObserver, addObserver, callObserver } from './observer';
import { applyComputed } from './computed';

/**
    registers a controller in mojito, creates an instance
    and does all the magic for setting up all the controller stuff
*/
export function registerController(name, ControllerClass) {

    // make sure registerController has exactly two arguments
    if(arguments.length < 2) {
        throw '[Type Exeption] missing parameters';
    }

    // check name to make sure it is an array
    if(!Utils.isString(name) ) {
        throw '[Type Exeption] name has to be a string';
    }

    // check ControllerClass to make sure it is a function or object
    if(!Utils.isFunction(ControllerClass) && !Utils.isObject(ControllerClass) ) {
        throw '[Type Exeption] No ControllerClass found for '+name+' (maybe you forgot to export '+name+' as default)';
    }

    // check for controller instances array
    if(!Utils.isArray(Mojito._controllerInstances)) {
        throw '[Type Exeption] No _controllerInstances found';
    }

    // grab elements from DOM where this controller has been attached
    let elements = querySelectorAll('[data-'+ (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_CONTROLLER_DEF_SHORTHAND : ENV.HTMLDATA_CONTROLLER_DEF) +'="'+name+'"]');

    // loop through elements and create controller instances
    for(let i=0, max=elements.length; i<max; i++) {

        let element = elements[0];
        let params = [];
        // check if controller is already registered (has an id)
        if(getAttribute(element, 'data-' + (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_CONTROLLER_ID_SHORTHAND : ENV.HTMLDATA_CONTROLLER_ID))) {
            continue;
        }

        // check if there are any params for controller init
        if(getAttribute(element, 'data-' + (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_PARAMS_SHORTHAND : ENV.HTMLDATA_PARAMS))) {
            params = getDataParams(element);
        }

        // check if controller reference is set and apply it to instance
        let ref = getAttribute(element, 'data-' + (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_CONTROLLER_REF_SHORTHAND : ENV.HTMLDATA_CONTROLLER_REF));

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
        let controller = new (Function.prototype.bind.apply(ControllerClass, [null].concat(params)));

        // return instance
        return controller;
    }

    return null;
}

export function applyController(controller) {
    
     // check name to make sure it is an array
    if(typeof controller === 'undefined' ) {
        throw '[Type Exeption] controller has to be a object';
    }

    // apply id to dome node
    setAttribute(controller._$, (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_CONTROLLER_ID_SHORTHAND : ENV.HTMLDATA_CONTROLLER_ID),controller.get('_id', true));

    // add controller instance to instances array for later access
    Mojito._controllerInstances.push(controller);

    // add all the computed properties on this controller
    applyComputed(controller);

    // add all the observers on this controller
    applyObserver(controller);

    // apply actions
    applyActionsToController(controller);

    // apply class bindings
    applyClassBindingsToController(controller);

    // apply input bindings
    applyInputBindingsToController(controller);

    // apply content bindings
    applyContentBindingsToController(controller);
}


export function applyActionsToController(controller) {

    // make sure applyDomToController has exactly one arguments
    if(arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if(!Utils.isObject(controller) ) {
        throw '[Type Exeption] controller has to be an object';
    }

    let actionElements = querySelectorAll(controller.get('_$', true),
        '[data-' + (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_ACTION_SHORTHAND : ENV.HTMLDATA_ACTION) + ']');

    let i = actionElements.length;

    while(i--) {
        let element = actionElements[i];
        let action = getAttribute(element, 'data-'+(ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_ACTION_SHORTHAND : ENV.HTMLDATA_ACTION));
        let id =  getAttribute(element, 'data-'+(ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_ACTION_SHORTHAND_ID : ENV.HTMLDATA_ACTION_ID));
        let eventType =  getAttribute(element, 'data-'+(ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_EVENT_SHORTHAND : ENV.HTMLDATA_EVENT));

        if(id) {
            continue;
        }

        if(Utils.isString(action)) {
            let actionParts = action.split('.');

            if(actionParts.length === 2
                && actionParts[0] === controller.get('_className', true)
                && actionParts[1] in controller) {

                    if(!eventType || ENV.EVENTTYPES.split(' ').indexOf(eventType) === -1) {
                        eventType = ENV.DEFAULT_EVENTTYPE;
                    }

                    setAttribute(element, 'data-'+(ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_ACTION_ID_SHORTHAND : ENV.HTMLDATA_ACTION_ID), Utils.generateRandomString(16));
                    addEventListener(element, eventType, function(event) {
                        event.preventDefault();
                        let params = getDataParams(element);
                        controller[actionParts[1]].apply(controller, params.concat([event]));
                    }, controller);
            }
        }
    }
}

export function applyClassBindingsToController(controller) {
    // make sure applyDomToController has exactly one arguments
    if(arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if(!Utils.isObject(controller) ) {
        throw '[Type Exeption] controller has to be an object';
    }

    let bindingElements = querySelectorAll(controller.get('_$', true),
        '[data-' + (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_CLASSBINDING_SHORTHAND : ENV.HTMLDATA_CLASSBINDING) + ']');

    let i = bindingElements.length;

    while(i--) {
        let element = bindingElements[i];
        let bindings = getAttribute(element, 'data-'+(ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_CLASSBINDING_SHORTHAND : ENV.HTMLDATA_CLASSBINDING)).split(' ');
        let j = bindings.length;

        while(j--) {
            let binding = bindings[j];

            if(!Utils.isString(binding)) {
                continue;
            }

            binding = binding.split('.');

            if(binding.length !== 2 || binding[0] !== controller.get('_className', true)) {
                continue;
            }

            binding = binding[1].split(':');

            if(!binding.length || !binding[0].length) {
                continue;
            }

            let trigger = binding[0];
            let class1 = (binding.length > 1 && binding[1].length) ? binding[1] : null;
            let class2 = (binding.length > 2 && binding[2].length) ? binding[2] : null;

            addObserver(controller, trigger, function(trigger, element, class1, class2) {
                if(this.get(trigger)) {
                    if(!!class1) {
                        addClass(element, class1);
                    } else {
                        addClass(element, trigger);
                    }
                    !!class2 && removeClass(element, class2);
                } else {
                    if(!!class1) {
                        removeClass(element, class1);
                    } else {
                        removeClass(element, trigger);
                    }
                    !!class2 && addClass(element, class2);
                }
            }, [trigger, element, class1, class2]);
            callObserver(controller, trigger);
        }
    }
}

export function applyInputBindingsToController(controller) {

    // make sure applyDomToController has exactly one arguments
    if(arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if(!Utils.isObject(controller) ) {
        throw '[Type Exeption] controller has to be an object';
    }

    let bindingElements = querySelectorAll(controller.get('_$', true),
        '[data-' + (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_INPUTBINDING_SHORTHAND : ENV.HTMLDATA_INPUTBINDING) + ']');

    let i = bindingElements.length;

    while(i--) {
        let element = bindingElements[i];
        let binding = getAttribute(element, 'data-'+(ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_INPUTBINDING_SHORTHAND : ENV.HTMLDATA_INPUTBINDING));

        if(!Utils.isString(binding)) {
            continue;
        }

        binding = binding.split('.');

        if(binding.length < 2 || binding[0] !== controller.get('_className', true)) {
            continue;
        }

        let param = binding.slice(1).join('.');
        let events = '';

        switch (element.tagName.toLowerCase()) {
            case 'textarea':
            case 'input':
                events = 'input change paste';
                break;
            case 'select':
                events = 'change';
                break;
        }
        (function(element, events, controller, param) {
            addEventListener(element, events, function(event) {
                if(element.type === 'checkbox') {
                    value = element.checked;
                } else if(element.type !== 'radio' || element.checked) {
                    value = element.value;
                }

                if(value !== controller.get(param)) {
                    controller.set(param, value);
                }
            });
        })(element, events, controller, param);

        addObserver(controller, param, function(param, element) {
            switch (element.type) {
                case 'checkbox':
                    (element.checked !== !!controller.get(param)) && (element.checked = !!controller.get(param));
                    break;
                case 'radio':
                    element.checked = (controller.get(param) === element.value);
                    break;
                default:
                    if(controller.get(param) !== element.value) {
                        element.value = controller.get(param);
                    }
                break;
            }
        }, [param, element]);

        let value = null;
        if(element.type === 'checkbox') {
            value = element.checked;
        } else if(element.type !== 'radio' || element.checked) {
            value = element.value;
        }

        if(!!value) {
            controller.set(param, value);
        } else if(controller.get(param)){
            switch (element.type) {
                case 'checkbox':
                    (element.checked !== !!controller.get(param)) && (element.checked = !!controller.get(param));
                    break;
                case 'radio':
                    element.checked = (controller.get(param) === element.value);
                    break;
                default:
                    if(controller.get(param) !== element.value) {
                        element.value = controller.get(param);
                    }
                break;
            }
        }
    }

}

export function applyContentBindingsToController(controller) {
    // make sure applyDomToController has exactly one arguments
    if(arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if(!Utils.isObject(controller) ) {
        throw '[Type Exeption] controller has to be an object';
    }

    let bindingElements = querySelectorAll(controller.get('_$', true),
        '[data-' + (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_CONTENTBINDING_SHORTHAND : ENV.HTMLDATA_CONTENTBINDING) + ']');

    let i = bindingElements.length;

    while(i--) {
        let element = bindingElements[i];
        let binding = getAttribute(element, 'data-'+(ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_CONTENTBINDING_SHORTHAND : ENV.HTMLDATA_CONTENTBINDING));

        if(!Utils.isString(binding)) {
            continue;
        }

        binding = binding.split('.');

        if(binding.length < 2 || binding[0] !== controller.get('_className', true)) {
            continue;
        }

        let keyName = binding.slice(1).join('.');

        addObserver(controller, keyName, function(keyName, element) {
            element.innerHTML = controller.get(keyName) ? controller.get(keyName) : '';
        }, [keyName, element]);
        callObserver(controller, keyName);
    }
}

export function register(type, name, Class) {

    if(arguments.length < 3) {
        throw '[Type Exeption] missing parameters';
    }

    if(!Utils.isString(type) || !Utils.isString(name) ) {
        throw '[Type Exeption] type and name have to be strings';
    }

    if(type === 'controller') {
        return registerController(name, Class);
    }

    return null;

}

export function getControllersByParam(param, value) {

    // check for controller instances array
    if(!Utils.isArray(Mojito._controllerInstances)) {
        throw '[Type Exeption] No _controllerInstances found';
    }

    // check id to make sure it is a string
    if(!Utils.isString(value)) {
        console.error('[Type Error] '+ param +' has to be a string');
        return null;
    }

    let i = Mojito._controllerInstances.length;
    let result = [];
    while(i--) {
        let controller = Mojito._controllerInstances[i];
        if(controller.get(param) === value) {
            result.push(controller);
        }
    }
    return result;

}

export function getControllerById(id) {

    const controllers = getControllersByParam('_id', id);
    return controllers.length ? controllers[0] : null;

}

export function getControllerByRef(ref) {

    const controllers = getControllersByParam('_ref', ref);
    return controllers.length ? controllers[0] : null;

}

export function getControllersByClassName(name) {

    return getControllersByParam('_className', name);

}
