import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@model:bank-account", "model - BankAccount");

test("#isBankAccount", function() {
  deepEqual(this.subject().get("isBankAccount"), true);
});

test("#isCard", function() {
  deepEqual(this.subject().get("isCard"), false);
});
