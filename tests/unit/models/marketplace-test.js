import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:marketplace", "model - Marketplace", {
  needs: [
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/length',
  ]
});

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("#name validations", function() {
  var s = this.subject();

  s.set("name", null);
  deepEqual(s.errors.name, ["can't be blank"]);
  s.set("name", 'cc');
  deepEqual(s.errors.name, []);
});

test("#domainUrl validations", function() {
  var s = this.subject();
  var t = function(val, expectation) {
    s.set("domainUrl", val);
    deepEqual(s.get("errors.domainUrl"), expectation);
  };
  s.set("isTest", true);
  t("xxxxxxx", []);
  t("", []);
  t(null, []);

  s.set("isTest", false);
  t("", ["can't be blank"]);
  t("ccc", []);
});

test("#supportEmailAddress validations", function() {
  var s = this.subject();
  var t = function(val, expectation) {
    s.set("supportEmailAddress", val);
    deepEqual(s.get("errors.supportEmailAddress"), expectation);
  };
  s.set("isTest", true);
  t("xxxxxxx", []);
  t("", []);
  t(null, []);

  s.set("isTest", false);
  t("", ["can't be blank"]);
  t("ccc", []);
});

test("#supportPhoneNumber validations", function() {
  var s = this.subject();
  var t = function(val, expectation) {
    s.set("supportPhoneNumber", val);
    deepEqual(s.get("errors.supportPhoneNumber"), expectation);
  };
  s.set("isTest", true);
  t("xxxxxxx", []);
  t("", []);
  t(null, []);

  s.set("isTest", false);
  t("", ["can't be blank"]);
  t("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", [
    "is too long (maximum is 15 characters)",
    'has invalid character "x" (only "+", "-", "(", ")" spaces and numbers are accepted)'
  ]);
  t("778 999 33333", []);
});

