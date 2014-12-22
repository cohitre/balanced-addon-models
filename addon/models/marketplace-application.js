import Model from "./core/model";
import BK from "./core/method-generators";

var MarketplaceApplication = Model.extend({
  createUri: "/applications",

  updatedAt: BK.computed.parseDate("updated_at"),
  createdAt: BK.computed.parseDate("updated_at"),

  getApiProperties: function() {
    var attributes = {
      api_key: this.get("secret"),
    };
    return attributes;
  }
});

MarketplaceApplication.reopenClass({
  adapterName: "balanced-addon-models@adapter:gandalf-api"
});

//Content-Disposition: form-data; name="marketplace_name"
//Content-Disposition: form-data; name="business_type"
//Content-Disposition: form-data; name="full_name"
//Content-Disposition: form-data; name="owner_email"
//Content-Disposition: form-data; name="owner_phone_number"
//Content-Disposition: form-data; name="domain_url"
//Content-Disposition: form-data; name="support_email"
//Content-Disposition: form-data; name="support_phone_number"
//Content-Disposition: form-data; name="postal_code"
//Content-Disposition: form-data; name="street_address"
//Content-Disposition: form-data; name="current_processor"
//Content-Disposition: form-data; name="current_monthly_volume"
//Content-Disposition: form-data; name="status"


export default MarketplaceApplication;
