import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import ValidationHelpers from "balanced-addon-models/utils/validation-helpers";

module("util - ValidationHelpers");

test("#validateAppearsOnStatementAsFormat", function() {
  var t = generateTest("validateAppearsOnStatementAsFormat");

  t("this value works");
  t("this value doesnt work, because of the comma", 'has invalid character ","');
});

test("#validatePhoneFormat", function() {
  var t = generateTest("validatePhoneFormat");

  t("102 111 3333");
  t("123.123.1222", 'has invalid character "." (only "+", "-", "(", ")" spaces and numbers are accepted)');
});

function generateTest(methodName) {
  return function(val, expectation) {
    var result = ValidationHelpers[methodName](val, true);
    deepEqual(result, expectation);
  };
}

test("#validateDateFormat", function() {
  var t = generateTest("validateDateFormat");

  t("12 / 1000", "invalid year 1000");
  t("12 / 2000");
  t("12/2000");
  t("13 / 2000", "invalid month 13");
  t("0 / 2000", "invalid month 0");
  t("1 / 2000");
  t("12-2000");
  t("12 - 2000");
  t("123/2000", "invalid date format");
});
