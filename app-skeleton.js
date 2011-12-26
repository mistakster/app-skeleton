/**
 * Application skeleton
 * @version 1.1.0
 * @author  Vladimir Kuznetsov
 * @see     <a href="https://github.com/mistakster/app-skeleton">Application skeleton</a>
 */

/* jslint unparam: true, sloppy: true, forin: true, maxerr: 50, indent: 4 */

(function (window, NS) {

    var app = window[NS] = window[NS] || {},
        // shortcuts
        PUSH = Array.prototype.push,
        UNSHIFT = Array.prototype.unshift,
        TOSTRING = Object.prototype.toString;


    function isVoid(obj) {
        return typeof obj === "undefined" || obj === null;
    }

    function isFunction(obj) {
        return TOSTRING.apply(obj) === "[object Function]";
    }

    function isObject(obj) {
        return obj && TOSTRING.apply(obj) === "[object Object]";
    }

    function isArray(obj) {
        return TOSTRING.apply(obj) === "[object Array]";
    }

    function makeArray(obj) {
        return isArray(obj) ? obj : [obj];
    }

    function mix(receiver, sender) {
        var prop;

        for (prop in sender) {
            if (!isVoid(sender[prop]) && isVoid(receiver[prop])) {
                receiver[prop] = sender[prop];
            }
        }

        return receiver;
    }

    // namespace
    (function () {

        var defaults = {};

        function getContext(ns, origin, root) {
            var i, part;

            if (ns) {
                ns = ns.split(".");
                for (i = (ns[0] === NS) ? 1 : 0; i < ns.length; i += 1) {
                    part = root[ns[i]] || {};
                    root = root[ns[i]] = i === ns.length - 1 && origin ? mix(origin, part) : part;
                }
            }

            return root;
        }

        /**
         * Get or create namespace for module
         *
         * @param   namespace   {String}    named context in public space
         * @param   origin      {Object}    initial object (optional)
         * @return              {Object}
         */
        app.namespace = function (namespace, origin) {
            return getContext(namespace, origin, window[NS]);
        };


        /**
         * Get or set module defaults
         *
         * @param   namespace   {String}    named context in private space
         * @param   obj         {Object}    default values for module (optional)
         * @return              {Object}
         */
        app.defaults = function (namespace, obj) {
            return getContext(namespace, obj, defaults);
        };


        /**
         * Safe get value for specified property
         *
         * @param   obj     {Object}    source object
         * @param   name    {String}    property name with dot delimiter
         * @param   stub    {Object}    stub value for undefined property
         */
        app.getValue = function(obj, name, stub) {
            var i, parts = name.split(".");
            for (i = 0; i < parts.length; i += 1) {
                if (isObject(obj) && obj.hasOwnProperty(parts[i])) {
                    obj = obj[parts[i]];
                } else {
                    obj = stub;
                    break;
                }
            }
            return obj;
        }

    }());


    // dependency
    (function () {

        var storage = {};

        function collect(name) {
            var module = storage[name], sequence = [], i;

            if (name && module) {
                if (module.path && !module.skip) {
                    sequence.push(name);
                }
                if (module.requires.length > 0) {
                    for (i = module.requires.length - 1; i >= 0; i -= 1) {
                        UNSHIFT.apply(sequence, collect(module.requires[i]));
                    }
                }
            }

            return sequence;
        }

        function reduce(original, skip) {
            var obj, i, name, reduced = [], cache = {};

            for (i = 0; i < original.length; i += 1) {
                name = original[i];
                if (name && !cache[name]) {
                    cache[name] = true;
                    obj = storage[name];
                    // add an array of paths to the queue
                    PUSH.apply(reduced, makeArray(obj.path));
                    obj.skip = obj.skip || skip;
                }
            }

            return reduced;
        }


        /**
         * Register the new module in application
         *
         * @param module    {Object|Array}  description of one or several modules
         * @return          {Object}        module storage object
         */
        app.register = function (module) {
            var i, m;

            if (module) {
                for (module = makeArray(module), i = module.length - 1; i >= 0; i -= 1) {
                    m = module[i];
                    if (m.name) {
                        storage[m.name] = {
                            path: m.path || "",
                            requires: m.requires || [],
                            skip: m.skip || false
                        };
                    }
                }
            }

            return storage;
        };


        /**
         * Calculate the list of dependences for the specified module
         *
         * @param target    {String|Array}  one or several target units
         * @param keep      {Boolean}       don't mark used modules (optional)
         * @return          {Array}         list of path values for loading
         */
        app.calculate = function (target, keep) {
            var i, sequence = [];

            for (target = makeArray(target), i = 0; i < target.length; i += 1) {
                PUSH.apply(sequence, collect(target[i]));
            }

            return reduce(sequence, !keep);
        };


    }());


    // Modernizr.load wrapper
    (function () {

        var MODERNIZR = "Modernizr", YEPNOPE = "yepnope", attributes = {
            queue: [],
            bootstraped: false,
            loader: (window[MODERNIZR] && window[MODERNIZR].load) || window[YEPNOPE]
        };

        /**
         * Extract mock object from arguments
         */
        function getAttrs(needs, mock) {
            return mock ? mix(mock || {}, attributes) : attributes;
        }

        /**
         * Bootstrap resources
         * Optional second paramerts is a private external storage (for testing purposes only)
         * @param needs     {Object}    resource specs
         */
        app.bootstrap = function (needs) {
            var o = getAttrs.apply(this, arguments);
            UNSHIFT.apply(o.queue, makeArray(needs));
            if (o.loader) {
                o.loader.call(window, o.queue);
                o.queue = [];
                o.bootstraped = true;
            }
        };

        /**
         * Load resources
         * Optional second paramerts is a private external storage (for testing purposes only)
         * @param needs     {Object}    resource specs
         */
        app.load = function (needs) {
            var o = getAttrs.apply(this, arguments);
            if (isFunction(needs)) {
                needs = {
                    load: [],
                    complete: needs
                };
            }
            if (o.bootstraped && o.loader) {
                o.loader.call(window, needs);
            } else {
                Array.prototype.push.apply(o.queue, makeArray(needs));
            }
        };

    }());

}(this, "App"));