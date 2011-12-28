(function () {

    // регистрируем компоненты и их зависимости
    App.register([{
        name: "showroom",
        path: ["css/showroom.css", "js/showroom.js"],
        requires: ["jquery-imageload", "showroom-settings"]
    }, {
        name: "showroom-settings",
        path: "js/showroom-settings.js"
    }, {
        name: "jquery-imageload",
        path: "js/libs/jquery.imageload.js"
    }]);

    // ставим компонент шоурума в очередь на загрузку.
    // реальная загрузка начнется только после загрузки базовых скриптов
    App.load({
        load: App.calculate("showroom"),
        complete: function () {
            // инициализируем шоурум
            $(function () {
                // достаем теги картинок из специального хранилища
                var tags = App.defaults("App.Showroom", "tags", "");
                // рисуем галерею на странице
                var sr = App.Showroom.init(tags);
                // если есть плагин, отслеживающий загрузку картинок, то используем его
                if ($.ImageLoad) {
                    sr.on($.ImageLoad.imageready, function () {
                        App.Splash.hide();
                    });
                } else {
                    App.Splash.hide();
                }
            });
        }
    });

    // стартуем загрузку базовых скриптов, например, jQuery
    App.bootstrap({
        load: "http://code.jquery.com/jquery-1.7.1.min.js",
        complete: function () {
            // в этом месте уже можно декорировать страницу
            // например, добавим класс элементу html
            $("html").addClass("jquery");
            // покажем заставку
            App.Splash.ready();
        }
    });


    (function () {
        var timer, start= +new Date();

        App.namespace("App.Splash", {
            // можно показать заставку, если прошло слишком много времени с момента загрузки
            ready: function () {
                var now = +new Date(),
                    delta = 500 - (now - start);

                $('<div class="intro hidden">Loading&hellip;</div>').appendTo("body");

                timer = setTimeout(function () {
                    $("div.intro").removeClass("hidden");
                }, delta > 0 ? delta : 0);
            },
            // убрать заставку
            hide: function () {
                $("div.intro").remove();
                if (timer) {
                    clearTimeout(timer);
                }
            }
        });
    }());

}());