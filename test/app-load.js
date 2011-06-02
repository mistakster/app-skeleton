module("app-load");

test("load", function () {

    // mock
    window['Modernizr'] = {
        load: function (needs) {
            deepEqual(needs.load, ["file1", "file2"]);
            needs.complete.call(this);
        }
    };

    App.bootstrap({
        load: ["file1", "file2"],
        complete: function () {

        }
    });





});