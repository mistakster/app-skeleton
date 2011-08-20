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

            $('<ul class="showroom"></ul>').appendTo("body");

            App.Showroom.getPhotos(tags);
        },

        getPhotos: function (tags) {
            var xhr = $.ajax({
                url: "http://api.flickr.com/services/rest/?jsoncallback=?",
                data: {
                    // ключ приложения так же хранится отдельно от кода
                    api_key: App.defaults("App.Showroom").flickrKey,
                    content_type: 1,
                    format: "json",
                    method: "flickr.photos.search",
                    tags: tags
                },
                dataType: "json",
                type: "jsonp"
            });

            xhr.success(function (data) {

                // конструируем адрес картинки
                function createImageUrl(photo) {
                    return 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' +
                        photo.id + '_' + photo.secret + '.jpg';
                }

                var eles = [], i;

                if (data.stat === "ok") {
                    $.each(data.photos.photo, function (index) {
                        if (index < 10) {
                            eles.push('<li class="showroom-item">',
                                    '<img class="photo" src="' + createImageUrl(this) + '" alt="' + this.title + '"/>',
                                '</li>');
                        } else {
                            return false;
                        }
                    });
                }

                $("ul.showroom").append(eles.join(''));
            });
        }
    });

}());
