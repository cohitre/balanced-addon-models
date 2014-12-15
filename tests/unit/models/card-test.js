import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:card", "model - Card");

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#isBankAccount", function() {
  deepEqual(this.subject().get("isBankAccount"), false);
});

test("#isCard", function() {
  deepEqual(this.subject().get("isCard"), true);
});
