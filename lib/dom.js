import ENV from './environment';
import { parseJSON } from './utils';

export function querySelectorAll(root, selector) {
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

export function querySelector(selector) {
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

export function getAttribute(element, name) {

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

export function setAttribute(element, name, value) {

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

export function getDataParams(element) {

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

export function addEventListener(element, types, callback, context) {
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

export function hasClass(elem, className) {

    // Check if there is an element and
	// a Class Name given
	if( !elem || !className ) return null;

	// Check if it is a list of elements
	if( elem.length > 1 ) {

		// Run through the list and check if
		// one of them has not that class Name
		for( var i=0, max=elem.length; i<max; i++ ) {
			if( !hasClass( elem[i], className ) ) {
				return false;
			}
		}

		// Not found - return false
		return true;

	} else {
		// Check if browser supports classList
		// Jep: Check with classList
		// Nope: Do a regex
		if( !!elem.classList ) {
			return elem.classList.contains( className );
		} else {
			var className = " " + className + " ";
			return ((" " + elem.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1);
		}
	}
}

export function addClass(elem, className) {

    // Check if there is an element and
	// a Class Name given
	if( !elem || !className ) return null;

	// Check if it is a list of elements
	if( elem.length > 1 ) {

		// Run through the list and add
		// Class Name to all of them
		for( var i=0, max=elem.length; i<max; i++ ) {
			addClass( elem[i], className );
		}

		// Extend all Elements and return it
		return elem;

	} else {

		// Check if browser supports classList
		// Jep: Add it to classList
		// Nope: Add it as string
		if( !!elem.classList ) {
			elem.classList.add( className );
		} else if( !hasClass( elem, className ) ) {
			elem.className += " " + className;
		}

		// return the extended Element
		return elem;
	}
}
export function removeClass(elem, className) {
    // Check if there is an element and
    // a Class Name given
    if( !elem || !className ) return null;

    // Check if it is a list of elements
    if( elem.length > 1 ) {

        // Run through the list and remove
        // Class Name of them all
        for( var i=0, max=elem.length; i<max; i++ ) {
            removeClass( elem[i], className );
        }

        // Extend all Elements and return it
        return elem;

    } else {
        // Check if browser supports classList
        // Jep: Remove it from classList
        // Nope: Remove it with regex
        if( !!elem.classList ) {
            elem.classList.remove( className );
        } else if ( hasClass( elem, className ) ) {
            var reg = new RegExp('(\\s|^)'+ className +'(\\s|$)');
            elem.className = elem.className.replace(reg,' ');
        }

        // return the extended Element
        return elem;
    }
}
