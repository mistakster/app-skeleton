(function () {

    /**
     * Описание модуля
     *      name: имя
     *      path: путь до загружаемого файла
     *      requires: список модулей, которые должны быть загружены до него
     *      skip: уже загружен или не требует загрузки
     */

    function isArray(obj) {
        return Object.prototype.toString.apply(obj) === "[object Array]";
    }

    App.namespace("App.Dependency", {
        /**
         * Список зарегистрированных модулей
         */
        _storage: {},

        /**
         * Добавляем список зависимостей модуля в приложение
         * @param module    {Object|Array}
         */
        add: function (module) {

            var D = this, i;

            function register(m) {
                if (m && m.name) {
                    D._storage[m.name] = {
                        path: m.path || "",
                        requires: m.requires || [],
                        skip: m.skip || false
                    };
                }
            }

            if (isArray(module)) {
                for (i = module.length; i--;) {
                    register(module[i]);
                }
            } else {
                register(module);
            }
        },

        _collect: function (name) {
            var D = this,
                UNSHIFT = Array.prototype.unshift,
                module = D._storage[name],
                sequence = [],
                i;

            if (name && module) {
                if (module.path && !module.skip) {
                    sequence.push(name);
                }
                if (module.requires.length > 0) {
                    for (i = module.requires.length; i--;) {
                        UNSHIFT.apply(sequence, D._collect(module.requires[i]));
                    }
                }
            }

            return sequence;
        },

        _reduce: function (original, skip) {
            var obj, i, name, reduced = [], cache = {}, D = this;

            for (i = 0; i < original.length; i++) {
                name = original[i];
                if (name && !cache[name]) {
                    obj = D._storage[name];
                    cache[name] = reduced.push(obj.path);
                    obj.skip = obj.skip || skip;
                }
            }

            return reduced;
        },

        /**
         * Вычисляем список зависимостей для указанных модулей
         * @param target    {String|Array}  один или несколько целевых модулей
         * @param keep      {Boolean}       не отмечам использованные модули
         * @return          {Array}         список адресов для загрузки
         */
        calculate: function (target, keep) {
            var i, sequence, PUSH = Array.prototype.push, D = this;

            if (isArray(target)) {
                sequence = [];
                for (i = 0; i < target.length; i++) {
                    PUSH.apply(sequence, D._collect(target[i]));
                }
            } else {
                sequence = D._collect(target);
            }

            return D._reduce(sequence, !keep);
        }
    });

}());
