import Ember from "ember";

var ApiKeyMerchantPropertiesCreator = Ember.Object.extend({
  getApiProperties: function() {
    var model = this.get("model");
    if (model.get("isPerson")) {
      return this.getPersonApiProperties(model);
    }
    else {
      return this.getBusinessApiProperties(model);
    }
  },

  getMerchantAttributes: function(model) {
    return {
      production: true,
      phone_number: model.get("phone_number"),
      type: model.get("isBusiness") ? "business" : "person"
    };
  },

  getBusinessApiProperties: function(model) {
    Ember.assert("ApiKey model must be of type business", model.get("isBusiness"));

    var businessAttributes = model.get("business");
    var attributes = this.getMerchantAttributes(model);
    attributes.person = model.get("person");
    Ember.merge(attributes, businessAttributes);
    attributes.incorporation_date = model.get("formattedIncorporationDate");

    return {
      merchant: attributes
    };
  },

  getPersonApiProperties: function(model) {
    Ember.assert("ApiKey model must be of type person", model.get("isPerson"));

    var personAttributes = model.get("person");
    var attributes = this.getMerchantAttributes(model);
    Ember.merge(attributes, personAttributes);

    return {
      merchant: attributes
    };
  }
});

export default ApiKeyMerchantPropertiesCreator;
