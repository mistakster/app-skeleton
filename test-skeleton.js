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

test("type checking", function () {

    var L = APP.Lang;

    ok(L.isArray([1, 2]), "true, an array literal is an array");

    ok(!L.isArray({"one": "two"}), "false, an object literal is not an array");

    ok((function () {
        var a = new Array();
        a["one"] = "two";
        return L.isArray(a);
    }()), "however, when declared as an array, it is true");

    ok(!L.isArray(document.getElementsByTagName("body")),
        "false, a collection of elements is like an array, but isn't");

    ok(L.isFunction(function(){}), "a function is a function"); // true
    ok(!L.isFunction({foo: "bar"}), "but an object is not"); // false

    ok(L.isObject({}), "objects");
    ok(L.isObject(function(){}), "functions");
    ok(L.isObject([1,2]), "arrays");

    // primitives are not objects
    ok(!L.isObject(1), "number");
    ok(!L.isObject(true), "boolean");
    ok(!L.isObject("{}"), "string");

});