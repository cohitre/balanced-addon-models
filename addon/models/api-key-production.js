import Ember from "ember";
import ApiKey from "./api-key";
import ApiKeyProductionErrorsHandler from "./error-handlers/api-key-production";
import ApiKeyMerchantPropertiesCreator from "./support/api-key-merchant-properties-creator";

var VALID_DATE_FORMAT = /^(\d\d?)(\s*[-\/]\s*)(\d\d\d\d)$/;

var ApiKeyProduction = ApiKey.extend({
  getErrorsHandler: function() {
    return ApiKeyProductionErrorsHandler.create({
      model: this
    });
  },
  type: "person",

  isPerson: Ember.computed.equal("type", "person").readOnly(),
  isBusiness: Ember.computed.equal("type", "business").readOnly(),

  marketplaceCategory: "crowdfunding",

  businessType: Ember.computed(function(attr, value) {
    if (arguments.length > 1) {
      if (value === "person") {
        this.set("type", "person");
      }
      else {
        this.set("type", "business");
      }
    }
    return value;
  }),

  getApiProperties: function() {
    return getApiKeyPropertiesCreator(this).getApiProperties();
  },

  business: Ember.computed(function() {
    return Ember.Object.create();
  }),
  person: Ember.computed(function() {
    return Ember.Object.create();
  }),

  formattedIncorporationDate: Ember.computed("incorporationDate", function() {
    var date = this.get("incorporationDate") || "";
    var match = date.match(VALID_DATE_FORMAT);
    if (Ember.isBlank(match)) {
      return null;
    }
    else {
      var year = parseInt(match[3]);
      var month = parseInt(match[1]);
      if (month < 10) {
        return "" + year + "-0" + month;
      }
      else {
        return "" + year + "-" + month;
      }
    }
  }),
});

function getApiKeyPropertiesCreator(model) {
  return ApiKeyMerchantPropertiesCreator.create({
    model: model
  });
}

export default ApiKeyProduction;
