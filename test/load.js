module("app-load");

function getMock() {

    function makeArray(obj) {
        return Object.prototype.toString.apply(obj) === "[object Array]" ? obj : [obj];
    }

    var storage = [];

    return {
        queue: [],
        bootstraped: false,
        loader: function (needs) {
            var needsArray = makeArray(needs),
                loadArray, i, j;

            for (i = 0; i < needsArray.length; i++) {
                if (needsArray[i].load) {
                    loadArray = makeArray(needsArray[i].load);
                    for (j = 0; j < loadArray.length; j++) {
                        storage.push(loadArray[j]);
                    }
                }
                if (needsArray[i].complete) {
                    needsArray[i].complete.call(storage);
                }
            }
        }
    };
}



test("load", function () {

    var mock = getMock();

    expect(4);

    App.load({
        load: ["file3"],
        complete: function () {
            deepEqual(this,
                ["file1", "file2", "file3"]);
        }
    }, mock);

    App.load({
        load: ["file4"],
        complete: function () {
            deepEqual(this,
                ["file1", "file2", "file3", "file4"]);
        }
    }, mock);

    App.bootstrap({
        load: ["file1", "file2"],
        complete: function () {
            deepEqual(this,
                ["file1", "file2"]);
        }
    }, mock);

    App.load({
        load: ["file5"],
        complete: function () {
            deepEqual(this,
                ["file1", "file2", "file3", "file4", "file5"]);
        }
    }, mock);

});

test("load complex", function () {

    var mock = getMock();

    expect(5);

    App.load([{
        load: "file3",
        complete: function () {
            deepEqual(this,
                ["file1", "file2", "file3"]);
        }
    }, {
        load: "file4",
        complete: function () {
            deepEqual(this,
                ["file1", "file2", "file3", "file4"]);
        }
    }], mock);

    App.bootstrap([{
        load: "file1",
        complete: function () {
            deepEqual(this,
                ["file1"]);
        }
    }, {
        load: "file2",
        complete: function () {
            deepEqual(this,
                ["file1", "file2"]);
        }
    }], mock);

    App.load(function () {
        deepEqual(this,
            ["file1", "file2", "file3", "file4"]);
    }, mock);

});
