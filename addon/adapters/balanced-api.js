import Ember from "ember";
import JsonApiAdapter from 'ember-json-api/json_api_adapter';

export default JsonApiAdapter.extend({
  host: 'https://api.balancedpayments.com',

  headers: Ember.computed(function() {
    return {
      Authorization: this.get("encodedAuthorization")
    };
  }).property("encodedAuthorization"),

  encodedAuthorization: Ember.computed("apiKey", function() {
    return 'Basic ' + window.btoa(this.get("apiKey") + ':');
  }),

  findUri: function(store, typeName, uri, recordArray) {
    return this.ajax(this.urlPrefix(uri), "GET").then(function(response) {
      recordArray.set("balanced-meta", response.meta);
      return response;
    });
  },

  findQuery: function(store, typeName, query, recordArray) {
    // There's no obvious way to set the meta since we delete it inside the serializer
    // ideally we could just set it to be "meta", but meta is used for store.metaData
    return this._super(store, typeName, query).then(function(response) {
      recordArray.set("balanced-meta", response.meta);
      return response;
    });
  },
});
