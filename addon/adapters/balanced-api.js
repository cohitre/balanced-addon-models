import Ember from "ember";
import JsonApiAdapter from 'ember-json-api/json_api_adapter';

var BalancedApiAdapter = JsonApiAdapter.extend({
  host: 'https://api.balancedpayments.com',

  headers: Ember.computed(function() {
    return {
      Authorization: this.get("encodedAuthorization")
    };
  }).property("encodedAuthorization"),

  encodedAuthorization: Ember.computed("apiKey", function() {
    return 'Basic ' + window.btoa(this.get("apiKey") + ':');
  })
});

export default BalancedApiAdapter;
