import Ember from "ember";
import AjaxAdapter from "./ajax";

var GandalfApiAdapter = AjaxAdapter.extend({
  serializerName: "balanced-addon-models@serializer:rev1",

  host: "http://localhost:8111",
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
});

export default GandalfApiAdapter;
