(function (window, undefined) {

    var NS = "APP",
        app = window[NS] = window[NS] || {};


    function extend(receiver, sender) {
        for (var prop in sender) {
            if (sender[prop] != undefined && receiver[prop] == undefined) {
                receiver[prop] = sender[prop];
            }
        }
        return receiver;
    }

    app.Lang = (function () {

        var TYPES = {
                'undefined': 'undefined',
                'number': 'number',
                'boolean': 'boolean',
                'string': 'string',
                '[object Function]': 'function',
                '[object RegExp]': 'regexp',
                '[object Array]': 'array',
                '[object Date]': 'date',
                '[object Error]': 'error'
            },

            TOSTRING  = Object.prototype.toString,

            L = {
                type: function (o) {
                    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
                },
                isFunction: function(o) {
                    return L.type(o) === 'function';
                },
                isObject: function (o) {
                    var t = typeof o;
                    return o && (t === 'object' || (t === 'function' || L.isFunction(o))) || false;
                },
                isArray: function (o) {
                    return L.type(o) === 'array';
                }
            };

        return L;
    })();


    /**
     * Get or create namespace for module
     *
     * @param   ns          {String}    namespace
     * @param   origin      {Object}    initial object (optional)
     * @return              {Object}
     */
    app.namespace = function (ns, origin) {
        var i, obj = window[NS], part;

        ns = ns.split(".");

        for (i = (ns[0] === NS) ? 1 : 0; i < ns.length; i++) {
            part = obj[ns[i]] || {};
            obj = obj[ns[i]] = i === ns.length - 1 && origin ? extend(origin, part) : part;
        }

        return obj;
    };


    /**
     * Create module from object
     *
     * Based on Douglas Crockford's work "Prototypal Inheritance in JavaScript"
     * http://javascript.crockford.com/prototypal.html
     *
     * @param origin        {Object}    initial object
     */
    app.module = function (origin) {
        var F = function () {};
        F.prototype = origin;
        return new F();
    };

}(window));