import Ember from "ember";
import { test, moduleForModel } from 'ember-qunit';

moduleForModel("customer", "model - Customer", {
  needs: ['model:bank-account']
});

var checkAttribute = function(test, attributeName, value, attributes) {
  var s = test.subject(attributes);
  deepEqual(s.get(attributeName), value);
};

test('customer relationship', function() {
  var subject = this.store().modelFor('customer');
  var relationship = Ember.get(subject, 'relationshipsByName').get('bankAccounts');

  equal(relationship.key, 'bankAccounts');
  equal(relationship.kind, 'hasMany');
});

test("#isBusiness with ein", function() {
  checkAttribute(this, "isBusiness", true, {
    ein: "10000000"
  });
});

test("#isBusiness with business_name", function() {
  checkAttribute(this, "isBusiness", true, {
    business_name: "Cool Company"
  });
});

test("#isBusiness without ein or business_name", function() {
  checkAttribute(this, "isBusiness", false, {});
});
