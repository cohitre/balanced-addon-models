import Ember from "ember";
import { test, moduleForModel } from 'ember-qunit';

moduleForModel("bank-account", "model - BankAccount", {
  needs: ['model:customer', "model:card"]
});

test("#expectedCreditDaysOffset", function() {
  var account = this.subject();
  equal(account.get("expectedCreditDaysOffset"), 1);
});