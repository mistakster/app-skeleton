(function () {

    /**
     * Описание модуля
     *      name: имя
     *      path: путь до загружаемого файла
     *      requires: список модулей, которые должны быть загружены до него
     */

    var D = {
        /**
         * Список зарегистрированных модулей
         */
        _dependencies: {},

        /**
         * Добавляем список зависимостей модуля в приложение
         * @param module
         */
        add: function (module) {
            if (module && module.name) {
                D._dependencies[module.name] = {
                    path: module.path || "",
                    requires: module.requires || []
                };
            }
        },

        _collect: function (name) {
            var UNSHIFT = Array.prototype.unshift,
                module = D._dependencies[name],
                sequence = [],
                i;

            if (module) {
                sequence.push(module.path);
                if (module.requires.length > 0) {
                    for (i = module.requires.length; i--;) {
                        UNSHIFT.apply(sequence, D._collect(module.requires[i]));
                    }
                }
            }

            return sequence;
        },

        _reduce: function (original) {
            var reduced = [],
                cache = {},
                i,
                path;

            for (i = 0; i < original.length; i++) {
                path = original[i];
                if (!cache[path]) {
                    cache[path] = true;
                    reduced.push(path);
                }
            }

            return reduced;
        },

        /**
         * Вычисляем список зависимостей для указанных модулей
         * @param target    {String|Array}
         * @return          {Array}
         */
        calculate: function (target) {

            var sequence, i;

            if (target && Object.prototype.toString.call(target) === "[object Array]") {
                sequence = [];
                for (i = 0; i < target.length; i++) {
                    Array.prototype.push.apply(sequence, D._collect(target[i]));
                }
            } else {
                sequence = D._collect(target);
            }

            return D._reduce(sequence);
        }
    };

    APP.namespace("Dependency", D);

}());