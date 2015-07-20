(function($) {

    if(typeof $ !== 'function') {
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

    Mojito = 'object' === typeof Mojito ? Mojito : Object.create({

        controllers: [],
        controllersTotalAmount: 0,

        /**
            METHODS
        */
        init: function() {
            this.controllersTotalAmount = $('[data-'+ DATA_CONTROLLER + ']').length
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
            if(!!params) {
                 attributes = params.split(',');
                 for(var i=0, max=attributes.length; i<max; i++) {
                     if(!isNaN(attributes[i])) {
                         attributes[i] = attributes[i].indexOf('.') ? parseFloat(attributes[i]) : parseInt(attributes[i], 10);
                     }
                 }
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

            var Controller = $.extend(Mojito.createObject(self), ExtendController);
            Controller.set('_name', name);
            Mojito[name] = Controller;

            $('[data-'+ DATA_CONTROLLER + '="' + name+'"]').each(function() {
                if(!$(this).data(DATA_CONTROLLER_ID)) {
                    var controllerObject = Controller.create($(this));
                    controllerObject.applyEvents();
                    Mojito.controllers.push(controllerObject);
                }
            });
            Mojito.setupControllers();

            return Controller;
        },

        create: function(element, controllerId) {
            if(typeof $ === 'undefined') {
                element = $('body');
            }
            var id = typeof controllerId === 'string' ? controllerId : Mojito.generateRandomString(16);
            var obj = $.extend(Object.create(this), {
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
                var action = $(this).data(DATA_ACTION);
                var actionEvent = $(this).data(DATA_ACTION_EVENT);
                var actionParams = action.split('.');
                if(typeof actionParams === 'object' && actionParams.length > 1) {
                    var controller = actionParams[0];
                    var method = actionParams[1];

                    if(controller === self.get('_name') && self.get(method)) {
                        $(this).on(typeof actionEvent === 'string' ? actionEvent.split(',').join(' ') : 'click.' + EVENT_NAMESPACE, function(event) {
                            var attributes = Mojito.getDataParams($(this));
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
})(jQuery)
