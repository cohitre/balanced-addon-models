import Ember from "ember";
import BalancedApiBaseAdapter from "./balanced-api-base";

var BalancedApiAdapter = BalancedApiBaseAdapter.extend({
  serializerName: "balanced-addon-models@serializer:rev1",

  host: "https://api.balancedpayments.com",
  accepts: {
    json: "application/vnd.api+json;revision=1.1",
  },
  contentType: 'application/json; charset=UTF-8',

  headers: Ember.computed("encodedApiKey", function() {
    return {
      Authorization: this.get("encodedApiKey"),
    };
  }).readOnly(),

  encodedApiKey: Ember.computed("api_key", function() {
    var apiKey = this.get("api_key");
    if (Ember.isBlank(apiKey)) {
      return null;
    }
    else {
      return 'Basic ' + window.btoa(apiKey + ':');
    }
  }).readOnly(),
});

export default BalancedApiAdapter;
