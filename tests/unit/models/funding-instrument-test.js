import Ember from "ember";
import { test, moduleForModel } from 'ember-qunit';

moduleForModel("funding-instrument", "model - FundingInstrument", {
  needs: ["model:customer"]
});

test("customer relationship", function() {
  var subject = this.store().modelFor("funding-instrument");
  var relationship = Ember.get(subject, "relationshipsByName").get("customer");

  equal(relationship.key, "customer");
  equal(relationship.kind, "belongsTo");
});
