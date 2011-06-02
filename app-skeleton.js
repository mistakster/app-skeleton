(function (window, undefined) {

    var NS = "App",
        app = window[NS] = window[NS] || {},
        defaults = {};

    function mix(receiver, sender) {
        var prop;

        function isNull(value) {
            return value === undefined || value === null;
        }

        for (prop in sender) {
            if (!isNull(sender[prop]) && isNull(receiver[prop])) {
                receiver[prop] = sender[prop];
            }
        }

        return receiver;
    }

    function namespace(ns, origin, root) {
        var i, obj = root || window[NS], part;

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
     * @param   ns          {String}
     * @param   origin      {Object}    initial object (optional)
     * @return              {Object}
     */
    app.namespace = function (ns, origin) {
        return namespace(ns, origin);
    };


    /**
     * Get or set module defaults
     *
     * @param   ns          {String}
     * @param   obj         {Object}    default values for module (optional)
     * @return              {Object}
     */
    app.defaults = function (ns, obj) {
        return namespace(ns, obj, defaults);
    };

}(window));