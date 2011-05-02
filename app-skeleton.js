(function (window, undefined) {

    var NS = "APP",
        app = window[NS] = window[NS] || {};


    function create(origin) {
        var F = function () {};
        F.prototype = origin;
        return new F();
    }

    function extend(receiver, sender) {
        for (var prop in sender) {
            receiver[prop] = sender[prop];
        }
        return receiver;
    }


    /**
     * Get or create namespace for module
     *
     * @param   ns          {String}    namespace
     * @param   origin      {Object}    initial object (optional)
     * @return              {Object}
     */
    app.namespace = function (ns, origin) {
        var i, obj = window[NS];

        ns = ns.split(".");

        for (i = (ns[0] === NS) ? 1 : 0; i < ns.length; i++) {
            obj = obj[ns[i]] = (function (part, isLast) {
                if (isLast && Object.prototype.toString.call(origin) === "[object Object]") {
                    part = create(extend(origin, part));
                }
                return part;
            }(obj[ns[i]] || {}, i === ns.length - 1));
        }

        return obj;
    };

}(window));