import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:api-key-production", "model - ApiKeyProduction", {
  needs: [
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/inclusion',
    'ember-validations@validator:local/length',
    'ember-validations@validator:local/format'
  ]
});

test("#adapter", MH.shouldUseBalancedApiAdapter("balanced-addon-models@adapter:balanced-api"));
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("businessType validations", function() {
  var self = this;
  var t = function(value, expectation) {
    var s = self.subject();
    s.set("businessType", value);
    deepEqual(s.errors.businessType, expectation);
  };

  t(null, [
    "can't be blank",
    "is not included in the list"
  ]);
  t("ccccc", ["is not included in the list"]);
  t("llc", []);
  t("person", []);
});

test("businessName validations", mustBePresentIfBusiness("businessName"));
test("businessAddressLine1 validations", mustBePresentIfBusiness("businessAddressLine1"));

test("businessTaxId validations", function() {
  var s = this.subject();
  var t = function(value, expectation) {
    s.set("businessTaxId", value);
    deepEqual(s.errors.businessTaxId, expectation);
  };

  s.set("businessType", "llc");
  t(null, ["can't be blank", "must match format 12-1234567"]);
  t("", ["can't be blank", "must match format 12-1234567"]);
  t("xx", ["must match format 12-1234567"]);
  t("99-0000000", []);
  s.set("businessType", "person");
  t(null, []);
});

test("personFullName validations", mustBePresent("personFullName"));
test("personSsnLast4 validations", function() {
  var s = this.subject();
  var t = function(value, expectation) {
    s.set("personSsnLast4", value);
    deepEqual(s.errors.personSsnLast4, expectation);
  };

  s.set("businessType", "llc");
  t(null, ["can't be blank", "is the wrong length (should be 4 characters)", "must be digits only"]);
  t("", ["can't be blank", "is the wrong length (should be 4 characters)", "must be digits only"]);
  t("xx", ["is the wrong length (should be 4 characters)", "must be digits only"]);
  t("1234", []);
  t("xxxxxxxxxxxxxxxxxxxxxxxxxx", ["is the wrong length (should be 4 characters)", "must be digits only"]);
  s.set("businessType", "person");
  t(null, ["can't be blank", "is the wrong length (should be 4 characters)", "must be digits only"]);
  t("1234", []);
});

test("personDateOfBirth", function() {
  var s = this.subject();
  var t = function(value, expectation) {
    s.set("personDateOfBirth", value);
    deepEqual(s.errors.personDateOfBirth, expectation);
  };

  s.set("businessType", "llc");
  t(null, ["can't be blank", "invalid date format"]);
  t("12 / 1000", ["invalid year 1000"]);
  t("12 / 1799", ["invalid year 1799"]);
  t("01 / 2000", []);
  t("1 / 2000", []);
  t("-01 / 2000", ["invalid date format"]);
  t("13 / 2000", ["invalid month 13"]);
});

test("personPhoneNumber", function() {
  var s = this.subject();
  var t = function(value, expectation) {
    s.set("personPhoneNumber", value);
    deepEqual(s.errors.personPhoneNumber, expectation);
  };

  s.set("businessType", "llc");
  t(undefined, undefined);
  s.set("businessType", "person");
  t("", ["can't be blank"]);
  t("1111111111111111111111111111111111", ["is too long (maximum is 15 characters)"]);
  t("123 333 4444", []);
  t("333 4444 ext1", ['has invalid character "e" (only "+", "-", "(", ")" spaces and numbers are accepted)']);
});

test("#type", function() {
  var subject = this.subject();
  deepEqual(subject.get("type"), "business");

  subject.set("businessType", "person");
  deepEqual(subject.get("type"), "person");

  subject.set("businessType", "llc");
  deepEqual(subject.get("type"), "business");
});

test("#isPerson", function() {
  var subject = this.subject();
  deepEqual(subject.get("isPerson"), false);

  subject.set("businessType", "person");
  deepEqual(subject.get("isPerson"), true);
});

test("#isBusiness", function() {
  var subject = this.subject();
  deepEqual(subject.get("isBusiness"), true);

  subject.set("businessType", "person");
  deepEqual(subject.get("isBusiness"), false);
});

test("#getApiProperties", function() {
  var subject = this.subject();
  subject.setProperties({
    businessType: "person",

    personDateOfBirth: "10 / 2000",
    personFullName: "Tom Person",
    personPhoneNumber: "11111",
    personAddressPostalCode: "99999",
    personSsnLast4: "1111",

    businessName: "Important Inc.",
    businessAddressLine1: "222 Main St",
    businessAddressPostalCode: "11222",
    businessIncorporationDate: "12/2000",
    businessPhoneNumber: "777-2020",
    businessTaxId: "888-9999",
  });

  deepEqual(subject.getApiProperties(), {
    merchant: {
      production: true,
      type: "person",

      name: "Tom Person",
      dob: "2000-10",
      phone_number: "11111",
      postal_code: "99999",
      ssn_last_4: "1111",
    }
  });

  subject.set("businessType", "llc");

  deepEqual(subject.getApiProperties(), {
    merchant: {
      type: "business",

      name: "Important Inc.",
      incorporation_date: "2000-12",
      tax_id: "888-9999",
      phone_number: "777-2020",
      address: "222 Main St",
      postal_code: "11222",
      production: true,
      person: {
        dob: "2000-10",
        name: "Tom Person",
        phone_number: "11111",
        postal_code: "99999",
        ssn_last_4: "1111"
      },
    }
  });
});

function mustBePresentIfBusiness(field) {
  return function() {
    var s = this.subject();
    var t = function(value, expectation) {
      s.set(field, value);
      deepEqual(s.errors[field], expectation);
    };

    s.set("businessType", "s-corp");
    t(null, ["can't be blank"]);
    t("", ["can't be blank"]);
    t("some name", []);
    s.set("businessType", "person");
    t(null, []);
  };
}

function mustBePresent(field) {
  return function() {
    var s = this.subject();
    var t = function(value, expectation) {
      s.set(field, value);
      deepEqual(s.errors[field], expectation);
    };

    s.set("businessType", "s-corp");
    t(null, ["can't be blank"]);
    t("", ["can't be blank"]);
    t("some name", []);
    s.set("businessType", "person");
    t(null, ["can't be blank"]);
    t("", ["can't be blank"]);
    t("some name", []);
  };
}
