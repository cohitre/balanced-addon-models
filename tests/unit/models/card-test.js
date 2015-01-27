import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:card", "model - Card");

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("#isBankAccount", MH.shouldBe("isBankAccount", false));
test("#isCard", MH.shouldBe("isCard", true));

test("#isExpired", function() {
  var s = this.subject();
  s.set("expirationMonth", 10);
  s.set("__attributes.expiration_year", 2000);
  deepEqual(s.get("isExpired"), true, "10 / 2000 should be expired");

  s.set("expirationYear", "3020");
  deepEqual(s.get("isExpired"), false, "10 / 3020 should be valid");
});

test("#expirationDate (get)", function() {
  var s = this.subject();
  s.set("expirationMonth", 10);
  s.set("__attributes.expiration_year", 2020);

  var date = s.get("expirationDate");
  deepEqual(date.toISOString(), "2020-10-31T23:59:59.999Z");
});

test("#expirationDate (set)", function() {
  var s = this.subject();
  var test = function(value, month, year) {
    s.set("expirationDate", value);
    var date = s.get("expirationDate");
    deepEqual(s.get("expirationMonth"), month);
    deepEqual(s.get("expirationYear"), year);
  };

  test("10/2020", 10, 2020);
  test("vlrjbvkrjbvr", null, null);
  test("          09         -2030", 9, 2030);
  test("1/2000", 1, 2000);
});

test("#getApiProperties", function() {
  var s = this.subject();
  s.set("__attributes.expiration_month", 10);
  s.set("__attributes.name", "Toe Mato");
  s.set("cvv", "333");
  s.set("expirationYear", "2020");
  s.set("number", "4111 1111 1111 1111");

  deepEqual(s.getApiProperties(), {
    expiration_year: 2020,
    expiration_month: 10,
    number: "4111 1111 1111 1111",
    cvv: "333",
    name: "Toe Mato",
    address: null
  });
});

test("properties", function() {
  var s = this.subject();

  s.ingestJsonItem({
      "cvv_result": "Match",
      "number": "xxxxxxxxxxx1111",
      "avs_postal_match": "yes",
      "expiration_month": 10,
      "meta": {},
      "category": "other",
      "type": "credit",
      "cvv_match": "yes",
      "bank_name": "",
      "avs_street_match": "yes",
      "brand": "American Express",
      "can_debit": true,
      "name": "Toe Mato",
      "expiration_year": 2020,
      "cvv": "xxx",
      "is_verified": true,
      "avs_result": "Postal code and street address match.",
      "can_credit": false,
      "address": {
        "city": "Balo Alto",
        "line2": null,
        "line1": null,
        "state": "CA",
        "postal_code": "",
        "country_code": null
      },
    });

  MH.shouldMatch(s, {
    name: "Toe Mato",
    number: "xxxxxxxxxxx1111",
    numberLastFour: "1111",
    expirationMonth: 10,
    expirationYear: 2020,
    type: "credit",
    isCredit: true,
    isDebit: false,

    brand: "American Express",

    canCredit: false,
    canDebit: true,
    cvv: "xxx",
    meta: {},
    address: {
      "city": "Balo Alto",
      "line2": null,
      "line1": null,
      "state": "CA",
      "postal_code": "",
      "country_code": null
    },
  });
});
