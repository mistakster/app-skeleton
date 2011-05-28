(function () {

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

        L = App.namespace("App.Lang", {
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
        });

    return L;

}());