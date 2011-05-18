(function (window, undefined) {

    /**
     * Описание модуля
     *      name: имя
     *      path: путь до загружаемого файла
     *      requires: список модулей, которые должны быть загружены до него
     */

    var dependencies = {};

    APP.namespace("Dependency", {
        /**
         * Добавляем список зависимостей модуля в приложение
         * @param module
         */
        add: function (module) {
            if (module && module.name) {
                dependencies[module.name] = {
                    path: module.path || "",
                    requires: module.requires || []
                };
            }
        },

        /**
         * Вычисляем список зависимостей для указанных модулей
         * @param target    {String|Array}
         * @return          {Array}
         */
        calculate: function (target) {

            var UNSHIFT = Array.prototype.unshift,
                sequence;

            function collect(name) {

                var module = dependencies[name], sequence = [], i;

                if (module) {
                    sequence.push(module.path);
                    if (module.requires.length > 0) {
                        for (i = module.requires.length; i--;) {
                            UNSHIFT.apply(sequence, collect(module.requires[i]));
                        }
                    }
                }

                return sequence;
            }

            function reduce(original) {
                var reduced = [], cache = {}, i, path;

                for (i = 0; i < original.length; i++) {
                    path = original[i];
                    if (!cache[path]) {
                        cache[path] = true;
                        reduced.push(path);
                    }
                }

                return reduced;
            }

            sequence = collect(target);
            sequence = reduce(sequence);

            return sequence;
        },

        /**
         * Получить полный список зависимостей
         */
        getDependencies: function () {
            return dependencies;
        }
    });

}(window));