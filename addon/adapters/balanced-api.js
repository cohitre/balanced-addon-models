import Ember from "ember";
import AjaxAdapter from "./ajax";

var BalancedApiAdapter = AjaxAdapter.extend({
  serializerName: "balanced-addon-models@serializer:rev1",

  host: "https://api.balancedpayments.com",
  accepts: {
    json: "application/vnd.api+json;revision=1.1",
  },
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

  ajax: function(uri, method, settings) {
    if (settings.data && method.toUpperCase() !== "GET") {
      settings.data = JSON.stringify(settings.data);
    }
    return this._super.call(this, uri, method, settings);
  }
});

export default BalancedApiAdapter;
