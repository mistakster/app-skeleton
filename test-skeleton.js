module("app-skeleton");

test("namespace basic", function () {

    expect(7);

    var ns = APP.namespace;

    ok(ns("APP.Module1"), "create module 1");
    ok(APP.Module1, "check module 1");

    ok(ns("Module2"), "create module 2");
    ok(APP.Module2, "check module 2");

    APP.Module1.field1 = "field 1";
    APP.Module1.method1 = function (a, b) {
        return a + b;
    };

    equal(ns("APP.Module1"), APP.Module1, "get module 1");

    ok(ns("APP.Module1.SubModule"), "sub module");

    raises(ns("APP.Module1.field1.wrongUse"));

});

test("namespace extend", function () {

    expect(5);

    var ns = APP.namespace;

    var o = {
        field1: "field 1",
        method1: function (a, b) {
            return a + b;
        },
        getContext: function () {
            return this;
        }
    };

    var subModule = ns("APP.Module3.SubModule", o);

    ok(APP.Module3.SubModule.field1);
    ok(APP.Module3.SubModule.method1);

    equals(APP.Module3.SubModule.getContext(), subModule, "right context");

    ns("APP.Module3.SubModule", {
        field2: "field 2"
    });

    equals(APP.Module3.SubModule.field1, "field 1");
    equals(APP.Module3.SubModule.field2, "field 2");

});

test("partial extend", function () {

    expect(3);

    var ns = APP.namespace;

    var o = {
        a: "test",
        b: null,
        c: false,
        d: 0,
        e: "",
        f: (function (undef) { return undef; })()
    };

    ns("APP.Module4", o);

    equals(APP.Module4, o);

    ns("APP.Module4", {
        field1: "data"
    });

    deepEqual(APP.Module4, {
        field1: "data",
        a: "test",
        c: false,
        d: 0,
        e: ""
    });

    ns("APP.Module4", {
        field1: "value1",
        field2: "value2"
    });

    deepEqual(APP.Module4, {
        field1: "value1",
        field2: "value2",
        a: "test",
        c: false,
        d: 0,
        e: ""
    });

});
