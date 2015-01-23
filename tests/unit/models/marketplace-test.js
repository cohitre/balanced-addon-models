import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:marketplace", "model - Marketplace", {
  needs: [
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/length',
  ]
});

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("ingestJsonItem", function() {
  var deserializedResponse = {
    "in_escrow": 12301,
    "domain_url": "updated.example.com",
    "name": "The Test Marketplace",
    "href": "/marketplaces/TEST-MP6OlNbMkUbLTMT6pM4H3eLj",
    "created_at": "2014-04-07T17:05:56.734920Z",
    "support_email_address": "support@example.com",
    "updated_at": "2014-08-11T20:12:08.438975Z",
    "support_phone_number": "+3331231122",
    "production": false,
    "meta": {},
    "unsettled_fees": 10,
    "id": "TEST-MP6OlNbMkUbLTMT6pM4H3eLj",

    "owner_customer_uri": "/customers/CU6Onsf5OkhscYPT3qS5PwAl",
    "debits_uri": "/debits",
    "callbacks_uri": "/callbacks",
    "credits_uri": "/credits",
    "cards_uri": "/cards",
    "orders_uri": "/orders",
    "card_holds_uri": "/card_holds",
    "settlements_uri": "/settlements",
    "refunds_uri": "/refunds",
    "transactions_uri": "/transactions",
    "bank_accounts_uri": "/bank_accounts",
    "accounts_uri": "/accounts",
    "reversals_uri": "/reversals",
    "disputes_uri": "/disputes",
    "customers_uri": "/customers",
    "events_uri": "/events"
  };

  var s = this.subject();
  deepEqual(s.get("__attributes"), Ember.Object.create());
  s.ingestJsonItem(deserializedResponse);

  MH.shouldMatch(s, {
    "name": "The Test Marketplace",
    "createdAt": new Date("2014-04-07T17:05:56.734920Z"),
    "updatedAt": new Date("2014-08-11T20:12:08.438975Z"),
    "escrowDollars": 123.01,
    "domainUrl": "updated.example.com",
    "href": "/marketplaces/TEST-MP6OlNbMkUbLTMT6pM4H3eLj",
    "supportEmailAddress": "support@example.com",
    "supportPhoneNumber": "+3331231122",
    "isProduction": false,
    "meta": {},
    "unsettledFeesDollars": 0.10,
  });
});

test("#name validations", function() {
  var s = this.subject();

  s.set("name", null);
  deepEqual(s.errors.name, ["can't be blank"]);
  s.set("name", 'cc');
  deepEqual(s.errors.name, []);
});

test("#domainUrl validations", function() {
  var s = this.subject();
  var t = function(val, expectation) {
    s.set("domainUrl", val);
    deepEqual(s.get("errors.domainUrl"), expectation);
  };
  s.set("isTest", true);
  t("xxxxxxx", []);
  t("", []);
  t(null, []);

  s.set("isTest", false);
  t("", ["can't be blank"]);
  t("ccc", []);
});

test("#supportEmailAddress validations", function() {
  var s = this.subject();
  var t = function(val, expectation) {
    s.set("supportEmailAddress", val);
    deepEqual(s.get("errors.supportEmailAddress"), expectation);
  };
  s.set("isTest", true);
  t("xxxxxxx", []);
  t("", []);
  t(null, []);

  s.set("isTest", false);
  t("", ["can't be blank"]);
  t("ccc", []);
});

test("#supportPhoneNumber validations", function() {
  var s = this.subject();
  var t = function(val, expectation) {
    s.set("supportPhoneNumber", val);
    deepEqual(s.get("errors.supportPhoneNumber"), expectation);
  };
  s.set("isTest", true);
  t("xxxxxxx", []);
  t("", []);
  t(null, []);

  s.set("isTest", false);
  t("", ["can't be blank"]);
  t("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", [
    "is too long (maximum is 15 characters)",
    'has invalid character "x" (only "+", "-", "(", ")" spaces and numbers are accepted)'
  ]);
  t("778 999 33333", []);
});

