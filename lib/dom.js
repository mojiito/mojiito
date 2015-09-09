import ENV from './environment';
import { parseJSON } from './utils';

const querySelectorAll = function(root, selector) {
    if(typeof document !== 'object') {
        throw 'No document found';
    }

    if(!('querySelectorAll' in document)) {
        try {
            console.error('[Type Error] querySelectorAll function not found, probably your browser version is too old. (http://caniuse.com/#search=querySelectorAll)');
        } finally {
            return [];
        }
    }

    if(typeof root === 'string') {
        selector = root;
        root = document;
    } else if(typeof root !== 'object') {
        try {
            console.error('[Type Error] Root has to be a DOM Element');
        } finally {
            return [];
        }
    }

    if(typeof selector !== 'string') {
        try {
            console.error('[Type Error] Selector has to be a string');
        } finally {
            return [];
        }
    }

    return document.querySelectorAll(selector);
}

const querySelector = function(selector) {
    if(typeof document !== 'object') {
        throw 'No document found';
    }

    if(!('querySelector' in document)) {
        try {
            console.error('[Type Error] querySelector function not found, probably your browser version is too old. (http://caniuse.com/#search=querySelector)');
        } finally {
            return [];
        }
    }

    if(typeof selector !== 'string') {
        try {
            console.error('[Type Error] Selector has to be a string');
        } finally {
            return [];
        }
    }

    return document.querySelector(selector);
}

const getAttribute = function(element, name) {

    if(typeof document !== 'object') {
        throw 'No document found';
    }

    if(typeof element !== 'object' || !('getAttribute' in element)) {
        try {
            console.error('[Type Error] Element has to be a DOM Element and support the getAttribute method');
        } finally {
            return null;
        }
    }

    if(typeof name !== 'string') {
        try {
            console.error('[Type Error] Attribute name has to be a string');
        } finally {
            return null;
        }
    }

    return element.getAttribute(name);
}

const setAttribute = function(element, name, value) {

    if(typeof document !== 'object') {
        throw 'No document found';
    }

    if(typeof element !== 'object' || !('setAttribute' in element)) {
        try {
            console.error('[Type Error] Element has to be a DOM Element and support the getAttribute method');
        } finally {
            return null;
        }
    }

    if(typeof name !== 'string') {
        try {
            console.error('[Type Error] Attribute name has to be a string');
        } finally {
            return null;
        }
    }

    element.setAttribute(name, value);

}

const getDataParams = function(element) {

    var params = getAttribute(element, 'data-' + (ENV.HTMLDATA_SHORTHAND ? ENV.HTMLDATA_PARAMS_SHORTHAND : ENV.HTMLDATA_PARAMS));
    var attributes = [];
    if(typeof params === 'string' && params.length > 0) {

        params = params.replace(/,/g,"\",\"");
        params = params.replace(/:/g,"\":\"");
        params = params.replace(/{/g,"{\"");
        params = params.replace(/}/g,"\"}");
        params = params.replace(/\[/g,"[\"");
        params = params.replace(/\]/g,"\"]");
        params = params.replace(/}"/g,"}");
        params = params.replace(/"{/g,"{");
        params = params.replace(/]"/g,"]");
        params = params.replace(/"\[/g,"[");
        if(params.charAt(0) !== '{' && params.charAt(0) !== '[') {
            params = '\"'+params;
        }
        if(params.charAt(params.length-1) !== '}' && params.charAt(params.length-1) !== ']') {
            params = params+'\"';
        }
        params = '[' + params+']';
        attributes = parseJSON(params);
    }
    return attributes;

};

const addEventListener = function(element, types, callback, context) {
    if(typeof element !== 'object') {
        throw('[Type Exeption] element has to be a DOM Element');
    }

    if(typeof types === 'string') {
        types = types.split(' ');
    } else if(types !== 'array') {
        throw('[Type Exeption] types has to be a string or an array');
    }

    if(typeof callback !== 'function') {
        throw('[Type Exeption] callback has to be a function');
    }

    if(!element.addEventListener) {
        throw('[Type Exeption] There is no addEventListener function on element');
    }

    let validTypes = ENV.EVENTTYPES.split(' ');
    let i = types.length;

    while(i--) {
        let type = types[i];
        if(validTypes.indexOf(type)) {
            element.addEventListener(type, function(event) {
                callback.apply((!!context ? context : callback), [].concat([event]))
            });
        }
    }

    return element;
}

export { querySelector, querySelectorAll, getAttribute, setAttribute, getDataParams, addEventListener };
