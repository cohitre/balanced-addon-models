import Ember from "ember";
import { test, moduleForModel } from 'ember-qunit';

moduleForModel("card", "model - Card", {
  needs: ['model:customer', "model:bank-account"]
});

test("#expectedCreditDaysOffset", function() {
  var account = this.subject();
  equal(account.get("expectedCreditDaysOffset"), 2);
});
