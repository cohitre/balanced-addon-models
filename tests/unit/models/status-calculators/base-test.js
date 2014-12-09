import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@model:status-calculators/base", "status-calcualtor - Base");

test("defaults", function() {
  var subject = this.subject();
  deepEqual(subject.get("alertType"), "loading");
  deepEqual(subject.get("label"), "Loading");
});

test("#info", testAutomaticSetter("info", "info", "Information"));
test("#success", testAutomaticSetter("success", "success", "Success"));
test("#error", testAutomaticSetter("error", "danger", "Error"));
test("#warning", testAutomaticSetter("warning", "warning", "Warning"));

function testAutomaticSetter(methodName, alertType, defaultLabel) {
  return function() {
    var subject = this.subject();
    subject[methodName]("xxxxxxxx");
    deepEqual(subject.get("alertType"), alertType);
    deepEqual(subject.get("label"), defaultLabel);
    deepEqual(subject.get("value"), "xxxxxxxx");

    subject[methodName]("xxxxxxxx", "Cool");
    deepEqual(subject.get("alertType"), alertType);
    deepEqual(subject.get("label"), "Cool");
    deepEqual(subject.get("value"), "xxxxxxxx");
  };
}
