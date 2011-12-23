module("app-dependency");

function wipe() {
    var storage = App.register();

    for (var i in storage) {
        if (storage.hasOwnProperty(i)) {
            delete storage[i];
        }
    }
}

function beforeTest() {

    wipe();

    App.register([{
        name: "m1",
        path: "/scripts/m1.js",
        requires: []
    }, {
        name: "m2",
        path: "/scripts/m2.js",
        requires: []
    }, {
        name: "m3",
        path: "/scripts/m3.js",
        requires: ["m1"]
    }, {
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m2"]
    }]);
}



test("register modules", function () {

    App.register({
        name: "m1",
        path: "/scripts/m1.js",
        requires: []
    });

    App.register({
        name: "m2",
        path: "/scripts/m2.js",
        requires: []
    });

    var storage = App.register([{
        name: "m3",
        path: "/scripts/m3.js",
        requires: ["m1"]
    }, {
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m2"]
    }]);

    deepEqual(storage, {
        "m1": {
            "path": "/scripts/m1.js",
            "requires": [],
            "skip": false
        },
        "m2": {
            "path": "/scripts/m2.js",
            "requires": [],
            "skip": false
        },
        "m3": {
            "path": "/scripts/m3.js",
            "requires": ["m1"],
            "skip": false
        },
        "m4": {
            "path": "/scripts/m4.js",
            "requires": ["m3", "m2"],
            "skip": false
        }
    });
});

test("dependecy list 1", function () {

    beforeTest();

    deepEqual(App.calculate("m1"), [
        "/scripts/m1.js"
    ]);
});

test("dependecy list 2", function () {

    beforeTest();

    deepEqual(App.calculate("m2"), [
        "/scripts/m2.js"
    ]);
});

test("dependecy list 3", function () {

    beforeTest();

    deepEqual(App.calculate("m3"), [
        "/scripts/m1.js",
        "/scripts/m3.js"
    ]);
});

test("dependecy list 4", function () {

    beforeTest();

    deepEqual(App.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m3.js",
        "/scripts/m2.js",
        "/scripts/m4.js"
    ]);
});

test("dependecy list 5", function () {

    beforeTest();

    notDeepEqual(App.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);
});

test("dependecy duplicates 1", function () {

    wipe();

    App.register([{
        name: "m1",
        path: "/scripts/m1.js"
    }, {
        name: "m2",
        path: "/scripts/m2.js",
        requires: ["m1"]
    }, {
        name: "m3",
        path: "/scripts/m3.js",
        requires: ["m2", "m1"]
    }, {
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m1", "m2"]
    }]);

    deepEqual(App.calculate("m3"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js"
    ]);

});

test("dependecy duplicates 2", function () {

    wipe();

    App.register([{
        name: "m1",
        path: "/scripts/m1.js"
    }, {
        name: "m2",
        path: "/scripts/m2.js",
        requires: ["m1"]
    }, {
        name: "m3",
        path: "/scripts/m3.js",
        requires: ["m2", "m1"]
    }, {
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m1", "m2"]
    }]);

    deepEqual(App.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);
});

test("dependecy for collection 1", function () {

    wipe();

    App.register([{
        name: "m1",
        path: "/scripts/m1.js"
    }, {
        name: "m2",
        path: "/scripts/m2.js",
        requires: ["m1"]
    }, {
        name: "m3",
        path: "/scripts/m3.js"
    }, {
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m2"]
    }]);

    deepEqual(App.calculate(["m2", "m3"]), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js"
    ]);
});

test("dependecy for collection 2", function () {

    wipe();

    App.register([{
        name: "m1",
        path: "/scripts/m1.js"
    }, {
        name: "m2",
        path: "/scripts/m2.js",
        requires: ["m1"]
    }, {
        name: "m3",
        path: "/scripts/m3.js"
    }, {
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m2"]
    }]);

    deepEqual(App.calculate(["m2", "m4"]), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);
});

test("dependecy for collection 3", function () {

    wipe();

    App.register([{
        name: "m1",
        path: "/scripts/m1.js"
    }, {
        name: "m2",
        path: "/scripts/m2.js",
        requires: ["m1"]
    }, {
        name: "m3",
        path: "/scripts/m3.js"
    }, {
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m2"]
    }]);

    deepEqual(App.calculate(["m4", "m2"]), [
        "/scripts/m3.js",
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m4.js"
    ]);
});

test("fake modules 1", function () {

    beforeTest();
    // replace m1 and m4
    App.register([{
        name: "m1"
    }, {
        name: "m4",
        path: "",
        requires: ["m3", "m2"]
    }]);

    deepEqual(App.calculate(["m2", "m4"]), [
        "/scripts/m2.js",
        "/scripts/m3.js"
    ]);
});

test("fake modules 2", function () {

    beforeTest();
    // replace m1 and m4
    App.register([{
        name: "m1"
    }, {
        name: "m4",
        path: "",
        requires: ["m3", "m2"]
    }]);

    deepEqual(App.calculate(["m4", "m2"]), [
        "/scripts/m3.js",
        "/scripts/m2.js"
    ]);
});

test("complex", function () {

    beforeTest();

    App.register([{
        name: "m5",
        path: "/scripts/m5.js",
        requires: ["m1"]
    }, {
        name: "m6",
        path: "/scripts/m6.js",
        requires: ["m3", "m5"]
    }]);

    App.calculate("m4");

    deepEqual(App.calculate("m5", true), [
        "/scripts/m5.js"
    ]);

    deepEqual(App.calculate("m6"), [
        "/scripts/m5.js",
        "/scripts/m6.js"
    ]);

    deepEqual(App.calculate("m5", true), []);

    deepEqual(App.calculate("m6", true), []);

});

test("many paths", function () {

    beforeTest();

    App.register([{
        name: "m5",
        path: ["/css/m5.css", "/scripts/m5a.js", "/scripts/m5b.js"],
        requires: ["m1"]
    }, {
        name: "m6",
        path: "/scripts/m6.js",
        requires: ["m3", "m5"]
    }]);

    deepEqual(App.calculate("m5", true), [
        "/scripts/m1.js",
        "/css/m5.css",
        "/scripts/m5a.js",
        "/scripts/m5b.js"
    ]);

    deepEqual(App.calculate("m6"), [
        "/scripts/m1.js",
        "/scripts/m3.js",
        "/css/m5.css",
        "/scripts/m5a.js",
        "/scripts/m5b.js",
        "/scripts/m6.js"
    ]);

});