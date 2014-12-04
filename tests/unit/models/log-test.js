import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:log", "model - Log");

test("#adapter", MH.shouldUseBalancedApiAdapter());

test("#isStatusSucceeded", function() {
  var subject = this.subject();
  var check = function(status, expectation) {
    subject.set("status_rollup", status);
    deepEqual(subject.get("isStatusSucceeded"), expectation);
  };

  check("2XX", true);
  check("3XX", false);
  check("4XX", false);
  check("5XX", false);
});

test("#isStatusFailed", function() {
  var subject = this.subject();
  var check = function(status, expectation) {
    subject.set("status_rollup", status);
    deepEqual(subject.get("isStatusFailed"), expectation);
  };

  check("2XX", false);
  check("3XX", true);
  check("4XX", true);
  check("5XX", true);
});
