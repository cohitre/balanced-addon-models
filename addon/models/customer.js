import DS from "ember-data";
import Ember from "ember";

var has = function(model, attribute) {
  return !Ember.isBlank(model.get(attribute));
};

var Customer = DS.Model.extend({
//  destination: DS.belongsTo("funding-instrument"),

  name: DS.attr(),

  business_name: DS.attr(),

  dob_month: DS.attr('number'),
  dob_year: DS.attr('number'),

  ein: DS.attr(),
  email: DS.attr(),

  phone: DS.attr(),
  ssn_last4: DS.attr(),

  created_at: DS.attr("date"),
  updated_at: DS.attr("date"),

  isBusiness: Ember.computed("ein", "business_name", function() {
    return has(this, "ein") || has(this, "business_name");
  }),
});

export default Customer;
