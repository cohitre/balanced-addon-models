import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@model:funding-instrument", "model - FundingInstrument");

test("#isBankAccount", function() {
  deepEqual(this.subject().get("isBankAccount"), false);
});

test("#isCard", function() {
  deepEqual(this.subject().get("isCard"), false);
});
