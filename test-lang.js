module("app-lang");

test("type checking", function () {

    var L = App.Lang;

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