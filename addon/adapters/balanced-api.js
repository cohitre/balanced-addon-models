import Ember from "ember";
import AjaxAdapter from "./ajax";

var BalancedApiAdapter = AjaxAdapter.extend({
  serializerName: "balanced-addon-models@serializer:rev1",

  host: "https://api.balancedpayments.com",
  // accepts: 'application/vnd.balancedpayments+json; version=1.1',
  accepts: "application/vnd.api+json;revision=1.1",
  contentType: 'application/json; charset=UTF-8',

  headers: function() {
    return {
      Authorization: this.get("encodedApiKey"),
    };
  }.property("encodedApiKey"),

  encodedApiKey: function() {
    var apiKey = this.get("api_key");
    if (Ember.isBlank(apiKey)) {
      return null;
    }
    else {
      return 'Basic ' + window.btoa(apiKey + ':');
    }
  }.property("api_key"),
});

export default BalancedApiAdapter;
