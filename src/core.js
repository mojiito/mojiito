(function($) {

    if(typeof $ !== 'function') {
        throw 'Mojito needs jQuery to run';
    }

    DATA_NAMESPACE = 'mojito';
    DATA_CONTROLLER = DATA_NAMESPACE + '-controller';
    DATA_CONTROLLER_REF = DATA_NAMESPACE + '-controller-ref';
    DATA_ACTION = DATA_NAMESPACE + '-action';
    DATA_ACTION_PARAMS = DATA_NAMESPACE + '-params';
    EVENT_NAMESPACE = 'mojito';

    Mojito = 'object' === typeof Mojito ? Mojito : Object.create({

        controllers: [],

        /**
            METHODS
        */
        toString: function() {
            return 'Mojito';
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

        get: function(obj, param) {
            if(typeof obj === 'object' && param in obj) {
                return obj[param];
            }
            return null;
        },

        set: function(obj, param, value) {
            if(typeof obj === 'object') {
                obj[param] = value;
                return true;
            }
            return false;
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
        }
    });

    Mojito.Controller = {

        _name: 'Controller',

        init: function() {
        },

        setup: function() {
            var self = this;
            $('[data-'+ DATA_CONTROLLER + '="' + self.toString()+'"]').each(function() {
                if(!$(this).data(DATA_CONTROLLER_REF)) {
                    var controllerObject = self.create($(this));
                    controllerObject.applyEvents();
                    Mojito.controllers.push(controllerObject);
                }
            });
        },

        extend: function(name, extendController) {

            if(typeof name !== 'string') {
                throw 'No controller name specified';
            }

            if(typeof extendController !== 'object') {
                throw 'you have to extend an object not a ' + typeof(extendController);
            }

            var Controller = $.extend(Mojito.createObject($.extend(Mojito.createObject(this), {_name: name})), extendController);

            Controller.setup();

            return Controller;
        },

        create: function(element) {
            if(typeof $ === 'undefined') {
                element = $('body');
            }
            var id = Mojito.generateRandomString(16);
            var obj = $.extend(Mojito.createObject(this), {
                _id: id,
                _super: this._super,
                $: element.attr('data-'+DATA_NAMESPACE+'-controller-id', id),
            });
            obj.init.apply(obj, Mojito.getDataParams(obj.$));
            return obj;
        },

        applyEvents: function() {
            var self = this;
            if(!self.get('$')) {
                return null;
            }
            self.$.find('[data-'+ DATA_ACTION +']').each(function() {
                var action = $(this).data(DATA_ACTION);
                var actionParams = action.split('.');
                if(typeof actionParams === 'object' && actionParams.length > 1) {
                    var controller = actionParams[0];
                    var method = actionParams[1];

                    if(controller === self.get('_name') && self.get(method)) {
                        $(this).on('click.'+EVENT_NAMESPACE, function(event) {
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

        controllerFor: function(reference) {
            for(var i=0, max=reference.length; i<max; i++) {

            }
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
})(jQuery)
