import DS from "ember-data";
import Collection from "../lib/collection";

var Marketplace = DS.Model.extend({
  customers: DS.hasMany("customer", {
    async: true
  }),

  getCustomersCollection: function(attributes) {
    var collection = Collection.create({
      modelType: "customer",
      store: this.store,
      attributes: attributes
    });
    collection.reload();
    return collection;
  },

  name: DS.attr("string"),
  created_at: DS.attr("date"),
  updated_at: DS.attr("date"),

  in_escrow: DS.attr("number"),
  unsettled_fees: DS.attr("number"),
  domain_url: DS.attr("string"),

  support_email_address: DS.attr("string"),
  support_phone_number: DS.attr("string"),

  production: DS.attr("boolean"),
  meta: DS.attr()
});

export default Marketplace;
