import Ember from "ember";

var IS_PRODUCTION = false;
var ApiKeyMerchantPropertiesCreator = Ember.Object.extend({
  getApiProperties: function() {
    var model = this.get("model");
    var attributes = model.get("isPerson") ?
      this.getPersonApiProperties(model) :
      this.getBusinessApiProperties(model);

    return {
      merchant: attributes
    };
  },

  getBusinessApiProperties: function(model) {
    Ember.assert("ApiKey model must be of type business", model.get("isBusiness"));

    return {
      type: "business",
      production: IS_PRODUCTION,

      name: model.get("businessName"),
      tax_id: model.get("businessTaxId"),
      address: model.get("businessAddressLine1"),
      postal_code: model.get("businessAddressPostalCode"),
      phone_number: model.get("businessPhoneNumber"),
      incorporation_date: model.get("formattedIncorporationDate"),

      person: this.getPersonAttributes(model)
    };
  },

  getPersonApiProperties: function(model) {
    Ember.assert("ApiKey model must be of type person", model.get("isPerson"));

    var defaults = {
      type: "person",
      production: IS_PRODUCTION,
    };
    return Ember.merge(defaults, this.getPersonAttributes(model));
  },

  getPersonAttributes: function(model) {
    return {
      ssn_last_4: model.get("personSsnLast4"),
      name: model.get("personFullName"),
      dob: model.get("formattedPersonDateOfBirth"),
      postal_code: model.get("personAddressPostalCode"),
      phone_number: model.get("personPhoneNumber"),
    };
  },

});

export default ApiKeyMerchantPropertiesCreator;
