/**
 * @license Application skeleton
 * @version 1.1.3
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

    function isString(obj) {
        return TOSTRING.apply(obj) === "[object String]";
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

        /**
         * Safe get value for specified property
         *
         * @param {Object} obj source object
         * @param {String} name property name with dot delimiter
         * @param {Object} stub stub value for undefined property
         */
        function getValue(obj, name, stub) {
            var i, parts;

            if (!isVoid(name)) {
                parts = ("" + name).split(".");
                for (i = 0; i < parts.length; i += 1) {
                    if (isObject(obj) && obj.hasOwnProperty(parts[i])) {
                        obj = obj[parts[i]];
                    } else {
                        obj = stub;
                        break;
                    }
                }
            }

            return obj;
        }


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
         * @param {String} namespace named context in public space
         * @param {Object} [origin] initial object
         * @return {Object}
         */
        app.namespace = function (namespace, origin) {
            return getContext(namespace, origin, window[NS]);
        };


        /**
         * Get or set module defaults
         *
         * The behavior of the method is determined by the second argument. If it is an object, then the method
         * act like a setter and writes this object to the specified path. In this case the third argument doesn't matter.
         *
         * @param {String} namespace named context in private space
         * @param {Object|String} [obj] default values for module (optional, object) or sub-path (string)
         * @param {Object} [stub] optional stub for undefined sub-path's value
         * @return {Object}
         */
        app.defaults = function (namespace, obj, stub) {
            return isObject(obj) ?
                // setter
                getContext(namespace, obj, defaults) :
                // getter
                getValue(getContext(namespace, {}, defaults), obj, stub);
        };

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
         * Insert version string into path property of module
         * Use <strong>!</strong> prefix in path as unversioned resources
         *
         * @param {Object} module mutable description
         * @param {String} version
         * @return {Object}
         */
        function versionize(module, version) {
            var i;
            if (module.path) {
                if (isString(module.path)) {
                    module.path = [module.path];
                }
                for (i = module.path.length - 1; i >= 0; i--) {
                    module.path[i] = (function (path) {
                        return path.indexOf("!") === 0 ? path.substr(1) :
                            path.replace(/(\.\w+)$/, "." + version + "$1");
                    }(module.path[i]));
                }
            }
            return module;
        }

        /**
         * Register the new module in application
         *
         * @param {Object|Array} module description of one or several modules
         * @param {Function|String} [transform] last chance to modify module info before it will be added to registry
         * @return {Object} module storage object
         */
        app.register = function (module, transform) {
            var i, m, moduleObject;

            // use local path transform function
            if (isString(transform)) {
                transform = (function (version) {
                    return function (module) {
                        return versionize(module, version);
                    }
                }(transform));
            }

            if (module) {
                for (module = makeArray(module), i = module.length - 1; i >= 0; i -= 1) {
                    m = module[i];
                    if (m.name) {
                        moduleObject = {
                            path: m.path || "",
                            requires: m.requires || [],
                            skip: m.skip || false
                        };
                        storage[m.name] = isFunction(transform) ?
                            transform.call(moduleObject, moduleObject, m.name, i) || moduleObject : moduleObject;
                    }
                }
            }

            return storage;
        };


        /**
         * Calculate the list of dependencies for the specified module
         *
         * @param {String|Array} target one or several target units
         * @param {Boolean} [keep] don't mark used modules (optional)
         * @return {Array} list of path values for loading
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
         * Optional second parameters is a private external storage (for testing purposes only)
         * @param {Object} [needs] resource specs
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
         * Optional second parameters is a private external storage (for testing purposes only)
         * @param {Object} [needs] resource specs
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