;(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "Mojito requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

    if(typeof jQuery !== 'function') {
        throw 'Mojito needs jQuery to run';
    }

    DATA_NAMESPACE = 'mojito';
    DATA_CONTROLLER = DATA_NAMESPACE + '-controller';
    DATA_CONTROLLER_ID = DATA_NAMESPACE + '-controller-id';
    DATA_CONTROLLER_REF = DATA_NAMESPACE + '-controller-ref';
    DATA_ACTION = DATA_NAMESPACE + '-action';
    DATA_ACTION_PARAMS = DATA_NAMESPACE + '-params';
    DATA_ACTION_EVENT = DATA_ACTION + '-event';
    EVENT_NAMESPACE = 'mojito';

    var Mojito = Object.create({

        controllers: [],
        controllersTotalAmount: 0,

        /**
            METHODS
        */
        init: function() {
            this.controllersTotalAmount = jQuery('[data-'+ DATA_CONTROLLER + ']').length
        },

        setupControllers: function() {
            if(this.controllers.length === this.controllersTotalAmount) {
                for (var i = 0, max = this.controllers.length; i < max; i++) {
                    this.controllers[i].setupController();
                }
                return true;
            }
            return false;
        },

        get: function(obj, param) {
            if(typeof obj === 'object' && param in obj) {
                return obj[param];
            }
            return null;
        },

        set: function(obj, param, value) {
            if(typeof obj === 'object') {
                obj[param] = value;
                return obj;
            }
            return null;
        },

        createObject: function(obj) {
            var proto = obj;
            var obj = Object.create(obj);
            obj._super = proto;
            return obj;
        },

        getDataParams: function(elem) {
            var params = elem.data(DATA_ACTION_PARAMS);
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
                attributes = this.parseJSON(params);
            }
            return attributes;
        },

        generateRandomString: function(stringLength) {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var strgLength = typeof stringLength === 'number' && stringLength > 0 ? stringLength : 4;
            var randomString = '';
            for (var i=0; i<strgLength; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomString += chars.substring(rnum,rnum+1);
            }
            return randomString;
        },

        parseJSON: function(item) {
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

            if(this.isArray(item)) {
                // handle array
                for(var i =0, max=item.length; i<max; i++) {
                    item[i] = this.parseJSON(item[i]);
                }
            } else if(this.isObject(item)){
                // handle object
                for (var prop in item) {
                    if(item.hasOwnProperty(prop)) {
                        item[prop] = this.parseJSON(item[prop]);
                    }
                }
            }
            return item;
        },

        isArray: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },

        isObject: function(obj) {
            return typeof obj === 'object' && !this.isArray(obj);
        },

        toString: function() {
            return 'Mojito';
        },
    });

    Mojito.Controller = {

        _name: 'Controller',

        init: function() {
        },

        setupController: function() {
            if(!this.get('_isInitialized')) {
                this.set('_isInitialized', true);
                this.init.apply(this, Mojito.getDataParams(this.$));
            }
        },

        extend: function(name, ExtendController) {

            var self = this;

            if(typeof name !== 'string') {
                throw 'No controller name specified';
            }

            if(typeof ExtendController !== 'object') {
                throw 'you have to extend an object not a ' + typeof(ExtendController);
            }

            var Controller = jQuery.extend(Mojito.createObject(self), ExtendController);
            Controller.set('_name', name);
            Mojito[name] = Controller;

            jQuery('[data-'+ DATA_CONTROLLER + '="' + name+'"]').each(function() {
                if(!jQuery(this).data(DATA_CONTROLLER_ID)) {
                    var controllerObject = Controller.create(jQuery(this));
                    controllerObject.applyEvents();
                    Mojito.controllers.push(controllerObject);
                }
            });
            Mojito.setupControllers();

            return Controller;
        },

        create: function(element, controllerId) {
            if(typeof element === 'undefined') {
                element = jQuery('body');
            }
            var id = typeof controllerId === 'string' ? controllerId : Mojito.generateRandomString(16);
            var obj = jQuery.extend(Object.create(this), {
                _id: id,
                _ref: element.data(DATA_CONTROLLER_REF),
                _super: typeof this._super === 'object' && this._super && typeof this._super.create === 'function' ? this._super.create(element, id) : null,
                _isInitialized: false,
                $: element.attr('data-'+DATA_CONTROLLER_ID, id),
            });

            return obj;
        },

        applyEvents: function() {
            var self = this;
            if(!self.get('$')) {
                return null;
            }
            self.$.find('[data-'+ DATA_ACTION +']').each(function() {
                var action = jQuery(this).data(DATA_ACTION);
                var actionEvent = jQuery(this).data(DATA_ACTION_EVENT);
                var actionParams = action.split('.');
                if(typeof actionParams === 'object' && actionParams.length > 1) {
                    var controller = actionParams[0];
                    var method = actionParams[1];

                    if(controller === self.get('_name') && self.get(method)) {
                        jQuery(this).on(typeof actionEvent === 'string' ? actionEvent.split(',').join(' ') : 'click.' + EVENT_NAMESPACE, function(event) {
                            var attributes = Mojito.getDataParams(jQuery(this));
                            event.preventDefault();
                            attributes.push(event);
                            self[method].apply(self, attributes);
                        });
                    }
                }
                return null;
            });
        },

        controllerById: function(id) {
            return this.controllerFor('_id', id);
        },

        controllerByRef: function(ref) {
            return this.controllerFor('_ref', ref);
        },

        controllerFor: function(param, value) {
            for(var i=0, max=Mojito.controllers.length; i<max; i++) {
                var controller = Mojito.controllers[i];
                if(controller.get(param) === value) {
                    return controller;
                }
            }
            return null;
        },

        get: function(param) {
            return Mojito.get(this, param);
        },

        set: function(param, value) {
            return Mojito.set(this, param, value);
        },

        toString: function() {
            return this._name;
        },
    };

    Mojito.init();

    if ( typeof noGlobal === 'undefined' ) {
        window.Mojito = Mojito;
    }

    return Mojito;
}));
