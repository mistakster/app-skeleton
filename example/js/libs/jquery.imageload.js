/**
 * Специальное событие о полной загрузке картинки
 *
 * @author Владимир Кузнецов
 * @see <a href="http://noteskeeper.ru/35/">Событие окончания загрузки картинки</a>
 */
(function ($) {

    var NS = ".imageload";

    function isImageLoaded(img) {
        // Во время события load IE и другие браузеры правильно определяют состояние картинки через атрибут complete.
        // Исключение составляют Gecko-based браузеры. Тем не менее, у них есть два очень полезных свойства:
        // naturalWidth и naturalHeight. Они дают истинный размер изображения. Если какртинка еще не загрузилась,
        // то они должны быть равны нулю.
        return img.complete && typeof img.naturalWidth === "undefined" || img.naturalWidth !== 0;
    }

    function handler() {
        var ele = $(this);
        if (ele.is("img") && !ele.data("init" + NS)) {
            ele.one("load" + NS, function () {
                $(this).trigger(ImageLoad.imageready);
            });
            if (isImageLoaded(this)) {
                ele.trigger("load" + NS);
            }
            ele.data("init" + NS, true);
        }
    }

    var ImageLoad = function (ele) {
        return $(ele).each(handler);
    };

    ImageLoad.imageready = "imageready" + NS;

    // Публикуем статический интерфейс
    $.ImageLoad = ImageLoad;
    // Публикуем интерфейс экземпляра
    $.fn.imageload = function () {
        return ImageLoad(this);
    };

}(jQuery));
