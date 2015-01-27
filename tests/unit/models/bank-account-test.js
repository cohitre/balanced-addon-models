import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:bank-account", "model - BankAccount");

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("#isBankAccount", MH.shouldBe("isBankAccount", true));
test("#isCard", MH.shouldBe("isCard", false));

test("properties", function() {
  var s = this.subject();
  s.ingestJsonItem({
    "routing_number": "012345678",
    "bank_name": "Fancy Bank Inc.",
    "account_type": "checking",
    "name": "Cool Customer",
    "can_credit": true,
    "can_debit": true,
    "meta": {},
    "account_number": "xx8888",
    "address": {
      "city": null,
    }
  });

  MH.shouldMatch(s, {
    routingNumber: "012345678",
    bankName: "Fancy Bank Inc.",
    accountType: "checking",
    isChecking: true,
    isSavings: false,
    name: "Cool Customer",
    canCredit: true,
    canDebit: true,
    meta: {},
    number: "xx8888",
    numberLastFour: "8888",
    address: {
      city: null,
    }
  });
});

test("#getApiProperties", function() {
  var s = this.subject();

  s.set("__attributes.account_number", "123456789");
  s.set("__attributes.name", "King K. Rool");
  s.setProperties({
    accountType: "checking",
    routingNumber: "12345",
    address: {},
  });

  deepEqual(s.getApiProperties(), {
    account_number: "123456789",
    account_type: "checking",
    name: "King K. Rool",
    routing_number: "12345",
    address: {}
  });
});
