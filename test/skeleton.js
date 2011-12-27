module("app-skeleton");

test("namespace basic", function () {

    expect(7);

    var ns = App.namespace;

    ok(ns("App.Module1"), "create module 1");
    ok(App.Module1, "check module 1");

    ok(ns("Module2"), "create module 2");
    ok(App.Module2, "check module 2");

    App.Module1.field1 = "field 1";
    App.Module1.method1 = function (a, b) {
        return a + b;
    };

    equal(ns("App.Module1"), App.Module1, "get module 1");

    ok(ns("App.Module1.SubModule"), "sub module");

    raises(ns("App.Module1.field1.wrongUse"));

});

test("namespace extend", function () {

    expect(5);

    var ns = App.namespace;

    var o = {
        field1: "field 1",
        method1: function (a, b) {
            return a + b;
        },
        getContext: function () {
            return this;
        }
    };

    var subModule = ns("App.Module3.SubModule", o);

    ok(App.Module3.SubModule.field1);
    ok(App.Module3.SubModule.method1);

    equals(App.Module3.SubModule.getContext(), subModule, "right context");

    ns("App.Module3.SubModule", {
        field2: "field 2"
    });

    equals(App.Module3.SubModule.field1, "field 1");
    equals(App.Module3.SubModule.field2, "field 2");

});

test("partial extend", function () {

    expect(3);

    var ns = App.namespace;

    var o = {
        a: "test",
        b: null,
        c: false,
        d: 0,
        e: "",
        f: (function (undef) { return undef; })()
    };

    ns("App.Module4", o);

    equals(App.Module4, o);

    ns("App.Module4", {
        field1: "data"
    });

    deepEqual(App.Module4, {
        field1: "data",
        a: "test",
        c: false,
        d: 0,
        e: ""
    });

    ns("App.Module4", {
        field1: "value1",
        field2: "value2"
    });

    deepEqual(App.Module4, {
        field1: "value1",
        field2: "value2",
        a: "test",
        c: false,
        d: 0,
        e: ""
    });

});


test("defaults", function () {

    App.defaults("Search", {
        url: "/search/"
    });

    App.defaults("App.Search", {
        url: "/search/new",
        params: [1, 2, 3]
    });

    deepEqual(App.defaults("Search"), {
        url: "/search/new",
        params: [1, 2, 3]
    });


    App.defaults("App.Module", {
        url: "/module/2",
        param1: true,
        param2: false
    });

    App.defaults("Module", {
        url: "/module/1"
    });

    deepEqual(App.defaults("Module"), {
        url: "/module/1",
        param1: true,
        param2: false
    });

});


test("safe value", function () {

    var obj = {
        field_string: "hello, world!",
        field_true: true,
        field_false: false,
        field_zero: 0,
        field_one: 1,
        field_object: {
            "a": "value A",
            "b": "value B"
        },
        sub_fields: {
            field_string: "hello, world!",
            field_true: true,
            field_false: false,
            field_zero: 0,
            field_one: 1,
            field_object: {
                "nested_field": "nested_value"
            }
        }
    };

    // store object
    App.defaults("Data", obj);

    // first level fields
    equal(App.defaults("Data", "field_string"), "hello, world!", "string");
    equal(App.defaults("Data", "field_string", "abcd"), "hello, world!", "string with stub value");

    equal(App.defaults("Data", "field_true"), true, "boolean true");
    equal(App.defaults("Data", "field_true", "abcd"), true, "boolean true with stub value");

    equal(App.defaults("Data", "field_false"), false, "boolean false");
    equal(App.defaults("Data", "field_false", "abcd"), false, "boolean false with stub value");

    equal(App.defaults("Data", "field_zero"), 0, "0");
    equal(App.defaults("Data", "field_zero", "abcd"), 0, "0 with stub");

    equal(App.defaults("Data", "field_one"), 1, "1");
    equal(App.defaults("Data", "field_one", "abcd"), 1, "1 with stub");

    deepEqual(App.defaults("Data", "field_object"), {
        "a": "value A",
        "b": "value B"
    }, "object");

    deepEqual(App.defaults("Data", "field_object", "abcd"), {
        "a": "value A",
        "b": "value B"
    }, "object with stub");

    // second level fields
    equal(App.defaults("Data", "sub_fields.field_string"), "hello, world!", "string");
    equal(App.defaults("Data", "sub_fields.field_string", "abcd"), "hello, world!", "string with stub value");

    equal(App.defaults("Data", "sub_fields.field_true"), true, "boolean true");
    equal(App.defaults("Data", "sub_fields.field_true", "abcd"), true, "boolean true with stub value");

    equal(App.defaults("Data", "sub_fields.field_false"), false, "boolean false");
    equal(App.defaults("Data", "sub_fields.field_false", "abcd"), false, "boolean false with stub value");

    equal(App.defaults("Data", "sub_fields.field_zero"), 0, "0");
    equal(App.defaults("Data", "sub_fields.field_zero", "abcd"), 0, "0 with stub");

    equal(App.defaults("Data", "sub_fields.field_one"), 1, "1");
    equal(App.defaults("Data", "sub_fields.field_one", "abcd"), 1, "1 with stub");

    deepEqual(App.defaults("Data", "sub_fields.field_object"), {
        "nested_field": "nested_value"
    }, "object");

    deepEqual(App.defaults("Data", "sub_fields.field_object", "abcd"), {
        "nested_field": "nested_value"
    }, "object with stub");

    // nullable
    App.defaults("Nullable", {a: {b: null}});
    equal(App.defaults("Nullable", "a.b"), null, "nullable");

    // unknown fields
    equal(App.defaults("Data", "unknown_field"), undefined, "unknown field");
    equal(App.defaults("Data", "unknown_field", "abcd"), "abcd", "unknown field with stub value");

    equal(App.defaults("Data", "sub_fields.unknown_field"), undefined, "unknown field at 2 level");
    equal(App.defaults("Data", "sub_fields.unknown_field", "abcd"), "abcd", "unknown field with stub value at 2 level");


    // don't clobber base object with nested objects
    App.defaults("Data", "level1.level2");
    equal(App.defaults("Data", "level1"), undefined, "don't clobber base object with nested objects");


    // wrong name
    App.defaults("Wrong", {a: "value A"});
    equal(App.defaults("Wrong", "a.b.c", "stub"), "stub", "wrong type in hierarhy");
});