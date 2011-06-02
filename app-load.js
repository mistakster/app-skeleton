/**
 * Modernizr.load wrapper
 */
(function () {

    var loadQueue = [],
        bootstraped = false,
        _loader = (function (L) {
            return L && L.load;
        }(window['Modernizr'] || window['yepnope']));

    function isArray(obj) {
        return Object.prototype.toString.apply(obj) === "[object Array]";
    }

    function makeArray(obj) {
        return isArray(obj) ? obj : [obj];
    }

    App.bootstrap = function (needs, loader) {
        Array.prototype.unshift.apply(loadQueue, makeArray(needs));
        loader = loader || _loader;
        if (loader) {
            loader(loadQueue);
            loadQueue = [];
            bootstraped = true;
        }
    };

    App.load = function (needs, loader) {
        loader = loader || _loader;
        if (bootstraped && loader) {
            loader(needs);
        } else {
            Array.prototype.push.apply(loadQueue, makeArray(needs));
        }
    };

}());
