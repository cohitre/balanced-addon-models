import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:base", "adapter - Base");

test("#fetch", shouldThrowError("fetch"));
test("#create", shouldThrowError("create"));
test("#update", shouldThrowError("update"));
test("#del", shouldThrowError("del"));

function shouldThrowError(method) {
  return function() {
    var message = "Assertion Failed: Your adapter should override #" + method;
    try {
      var s = this.subject();
      s[method]();
    }
    catch (e) {
      deepEqual(e.message, message);
    }
  };
}
