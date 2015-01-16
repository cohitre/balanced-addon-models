import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";
import responses from "../../helpers/balanced-responses";

var balanced = {
  card: {
    create: function(attributes, callback) {
      callback(balanced.response);
    }
  }
};

moduleFor("balanced-addon-models@controller:debit-card", "Controller - DebitCard", {
  setup: function() {
    window.balanced = balanced;
  },
  needs: [
    "balanced-addon-models@store:balanced",
    "balanced-addon-models@model:debit",
    "balanced-addon-models@model:card",
    "balanced-addon-models@serializer:rev1",
    "balanced-addon-models@adapter:balanced-api",
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence'
  ]
});


test("#save", function() {
  var store = this.container.lookup("balanced-addon-models@store:balanced", {
    apiKey: "ak-test-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  });
  var s = this.subject();

  var card = store.build("card", {
    number: "10000000000"
  });
  var debit = store.build("debit", {
    amount: -10
  });

  var ajax = sinon.stub(jQuery, "ajax");

  s.save(card, debit)
    .then(undefined, function() {
      deepEqual(debit.get("errors.amount"), ["must be greater than or equal to 0"]);
    })
    .then(function() {
      debit.set("amount", 10);
      balanced.response = responses.card.allEmpty;
      return s.save(card, debit);
    })
    .then(undefined, function() {
      deepEqual(card.get('errors.number'), ['Invalid field [number] - Missing field "number"','Invalid field [number] - "undefined" is not a valid credit card number']);
      deepEqual(card.get('errors.expiration_month'), ['Invalid field [expiration_month] - Missing field "expiration_month"','Invalid field [expiration_month,expiration_year] - "undefined-undefined" is not a valid credit card expiration date']);
      deepEqual(card.get('errors.expiration_year'), ['Invalid field [expiration_year] - Missing field "expiration_year"','Invalid field [expiration_month,expiration_year] - "undefined-undefined" is not a valid credit card expiration date']);
      deepEqual(card.get('errors._root'), ['There was a validation error when submitting your request.']);
    })
    .then(function() {
      balanced.response = responses.card.success;
      return s.save(card, debit);
    })
    .then(undefined, function(e) {
      deepEqual(card.get("errors._root"), []);
      deepEqual(debit.get("errors._root"), []);
    });
});
