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
            App.Showroom.getPhotos(tags, root);

            return root;
        },

        getPhotos: function (tags, root) {
            var xhr = $.ajax({
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

            xhr.done(function (data) {
                // конструируем адрес картинки
                function createImageUrl(photo) {
                    return 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' +
                        photo.id + '_' + photo.secret + '.jpg';
                }

                // загружаем фотографию
                function createImage(url, title) {

                    var item = $('<li class="showroom-item"></li>'),
                        img = $('<img class="photo" alt="' + title + '" style="visibility: hidden;"/>');

                    img.bindImageLoad(function () {
                        // отслеживаем событие загрузки картинки
                        // это нужно сделать до того как загрузка завершится
                        $(this).css({"opacity": 0.01, "visibility": ""}).animate({"opacity": 1}, {
                            complete: function () {
                                $(this).css("opacity", "");
                            }
                        });
                        // оповещаем контейнер о том, что картинка загружена
                        root.trigger("loaded.showroom");
                    });

                    img.appendTo(item.appendTo(root)).attr("src", url);
                }

                var eles = [], i;

                if (data.stat === "ok") {
                    $.each(data.photos.photo, function (index) {
                        if (index >= 10) {
                            return false;
                        }
                        createImage(createImageUrl(this), this.title);
                    });
                }
            });
        }
    });

}());

/**
 * @see <a href="http://noteskeeper.ru/35/">Событие окончания загрузки картинки</a>
 */
(function ($) {
    $.fn.bindImageLoad = function (callback) {
        function isImageLoaded(img) {
            return img.complete && typeof img.naturalWidth === "undefined" || img.naturalWidth !== 0;
        }
        return this.each(function () {
            var ele = $(this);
            if (ele.is("img") && $.isFunction(callback)) {
                ele.one("load", callback);
                if (isImageLoaded(this)) {
                    ele.trigger("load");
                }
            }
        });
    };
})(jQuery);
