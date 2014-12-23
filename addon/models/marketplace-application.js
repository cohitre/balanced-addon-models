import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";
import ErrorsHandler from "./error-handlers/gandalf-base";

var MarketplaceApplication = Model.extend({
  createUri: "/applications",

  updatedAt: BK.computed.parseDate("updated_at"),
  createdAt: BK.computed.parseDate("updated_at"),

  getApiProperties: function() {
    var attributes = this.getProperties(
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
    attributes = Ember.merge(attributes, {
      api_key: this.get("secret"),
    });

    return attributes;
  },

  getErrorsHandler: function() {
    return ErrorsHandler.create({
      model: this
    });
  },
});

MarketplaceApplication.reopenClass({
  adapterName: "balanced-addon-models@adapter:gandalf-api"
});


export default MarketplaceApplication;
