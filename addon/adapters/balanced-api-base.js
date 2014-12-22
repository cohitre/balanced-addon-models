import Ember from "ember";
import AjaxAdapter from "./ajax";

var BalancedApiBaseAdapter = AjaxAdapter.extend({
  serializerName: "balanced-addon-models@serializer:rev1",
  contentType: 'application/json; charset=UTF-8',
  host: "https://api.balancedpayments.com",
  accepts: {
    json: "application/vnd.api+json;revision=1.1",
  },
  headers: Ember.computed(function() {
    return {};
  })
});

export default BalancedApiBaseAdapter;
