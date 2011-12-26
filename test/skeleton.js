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

    // first level fields
    equal(App.getValue(obj, "field_string"), "hello, world!", "string");
    equal(App.getValue(obj, "field_string", "abcd"), "hello, world!", "string with stub value");

    equal(App.getValue(obj, "field_true"), true, "boolean true");
    equal(App.getValue(obj, "field_true", "abcd"), true, "boolean true with stub value");

    equal(App.getValue(obj, "field_false"), false, "boolean false");
    equal(App.getValue(obj, "field_false", "abcd"), false, "boolean false with stub value");

    equal(App.getValue(obj, "field_zero"), 0, "0");
    equal(App.getValue(obj, "field_zero", "abcd"), 0, "0 with stub");

    equal(App.getValue(obj, "field_one"), 1, "1");
    equal(App.getValue(obj, "field_one", "abcd"), 1, "1 with stub");

    deepEqual(App.getValue(obj, "field_object"), {
        "a": "value A",
        "b": "value B"
    }, "object");

    deepEqual(App.getValue(obj, "field_object", "abcd"), {
        "a": "value A",
        "b": "value B"
    }, "object with stub");

    // second level fields
    equal(App.getValue(obj, "sub_fields.field_string"), "hello, world!", "string");
    equal(App.getValue(obj, "sub_fields.field_string", "abcd"), "hello, world!", "string with stub value");

    equal(App.getValue(obj, "sub_fields.field_true"), true, "boolean true");
    equal(App.getValue(obj, "sub_fields.field_true", "abcd"), true, "boolean true with stub value");

    equal(App.getValue(obj, "sub_fields.field_false"), false, "boolean false");
    equal(App.getValue(obj, "sub_fields.field_false", "abcd"), false, "boolean false with stub value");

    equal(App.getValue(obj, "sub_fields.field_zero"), 0, "0");
    equal(App.getValue(obj, "sub_fields.field_zero", "abcd"), 0, "0 with stub");

    equal(App.getValue(obj, "sub_fields.field_one"), 1, "1");
    equal(App.getValue(obj, "sub_fields.field_one", "abcd"), 1, "1 with stub");

    deepEqual(App.getValue(obj, "sub_fields.field_object"), {
        "nested_field": "nested_value"
    }, "object");

    deepEqual(App.getValue(obj, "sub_fields.field_object", "abcd"), {
        "nested_field": "nested_value"
    }, "object with stub");

    // nullable
    equal(App.getValue({a: {b: null}}, "a.b"), null, "nullable");

    // unknown fields
    equal(App.getValue(obj, "unknown_field"), undefined, "unknown field");
    equal(App.getValue(obj, "unknown_field", "abcd"), "abcd", "unknown field with stub value");

    equal(App.getValue(obj, "sub_fields.unknown_field"), undefined, "unknown field at 2 level");
    equal(App.getValue(obj, "sub_fields.unknown_field", "abcd"), "abcd", "unknown field with stub value at 2 level");


    // don't clobber base object with nested objects
    App.getValue(obj, "level1.level2");
    equal(App.getValue(obj, "level1"), undefined, "don't clobber base object with nested objects");


    // wrong name
    equal(App.getValue({a: "value A"}, "a.b.c", "stub"), "stub", "wrong type in hierarhy");
});