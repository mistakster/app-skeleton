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

    function isObject(obj) {
        return obj && Object.prototype.toString.call(obj) === "[object Object]";
    }

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
            obj = obj[ns[i]] = i === ns.length - 1 && isObject(origin) ?
                    extend(origin, part) : part;
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