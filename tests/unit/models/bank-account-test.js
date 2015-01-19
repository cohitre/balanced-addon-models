import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:bank-account", "model - BankAccount");

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("#isBankAccount", function() {
  deepEqual(this.subject().get("isBankAccount"), true);
});

test("#isCard", function() {
  deepEqual(this.subject().get("isCard"), false);
});

test("#lastFour", function() {
  var s = this.subject();
  deepEqual(s.get("lastFour"), null);
  s.set("account_number", "xxxxxxxxx12345");
  deepEqual(s.get("lastFour"), "2345");
});

test("#getApiProperties", function() {
  var s = this.subject();

  s.setProperties({
    account_number: "123456789",
    account_type: "checking",
    name: "King K. Rool",
    routing_number: "12345",
    address: {}
  });

  deepEqual(s.getApiProperties(), {
    account_number: "123456789",
    account_type: "checking",
    name: "King K. Rool",
    routing_number: "12345",
    address: {}
  });

});

test("#getBalancedJsModel", function() {
  var old = window.balanced.bankAccount;
  window.balanced.bankAccount = "cool";
  deepEqual(this.subject().getBalancedJsModel(), "cool");
  window.balanced.bankAccount = old;
});
