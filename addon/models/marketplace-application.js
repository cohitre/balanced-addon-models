import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";
import ErrorsHandler from "./error-handlers/gandalf-base";

var MarketplaceApplication = Model.extend({
  updatedAt: BK.computed.parseDate("updated_at"),
  createdAt: BK.computed.parseDate("updated_at"),

  current_monthly_volume: 0,
  createUri: "/applications/",
  href: Ember.computed("id", function() {
    return "/applications/" + this.get("id") + "/";
  }),

  isAccepted: Ember.computed.equal("status", "ACCEPTED").readOnly(),
  isPending: Ember.computed.equal("status", "PENDING").readOnly(),
  isRejected: Ember.computed.equal("status", "REJECTED").readOnly(),
  ingestApiKey: function(apiKey) {
    this.setProperties({
      api_key: apiKey.get("secret"),
      business_type: apiKey.get("type"),
      full_name: apiKey.get("personFullName"),
      street_address: apiKey.get("personAddressPostalCode"),
      postal_code: apiKey.get("personAddressPostalCode"),
    });
    return this;
  },

  ingestUser: function(user) {
    this.setProperties({
      owner_email: user.get("email_address"),
    });
    return this;
  },

  ingestMarketplace: function(marketplace) {
    this.setProperties({
      merchant_uri: marketplace.get("href"),
      marketplace_name: marketplace.get("name"),
      owner_phone_number: marketplace.get("supportPhoneNumber"),
      support_email: marketplace.get("supportEmailAddress"),
      support_phone_number: marketplace.get("supportPhoneNumber"),
      domain_url: marketplace.get("domainUrl"),
    });
    return this;
  },

  getApiProperties: function() {
    return this.getProperties(
      "marketplace_name",
      "business_type",
      "full_name",
      "owner_email",
      "owner_phone_number",
      "merchant_uri",
      "domain_url",
      "support_email",
      "support_phone_number",
      "postal_code",
      "street_address",
      "current_processor",
      "current_monthly_volume",
      "api_key"
    );
  },

  getDebuggingProperties: function() {
    return this.getProperties(
      "id",
      "marketplace_name",
      "business_type",
      "full_name",
      "owner_email",
      "owner_phone_number",
      "merchant_uri",
      "domain_url",
      "support_email",
      "support_phone_number",
      "postal_code",
      "street_address",
      "current_processor",
      "current_monthly_volume"
    );
  },

  getErrorsHandler: function() {
    return ErrorsHandler.create({
      model: this
    });
  },
});

MarketplaceApplication.reopenClass({
  serializerName: "balanced-addon-models@serializer:gandalf",
  adapterName: "balanced-addon-models@adapter:gandalf-api"
});

export default MarketplaceApplication;
