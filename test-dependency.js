module("app-dependency");

test("dependecy list", function () {

    var D = APP.Dependency;

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

    deepEqual(D._dependencies, {
        "m1": {
            "path": "/scripts/m1.js",
            "requires": []
        },
        "m2": {
            "path": "/scripts/m2.js",
            "requires": []
        },
        "m3": {
            "path": "/scripts/m3.js",
            "requires": ["m1"]
        },
        "m4": {
            "path": "/scripts/m4.js",
            "requires": ["m3", "m2"]
        }
    });

    deepEqual(D.calculate("m1"), [
        "/scripts/m1.js"
    ]);

    deepEqual(D.calculate("m2"), [
        "/scripts/m2.js"
    ]);

    deepEqual(D.calculate("m3"), [
        "/scripts/m1.js",
        "/scripts/m3.js"
    ]);

    deepEqual(D.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m3.js",
        "/scripts/m2.js",
        "/scripts/m4.js"
    ]);

    notDeepEqual(D.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);

});

test("dependecy duplicates", function () {

    var D = APP.Dependency;

    D.add({
        name: "m1",
        path: "/scripts/m1.js",
        requires: []
    });

    D.add({
        name: "m2",
        path: "/scripts/m2.js",
        requires: ["m1"]
    });

    D.add({
        name: "m3",
        path: "/scripts/m3.js",
        requires: ["m2", "m1"]
    });

    D.add({
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m1", "m2"]
    });

    deepEqual(D.calculate("m3"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
    ]);

    deepEqual(D.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);

});

test("dependecy for collection", function () {

    var D = APP.Dependency;

    D.add({
        name: "m1",
        path: "/scripts/m1.js",
        requires: []
    });

    D.add({
        name: "m2",
        path: "/scripts/m2.js",
        requires: ["m1"]
    });

    D.add({
        name: "m3",
        path: "/scripts/m3.js",
        requires: []
    });

    D.add({
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m2"]
    });

    deepEqual(D.calculate(["m2", "m3"]), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js"
    ]);

    deepEqual(D.calculate(["m2", "m4"]), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);

    deepEqual(D.calculate(["m4", "m2"]), [
        "/scripts/m3.js",
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m4.js"
    ]);

});