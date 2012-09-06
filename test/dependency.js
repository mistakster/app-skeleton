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


function extend(receiver, sender) {
    for (var prop in sender) {
        if (sender.hasOwnProperty(prop)) {
            receiver[prop] = sender[prop];
        }
    }
    return receiver;
}


test("register modules", function () {

    wipe();

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

test("dependency list 1", function () {

    beforeTest();

    deepEqual(App.calculate("m1"), [
        "/scripts/m1.js"
    ]);
});

test("dependency list 2", function () {

    beforeTest();

    deepEqual(App.calculate("m2"), [
        "/scripts/m2.js"
    ]);
});

test("dependency list 3", function () {

    beforeTest();

    deepEqual(App.calculate("m3"), [
        "/scripts/m1.js",
        "/scripts/m3.js"
    ]);
});

test("dependency list 4", function () {

    beforeTest();

    deepEqual(App.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m3.js",
        "/scripts/m2.js",
        "/scripts/m4.js"
    ]);
});

test("dependency list 5", function () {

    beforeTest();

    notDeepEqual(App.calculate("m4"), [
        "/scripts/m1.js",
        "/scripts/m2.js",
        "/scripts/m3.js",
        "/scripts/m4.js"
    ]);
});

test("dependency duplicates 1", function () {

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

test("dependency duplicates 2", function () {

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

test("dependency for collection 1", function () {

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

test("dependency for collection 2", function () {

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

test("dependency for collection 3", function () {

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


test("dependency with transform callback (pass-through mode)", function () {

    wipe();

    var transforms = [];

    App.register([{
        name: "m1",
        path: "/scripts/m1.js",
        requires: [],
        skip: true
    }, {
        name: "m2",
        path: "/scripts/m2.js",
        requires: []
    }, {
        name: "m3",
        requires: ["m1"]
    }, {
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m2"]
    }], function (module, name, index) {
        // transform callback
        equal(this, module);
        transforms.push([module, name, index]);
    });

    var expected = {
        "m4": {
            path: "/scripts/m4.js",
            requires: ["m3", "m2"],
            skip: false
        },
        "m3": {
            path: "",
            requires: ["m1"],
            skip: false
        },
        "m2": {
            path: "/scripts/m2.js",
            requires: [],
            skip: false
        },
        "m1": {
            path: "/scripts/m1.js",
            requires: [],
            skip: true
        }
    };

    deepEqual(transforms, [
        [expected["m4"], "m4", 3],
        [expected["m3"], "m3", 2],
        [expected["m2"], "m2", 1],
        [expected["m1"], "m1", 0]
    ]);

    deepEqual(App.register(), expected);

});

test("dependency with transform callback (transform mode)", function () {

    wipe();

    var transforms = [];

    App.register([{
        name: "m1",
        path: "/scripts/m1.js",
        requires: [],
        skip: true
    }, {
        name: "m2",
        path: "/scripts/m2.js",
        requires: [],
        skip: false
    }, {
        name: "m3",
        requires: ["m1"]
    }, {
        name: "m4",
        path: "/scripts/m4.js",
        requires: ["m3", "m2"]
    }], function (module, name, index) {
        equal(this, module);

        var m = extend(extend({"_": true}, module), {path: "/static/js/" + name + ".js?" + index});

        transforms.push([m, name, index]);

        return m;
    });

    var expected = {
        "m4": {
            _: true,
            path: "/static/js/m4.js?3",
            requires: ["m3", "m2"],
            skip: false
        },
        "m3": {
            _: true,
            path: "/static/js/m3.js?2",
            requires: ["m1"],
            skip: false
        },
        "m2": {
            _: true,
            path: "/static/js/m2.js?1",
            requires: [],
            skip: false
        },
        "m1": {
            _: true,
            path: "/static/js/m1.js?0",
            requires: [],
            skip: true
        }
    };

    deepEqual(transforms, [
        [expected["m4"], "m4", 3],
        [expected["m3"], "m3", 2],
        [expected["m2"], "m2", 1],
        [expected["m1"], "m1", 0]
    ]);

    deepEqual(App.register(), expected);

});


test("versionize one path", function () {

    wipe();

    App.register({
        name: "m",
        path: "/scripts/m.js",
        requires: []
    }, "version");

    deepEqual(App.register(), {
        "m": {
            "path": [
                "/scripts/m.version.js"
            ],
            "requires": [],
            "skip": false
        }
    });

});

test("versionize paths", function () {

    wipe();

    App.register([{
        name: "m",
        path: ["/scripts/m.js", "/css/m.css"],
        requires: []
    }, {
        name: "external",
        path: ["!http://example.com/stuff.js", "!http://example.com/stuff.css"]
    }], "version");

    var registred = App.register();

    deepEqual(registred.m, {
        path: [
            "/scripts/m.version.js",
            "/css/m.version.css"
        ],
        requires: [],
        skip: false
    });

    deepEqual(registred.external, {
        path: [
            "http://example.com/stuff.js",
            "http://example.com/stuff.css"
        ],
        requires: [],
        skip: false
    });

});