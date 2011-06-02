module("app-dependency");

function resetSkip(storage) {
    var module;
    for (module in storage) {
        if (storage.hasOwnProperty(module)) {
            storage[module].skip = false;
        }
    }
}


test("dependecy list", function () {

    var D = App.Dependency;
    D._storage = {};

    D.add({
        name: "m1",
        path: "/scripts/m1.js",
        requires: []
    });

    D.add({
        name: "m2",
        path: "/scripts/m2.js",
        requires: []
    });

    D.add({
        name: "m3",
        path: "/scripts/m3.js",
        requires: ["m1"]
    });

    D.add({
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m2"]
    });

    deepEqual(D._storage, {
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

    deepEqual(D.calculate("m1"), [
        "/scripts/m1.js"
    ]);

    resetSkip(D._storage);

    deepEqual(D.calculate("m2"), [
        "/scripts/m2.js"
    ]);

    resetSkip(D._storage);

    deepEqual(D.calculate("m3"), [
        "/scripts/m1.js",
        "/scripts/m3.js"
    ]);

    resetSkip(D._storage);

    deepEqual(D.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m3.js",
        "/scripts/m2.js",
        "/scripts/m4.js"
    ]);

    resetSkip(D._storage);

    notDeepEqual(D.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);

});

test("dependecy duplicates", function () {

    var D = App.Dependency;
    D._storage = {};

    D.add([{
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

    deepEqual(D.calculate("m3"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js"
    ]);

    resetSkip(D._storage);

    deepEqual(D.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);

});

test("dependecy for collection", function () {

    var D = App.Dependency;
    D._storage = {};

    D.add([{
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

    deepEqual(D.calculate(["m2", "m3"]), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js"
    ]);

    resetSkip(D._storage);

    deepEqual(D.calculate(["m2", "m4"]), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);

    resetSkip(D._storage);

    deepEqual(D.calculate(["m4", "m2"]), [
        "/scripts/m3.js",
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m4.js"
    ]);

});

test("fake modules", function () {

    var D = App.Dependency;
    D._storage = {};

    D.add([{
        name: "m1"
    }, {
        name: "m2",
        path: "/scripts/m2.js",
        requires: ["m1"]
    }, {
        name: "m3",
        path: "/scripts/m3.js"
    }, {
        name: "m4",
        path: "",
        requires: ["m3", "m2"]
    }]);

    deepEqual(D.calculate(["m2", "m4"]), [
        "/scripts/m2.js",
        "/scripts/m3.js"
    ]);

    resetSkip(D._storage);

    deepEqual(D.calculate(["m4", "m2"]), [
        "/scripts/m3.js",
        "/scripts/m2.js"
    ]);

});

test("complex", function () {

    var D = App.Dependency;
    D._storage = {};

    D.add([{
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
    }, {
        name: "m5",
        path: "/scripts/m5.js",
        requires: ["m1"]
    }, {
        name: "m6",
        path: "/scripts/m6.js",
        requires: ["m3", "m5"]
    }]);

    D.calculate("m4");

    deepEqual(D.calculate("m5", true), [
        "/scripts/m5.js"
    ]);

    deepEqual(D.calculate("m6"), [
        "/scripts/m5.js",
        "/scripts/m6.js"
    ]);

    deepEqual(D.calculate("m5", true), []);

    deepEqual(D.calculate("m6", true), []);

});