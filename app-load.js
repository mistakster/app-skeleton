/**
 * Modernizr.load wrapper
 */
(function () {

    var COMPLETE_HANDLER = "complete",
        resources = [],
        bootstraped = false;

    function iterate() {
        var needs;
        if (resources.length > 0) {
            needs = resources.shift();
            after(needs, COMPLETE_HANDLER, iterate);
        }
    }

    function after(obj, method, advice) {
        var pointcut = obj[method];
        obj[method] = function () {
            if (pointcut) {
                pointcut.apply(this, arguments);
            }
            advice.apply(this);
        };
    }

    App.bootstrap = function (needs) {
        after(needs, COMPLETE_HANDLER, iterate);
        Modernizr.load(needs);
        bootstraped = true;
    };

    App.load = function (needs) {
        if (bootstraped) {

        } else {
            resources.push(needs);
        }
    };

}());
