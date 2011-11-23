(function () {

    // регистрируем компоненты и их зависимости
    App.register([{
        name: "showroom",
        path: "js/showroom.js",
        requires: ["showroom-css", "showroom-settings"]
    }, {
        name: "showroom-css",
        path: "css/showroom.css"
    }, {
        name: "showroom-settings",
        path: "js/showroom-settings.js"
    }]);

    // ставим компонент шоурума в очередь на загрузку.
    // реальная загрузка начнется только после загрузки базовых скриптов
    App.load({
        load: App.calculate("showroom"),
        complete: function () {
            // инициализируем шоурум
            $(function () {
                // достаем теги картинок из специального хранилища
                var tags = App.defaults("App.Showroom").tags || "";
                // рисуем галерею на странице
                App.Showroom.init(tags);
            });
        }
    });

    // стартуем загрузку базовых скриптов, например, jQuery
    App.bootstrap({
        load: [
            "http://code.jquery.com/jquery-1.7.1.min.js"
        ],
        complete: function () {
            // в этом месте уже можно декорировать страницу
            // например, добавим класс элементу html
            $("html").addClass("jquery");
        }
    });

}());