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
    
    // check for controller classes array
    // if it does not exist, create one
    if(!Utils.isArray(Mojito._controllerClasses)) {
        Mojito._controllerClasses = [];
    }
    
    let contains = false;
    for(let i=0, max=Mojito._controllerClasses.length; i<max; i++) {
        let controllerClass = Mojito._controllerClasses[i];
        if(controllerClass.name === name) {
            contains = true;
            break;
        } 
    }

    if(!contains) {
        Mojito._controllerClasses.push({
            name: name,
            controllerClass: ControllerClass
        });
    }
    
    applyControllers();
}

export function applyControllers(root) {
    if(typeof root === 'undefined') {
        const root = document.body;  
    }
    
    // check for controller instances array
    // if it does not exist, create one
    if(!Utils.isArray(Mojito._controllerInstances)) {
        Mojito._controllerInstances = [];
    }

    // grab elements from DOM where this controller has been attached
    let elements = querySelectorAll('[data-'+ ENV.HTMLDATA().CONTROLLER_DEF+']');

    // loop through elements and create controller instances
    for(let i=0, max=elements.length; i<max; i++) {

        let element = elements[i];
        let params = [];
        let name = getAttribute(element, 'data-' + ENV.HTMLDATA().CONTROLLER_DEF);
        let controllerClass = null;

        // check if controller is already registered (has an id)
        if(getAttribute(element, 'data-' + ENV.HTMLDATA().CONTROLLER_ID)) {
            continue;
        }
        
        if(!name) {
            continue;
        }
        
        for(let i=0, max=Mojito._controllerClasses.length; i<max; i++) {
            let cc = Mojito._controllerClasses[i];
            if(cc.name === name) {
                controllerClass = cc.controllerClass;
                break;
            } 
        }
        
        if(!controllerClass) {
            continue;
        }
        

        // check if there are any params for controller init
        if(getAttribute(element, 'data-' + ENV.HTMLDATA().PARAMS)) {
            params = getDataParams(element);
        }

        // check if controller reference is set and apply it to instance
        let ref = getAttribute(element, 'data-' + ENV.HTMLDATA().CONTROLLER_REF);

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
        let controller = new (Function.prototype.bind.apply(controllerClass, [null].concat(params)));
    }
}

export function applyController(controller) {

     // check name to make sure it is an array
    if(typeof controller === 'undefined' ) {
        throw '[Type Exeption] controller has to be a object';
    }
    
    if(getAttribute(controller._$, 'data-'+ ENV.HTMLDATA().CONTROLLER_ID)) {
        return controller;
    }

    // apply id to dome node
    setAttribute(controller._$, 'data-'+ ENV.HTMLDATA().CONTROLLER_ID, controller.get('_id', true));

    // add controller instance to instances array for later access
    Mojito._controllerInstances.push(controller);

    // add all the computed properties on this controller
    applyComputed(controller);

    // add all the observers on this controller
    applyObserver(controller);

    // add dom logic to controller
    applyDomToController(controller);
    
    return controller;
}

export function applyDomToController(controller, rootElement) {
    
    // apply actions
    applyActionsToController(controller, rootElement);

    // apply class bindings
    applyClassBindingsToController(controller, rootElement);

    // apply input bindings
    applyInputBindingsToController(controller, rootElement);

    // apply content bindings
    applyContentBindingsToController(controller, rootElement);
    
    return controller;
}


export function applyActionsToController(controller, rootElement) {

    // make sure applyDomToController has exactly one arguments
    if(arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if(!Utils.isObject(controller) ) {
        throw '[Type Exeption] controller has to be an object';
    }
    
    if(typeof rootElement !== 'object') {
        rootElement = controller.get('_$', true);
    }

    let actionElements = Array.prototype.slice.call(querySelectorAll(rootElement, '[data-' + ENV.HTMLDATA().ACTION + ']'));

    if(getAttribute(rootElement, 'data-' + ENV.HTMLDATA().ACTION)) {
         actionElements.push(rootElement);
    }

    let i = actionElements.length;

    while(i--) {
        let element = actionElements[i];
        let action = getAttribute(element, 'data-'+ ENV.HTMLDATA().ACTION);
        let id =  getAttribute(element, 'data-'+ ENV.HTMLDATA().ACTION_ID);
        let eventType =  getAttribute(element, 'data-'+ ENV.HTMLDATA().EVENT);

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

                    setAttribute(element, 'data-'+ ENV.HTMLDATA().ACTION_ID, Utils.generateRandomString(16));
                    addEventListener(element, eventType, function(event) {
                        event.preventDefault();
                        let params = getDataParams(element);
                        controller[actionParts[1]].apply(controller, params.concat([event]));
                    }, controller);
            }
        }
    }
}

export function applyClassBindingsToController(controller, rootElement) {
    // make sure applyDomToController has exactly one arguments
    if(arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if(!Utils.isObject(controller) ) {
        throw '[Type Exeption] controller has to be an object';
    }
    
    if(typeof rootElement !== 'object') {
        rootElement = controller.get('_$', true);
    }

    let bindingElements = Array.prototype.slice.call(querySelectorAll(rootElement,
        '[data-' + ENV.HTMLDATA().CLASSBINDING + ']'));

    if(getAttribute(rootElement, 'data-' + ENV.HTMLDATA().CLASSBINDING)) {
         bindingElements.push(rootElement);
    }

    let i = bindingElements.length;

    while(i--) {
        let element = bindingElements[i];
        let bindings = getAttribute(element, 'data-'+ENV.HTMLDATA().CLASSBINDING).split(' ');
        let id =  getAttribute(element, 'data-'+ ENV.HTMLDATA().CLASSBINDING_ID);
        let j = bindings.length;
        
        if(id) {
            continue;
        }

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

            const observerId = addObserver(controller, trigger, function(trigger, element, class1, class2) {
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
            
            setAttribute(element, 'data-'+ ENV.HTMLDATA().CLASSBINDING_ID, observerId);
            
            callObserver(controller, trigger);
        }
    }
}

export function applyInputBindingsToController(controller, rootElement) {

    // make sure applyDomToController has exactly one arguments
    if(arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if(!Utils.isObject(controller) ) {
        throw '[Type Exeption] controller has to be an object';
    }
    
    if(typeof rootElement !== 'object') {
        rootElement = controller.get('_$', true);
    }

    let bindingElements = Array.prototype.slice.call(querySelectorAll(rootElement,
        '[data-' + ENV.HTMLDATA().INPUTBINDING + ']'));

    if(getAttribute(rootElement, 'data-' + ENV.HTMLDATA().INPUTBINDING)) {
         bindingElements.push(rootElement);
    }

    let i = bindingElements.length;

    while(i--) {
        let element = bindingElements[i];
        let binding = getAttribute(element, 'data-'+ ENV.HTMLDATA().INPUTBINDING);
        let id =  getAttribute(element, 'data-'+ ENV.HTMLDATA().INPUTBINDING_ID);

        if(id) {
            continue;
        }

        if(!Utils.isString(binding)) {
            continue;
        }

        binding = binding.split('.');

        if(binding.length < 2 || binding[0] !== controller.get('_className', true)) {
            continue;
        }
        
        setAttribute(element, 'data-'+ ENV.HTMLDATA().INPUTBINDING_ID, Utils.generateRandomString(16));

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

        const observerId = addObserver(controller, param, function(param, element) {
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
        
        setAttribute(element, 'data-'+ENV.HTMLDATA().INPUTBINDING_ID, observerId);
        
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

export function applyContentBindingsToController(controller, rootElement) {

    // make sure applyDomToController has exactly one arguments
    if(arguments.length < 1) {
        throw '[Type Exeption] missing parameters';
    }

    // check controller to make sure it is an object
    if(!Utils.isObject(controller) ) {
        throw '[Type Exeption] controller has to be an object';
    }
    
    if(typeof rootElement !== 'object') {
        rootElement = controller.get('_$', true);
    }

    let bindingElements = Array.prototype.slice.call(querySelectorAll(rootElement,
        '[data-' + ENV.HTMLDATA().CONTENTBINDING + ']'));

    if(getAttribute(rootElement, 'data-' + ENV.HTMLDATA().CONTENTBINDING)) {
         bindingElements.push(rootElement);
    }    

    let i = bindingElements.length;

    while(i--) {
        let element = bindingElements[i];
        let binding = getAttribute(element, 'data-'+ENV.HTMLDATA().CONTENTBINDING);
        let id =  getAttribute(element, 'data-'+ENV.HTMLDATA().CONTENTBINDING_ID);
        
        if(id) {
            continue;
        }

        if(!Utils.isString(binding)) {
            continue;
        }
        binding = binding.split('.');

        if(binding.length < 2 || binding[0] !== controller.get('_className', true)) {
            continue;
        }
        
        setAttribute(element, 'data-'+ ENV.HTMLDATA().CONTENTBINDING_ID, Utils.generateRandomString(16));

        let keyName = binding.slice(1).join('.');
        const observerId = addObserver(controller, keyName, function (keyName, element) {
            let content = controller.get(keyName);
            if (window.jQuery) {
                window.jQuery(element).html(content);
            } else {
                element.innerHTML = content;
            }
            
            setTimeout(function () {                
                applyDomToController(controller, element);
                applyControllers(element);
            }, 0)
        }, [keyName, element]);
        
        setAttribute(element, 'data-'+ ENV.HTMLDATA().CONTENTBINDING_ID, observerId);
        
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
