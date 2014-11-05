import DS from "ember-data";
import Ember from "ember";

var has = function(value) {
  return !Ember.isBlank(value);
};

var Customer = DS.Model.extend({
  cards: DS.hasMany("cards", {
    async: true
  }),
  bankAccounts: DS.hasMany("bank-account", {
    async: true
  }),

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
    return has(this.get("ein")) || has(this.get("business_name"));
  }),
});

export default Customer;
