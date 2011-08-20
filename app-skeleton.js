(function (window, undefined) {

    var NS = "App",
        app = window[NS] = window[NS] || {};


    function isVoid(obj) {
        return obj === undefined || obj === null;
    }

    function isFunction(obj) {
        return Object.prototype.toString.apply(obj) === "[object Function]";
    }

    function isArray(obj) {
        return Object.prototype.toString.apply(obj) === "[object Array]";
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
            var i, part, obj = root || window[NS];

            if (ns) {
                ns = ns.split(".");
                for (i = (ns[0] === NS) ? 1 : 0; i < ns.length; i++) {
                    part = obj[ns[i]] || {};
                    obj = obj[ns[i]] = i === ns.length - 1 && origin ? mix(origin, part) : part;
                }
            }

            return obj;
        }

        /**
         * Get or create namespace for module
         *
         * @param   namespace   {String}    named context in public space
         * @param   origin      {Object}    initial object (optional)
         * @return              {Object}
         */
        app.namespace = function (namespace, origin) {
            return getContext(namespace, origin);
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

    }());


    // dependency
    (function () {

        var storage = {};

        function collect(name) {
            var UNSHIFT = Array.prototype.unshift,
                module = storage[name],
                sequence = [], i;

            if (name && module) {
                if (module.path && !module.skip) {
                    sequence.push(name);
                }
                if (module.requires.length > 0) {
                    for (i = module.requires.length; i--;) {
                        UNSHIFT.apply(sequence, collect(module.requires[i]));
                    }
                }
            }

            return sequence;
        }

        function reduce(original, skip) {
            var obj, i, name, reduced = [], cache = {};

            for (i = 0; i < original.length; i++) {
                name = original[i];
                if (name && !cache[name]) {
                    obj = storage[name];
                    cache[name] = reduced.push(obj.path);
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
                for (module = makeArray(module), i = module.length; i--;) {
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
            var i, sequence = [], PUSH = Array.prototype.push;

            for (target = makeArray(target), i = 0; i < target.length; i++) {
                PUSH.apply(sequence, collect(target[i]));
            }

            return reduce(sequence, !keep);
        };


    }());


    // Modernizr.load wrapper
    (function () {

        var attributes = {
            queue: [],
            bootstraped: false,
            loader: (function (L) {
                    return L && L.load;
                }(window['Modernizr'] || window['yepnope']))
        };

        function getAttrs(mock) {
            return mock ? mix(mock || {}, attributes) : attributes;
        }

        /**
         * Bootstrap resources
         * @param needs     {Object}    resource specs
         * @param mock      {Object}    private external storage (optional, for testing only)
         */
        app.bootstrap = function (needs, mock) {
            var o = getAttrs(mock);
            Array.prototype.unshift.apply(o.queue, makeArray(needs));
            if (o.loader) {
                o.loader(o.queue);
                o.queue = [];
                o.bootstraped = true;
            }
        };

        /**
         * Load resources
         * @param needs     {Object}    resource specs
         * @param mock      {Object}    private external storage (optional, for testing only)
         */
        app.load = function (needs, mock) {
            var o = getAttrs(mock);
            if (isFunction(needs)) {
                needs = {
                    load: [],
                    complete: needs
                }
            }
            if (o.bootstraped && o.loader) {
                o.loader(needs);
            } else {
                Array.prototype.push.apply(o.queue, makeArray(needs));
            }
        };

    }());

}(window));