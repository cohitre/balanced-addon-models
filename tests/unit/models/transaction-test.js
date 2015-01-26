import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:transaction", "model - Transaction", {
  needs: [
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence'
  ]
});

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("validations (amount)", MH.shouldHaveAmountValidations());

test("validations (amountDollars)", function() {
  var s = this.subject();
  s.set("amount", "-10");
  deepEqual(s.get("errors.amountDollars"), [
    "must be greater than 0"
  ]);
  deepEqual(s.get("errors.amount"), [
    "must be greater than 0"
  ]);
});
