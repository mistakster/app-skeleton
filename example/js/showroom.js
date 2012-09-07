/**
 * компонент галереи, который загружает с Flikr несколько фотографий
 * с указанными тегами
 */
(function () {

    // создаем объект галереи
    // такой компонент должен иметь специальный метод инициализации,
    // чтобы он был вызван в правильное время и в правильном окружении
    App.namespace("App.Showroom", {

        init: function (tags) {
            // корневой элемент
            var root = $('<ul class="showroom"></ul>').appendTo("body");
            // загрузка фотографий
            var xhr = App.Showroom.getPhotos(tags);
            xhr.done(function (data) {
                App.Showroom.renderPhotos(root, data);
            });

            return root;
        },

        getPhotos: function (tags) {
            return $.ajax({
                url: "http://api.flickr.com/services/rest/?jsoncallback=?",
                data: {
                    // ключ приложения так же хранится отдельно от кода
                    api_key: App.defaults("App.Showroom", "flickrKey"),
                    content_type: 1,
                    format: "json",
                    method: "flickr.photos.search",
                    tags: tags
                },
                dataType: "json",
                type: "jsonp"
            });
        },

        renderPhotos: function (root, data) {
            var eles = [], i;
            if (data.stat === "ok") {
                $.each(data.photos.photo, function (index) {
                    if (index >= 10) {
                        return false;
                    }
                    createImage(root, createImageUrl(this), this.title);
                });
            }
        }
    });

    // конструируем адрес картинки
    function createImageUrl(photo) {
        return 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
    }

    // загружаем фотографию
    function createImage(root, url, title) {
        var item = $('<li class="showroom-item"></li>'),
            img = $('<img class="photo" alt="' + title + '"/>');

        if ($.ImageLoad) {
            img.on($.ImageLoad.imageready, function () {
                // отслеживаем событие загрузки картинки. это нужно сделать до того как загрузка завершится
                $(this).css({"opacity": 0.01, "visibility": ""})
                    .animate({"opacity": 1}, function () {
                        $(this).css("opacity", "");
                    });
            }).imageload().css("visibility", "hidden");
        }

        img.appendTo(item.appendTo(root)).attr("src", url);
    }

}());
